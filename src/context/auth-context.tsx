'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // For checking token expiry client-side
import api, { setAuthContextForInterceptors } from '@/lib/api';
import { User } from '@/models/user';


interface AuthResponse {
  token: string;
  user: User;
}

interface LoginRequest{
    login:string;
    password:string;
}

interface RegisterRequest{
    username:string;
    email:string;
    password:string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (details: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  // For interceptor communication
  getAccessToken: () => string | null;
  setAuthInfo: (token: string | null, user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setMemoryAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true until initial check is done

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Failed to decode token for expiry check", error);
      return true; // Treat as expired if decoding fails
    }
  };
  
  const setAuthInfo = useCallback((token: string | null, userObj: User | null) => {
    if (token && userObj && !isTokenExpired(token)) {
      setMemoryAccessToken(token);
      setUser(userObj);
    } else {
      setMemoryAccessToken(null);
      setUser(null);
      if (token && isTokenExpired(token)) {
        console.log("Attempted to set an expired token.");
      }
    }
  }, []);


  // Try to refresh token on initial app load
  useEffect(() => {
    const attemptRefresh = async () => {
      console.log('AuthProvider: Attempting initial token refresh...');
      setIsLoading(true);
      try {
        const response = await api.post<AuthResponse>('/auth/refresh');
        const { token, user: refreshedUser } = response.data;
        if (token && refreshedUser && !isTokenExpired(token)) {
          setAuthInfo(token, refreshedUser);
          console.log('AuthProvider: Initial refresh successful.');
        } else {
          setAuthInfo(null, null); // Clear if token is invalid/expired
          console.log('AuthProvider: Initial refresh returned invalid/expired token or no user.');
        }
      } catch (error) {
        console.log('AuthProvider: Initial refresh failed, user is not logged in.', error);
        setAuthInfo(null, null); // Ensure state is cleared on failure
      } finally {
        setIsLoading(false);
      }
    };
    attemptRefresh();
  }, [setAuthInfo]); // setAuthInfo is memoized

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { token, user: loggedInUser } = response.data;
      if (token && loggedInUser && !isTokenExpired(token)) {
        setAuthInfo(token, loggedInUser);
      } else {
        throw new Error("Login response invalid or token expired.");
      }
    } catch (error) {
      console.error('Login failed:', error);
      setAuthInfo(null, null);
      throw error; // Re-throw to handle in UI
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (details: RegisterRequest) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', details);
      console.log("registered");
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    console.log('Logging out...');
    const currentToken = accessToken; 
    setAuthInfo(null, null);
    
    try {
      // Call backend logout to invalidate the refresh token (HttpOnly cookie)
      await api.post('/auth/logout', {}, {
        headers: currentToken ? { 'Authorization': `Bearer ${currentToken}` } : {}
      });
      console.log('Backend logout successful.');
    } catch (error) {
      console.error("Backend logout call failed. Refresh token might still be valid on server.", error);
    }
  }, [setAuthInfo, accessToken]);

  const getAccessTokenForInterceptor = useCallback(() => {
    return accessToken;
  }, [accessToken]);

  const authContextValue: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !!user && !!accessToken && !isTokenExpired(accessToken),
    login,
    register,
    logout,
    getAccessToken: getAccessTokenForInterceptor,
    setAuthInfo,
  };

  useEffect(() => {
    setAuthContextForInterceptors({
      getAccessToken: authContextValue.getAccessToken,
      setAuthInfo: authContextValue.setAuthInfo,
      logout: authContextValue.logout,
    });
  }, [authContextValue.getAccessToken, authContextValue.setAuthInfo, authContextValue.logout]);
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return context;
};