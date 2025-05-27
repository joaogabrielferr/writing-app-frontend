'use client';

import { useState, FormEvent } from 'react';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Spinner } from '../_components/spinner/spinner';
import SplashScreenOverlay from '../_components/splash-screen/splash-screen';


export default function LoginPage() {

  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [error, setError] = useState<string | null>(null);
  const { login, isLoading: authLoading,isAuthenticated } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ login:form.username, password:form.password });
      router.push('/');
    } catch (err) {
      if(axios.isAxiosError(err) && err.response?.data?.message && err.response?.data?.errorCode === 'INVALID_CREDENTIALS'){
        setError("Invalid username or password");
      }else{
        setError('Login failed. Please try again later.');
      }
      console.error(err);
    }finally{
      setSubmitting(false);
    }
  };

  if(isAuthenticated && router){
    router.replace("/");
  }

  if (isAuthenticated) { // Show splash screen is already authenticated (before redirect)
    return <SplashScreenOverlay />;
  }

  return (
      <div className={styles.container}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <div className={styles.logo}>
            {registered ? 'Sign in to ' : 'Welcome back to '} 
            <span className = {styles.firstLetter}>E</span>scritr</div>
          <div className={styles.inputGroup}>
            <div>
                  {registered && <p className={styles.registered}>Registration complete! You can now log in.</p>}
                  {/* login form */}
              </div>
              <input
                type="email"
                name="username"
                placeholder="e-mail"
                className={styles.input}
                value={form.username}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={styles.input}
                value={form.password}
                onChange={handleChange}
                required
              />
              {error && <span id="name-error" className={styles.error}>{error}</span>}

            </div>
          <button
            type="submit"
            className={styles.button}
            disabled={submitting}
          >
            {submitting ? <Spinner size={24}/> : 'Login'}
          </button>
          <div className={styles.footer}>
            Don&apos;t have an account? <Link className = {styles.link} href="/register">Sign up</Link>
          </div>
        </form>
      </div>
    );
}