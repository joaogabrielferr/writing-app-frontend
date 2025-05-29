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
  const errorOAuth2 = searchParams.get('error');

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

    if(!form.username){
      setError("Email is required!");
      return;
    }

    if(!form.password){
      setError("Password is required!");
      return;
    }

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

    const handleGoogleLogin = (e:FormEvent) => {
      if(e){
        e.preventDefault();
      }
    const backendOAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_WITHOUT_API_PREFIX}/oauth2/authorization/google`;
    window.location.href = backendOAuthUrl;
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
            <div>
              {errorOAuth2 && <p className={styles.errorOauth}>Login with provider failed. Please try again or choose another method</p>}
            </div>
              <input
                type="email"
                name="username"
                placeholder="e-mail"
                className={styles.input}
                value={form.username}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={styles.input}
                value={form.password}
                onChange={handleChange}
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
          <div className = {styles.logWith}>
             or
             <button className={styles.gsiMaterialButton} onClick={handleGoogleLogin}>
              {/* <div className={styles.gsiMaterialButtonState}></div> */}
              <div className={styles.gsiMaterialButtonContentWrapper}>
                <div className={styles.gsiMaterialButtonIcon}>
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    style={{ display: 'block' }}
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </div>
                <span className={styles.gsiMaterialButtonContents}>
                  Sign in with Google
                </span>
                <span style={{ display: 'none' }}>Sign in with Google</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    );
}