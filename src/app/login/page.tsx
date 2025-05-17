'use client';

import { useState, FormEvent } from 'react';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SplashScreenOverlay from '../_components/splash-screen/splash-screen';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading: authLoading,isAuthenticated } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ login:username, password });
      router.push('/');
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
  };

  if(isAuthenticated && router){
    router.replace("/");
  }

  if(authLoading || isAuthenticated){
    return <SplashScreenOverlay/>
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={authLoading}>
          {authLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        No account? <Link href="/register">Register here</Link>
      </p>
    </div>
  );
}