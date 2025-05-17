'use client';

import { useState, FormEvent } from 'react';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SplashScreenOverlay from '../_components/splash-screen/splash-screen';

export default function RegisterPage() {
  const [username, setUsername] = useState(''); // Example field
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading: authLoading,isAuthenticated } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register({ username, email, password });
      alert('Registration successful! Please login.');
      router.push('/login');
    } catch (err: unknown) {
      setError('Registration failed.');
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={authLoading}>
          {authLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link href="/login">Login here</Link>
      </p>
    </div>
  );
}