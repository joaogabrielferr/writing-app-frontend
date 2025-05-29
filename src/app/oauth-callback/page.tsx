'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api'; // Your configured Axios instance
import { User } from '@/models/user'; // Your User model
import { useUser } from '@/context/auth-context';
import { FullscreenLoader } from '../_components/fullscreen-loading/fullscreen-loading';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthInfo, logout } = useUser(); 

  useEffect(() => {
    const accessToken = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth Error from backend:', decodeURIComponent(error));
      // Redirect to login page with error, ensuring logout state if any partial auth occurred
      logout().finally(() => { // Ensure logout completes before redirect
        router.push(`/login?error=${encodeURIComponent(decodeURIComponent(error))}`);
      });
      return;
    }

    if (accessToken) {
      console.log('OAuth Callback: Received access token:', accessToken);

      const fetchUserWithToken = async (token: string) => {
        try {
          // Assume you have an endpoint like /api/users/me or /auth/me
          // that returns the User object based on the provided JWT.
          const response = await api.get<{ user: User }>('/auth/me', { // Adjust endpoint as needed
            headers: {
              'Authorization': `Bearer ${token}` // Use the new token directly
            }
          });
          
          const userData = response.data.user; // Adjust based on your API response structure for /auth/me
          console.log('OAuth Callback: Fetched user data:', userData);

          if (userData) {
            setAuthInfo(token, userData); // Update global auth state
            router.push('/'); // Redirect to fedd
          } else {
            throw new Error("User data not found after OAuth login.");
          }
        } catch (fetchError) {
          console.error('OAuth Callback: Failed to fetch user data with new token:', fetchError);
          logout().finally(() => {
            router.push(`/login?error=${encodeURIComponent('Failed to retrieve user details after login.')}`);
          });
        }
      };

      fetchUserWithToken(accessToken);

    } else if (!accessToken && !error && searchParams.toString()) {
        // This case handles when the page is loaded with some params but not the expected ones.
        console.warn('OAuth callback called without access token or error, but with params:', searchParams.toString());
        logout().finally(() => {
            router.push(`/login?error=${encodeURIComponent('OAuth callback issue: Missing token.')}`);
        });
    } else if (!searchParams.toString()) {
        // Navigated directly to this page without any query params
        console.warn('OAuth callback page accessed directly without parameters.');
        router.push('/login');
    }
  }, [searchParams, router, setAuthInfo, logout]);

  return (
    <div>
      <FullscreenLoader />
      
    </div>
  );
}


// Wrap with Suspense because useSearchParams should be used in a client component
// that is a child of <Suspense>
export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading callback...</div>}>
            <OAuthCallbackContent />
        </Suspense>
    );
}