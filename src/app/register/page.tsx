 
'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import SplashScreenOverlay from '../_components/splash-screen/splash-screen';
import styles from "./register.module.css";
import api from '@/lib/api';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Spinner } from '../_components/spinner/spinner';

// --- Constants ---
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 50;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 30;

const ERROR_MESSAGES = {
  EMAIL_INVALID: 'Invalid email format.',
  EMAIL_IN_USE: 'This e-mail is already linked to an existing account.',
  EMAIL_REQUIRED: 'Email is required.',
  NAME_REQUIRED: 'Name is required.',
  USERNAME_REQUIRED: 'Username is required.',
  USERNAME_LENGTH: `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`,
  USERNAME_PATTERN: 'Only letters, numbers, and underscores are allowed.',
  USERNAME_IN_USE: 'Username already taken.',
  PASSWORD_LENGTH: `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`,
  PASSWORD_REQUIRED: 'Password is required.',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required.',
  PASSWORDS_NO_MATCH: "Passwords don't match.",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please, try again later.",
};

const validateEmailFormat = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateUsernameChars = (username: string): boolean => /^[a-zA-Z0-9_]+$/.test(username);

type FormStep = 'email' | 'details';

interface FormData {
  email: string;
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string; // For overall form errors
}

interface LoadingStates {
  emailCheck: boolean;
  usernameCheck: boolean;
  submitting: boolean;
}


const initialFormData: FormData = {
  email: '',
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
};

const initialErrors: FormErrors = {};

const initialLoadingStates: LoadingStates = {
  emailCheck: false,
  usernameCheck: false,
  submitting: false,
};

async function checkEmailAvailabilityApi(email: string): Promise<{ available: boolean; message?: string }> {
  try {
    const response = await api.get<{ available: boolean }>(`/auth/check-email/${email}`);
    return { available: response.data.available };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      return { available: false, message: error.response.data.message };
    }
    return { available: false, message: ERROR_MESSAGES.UNEXPECTED_ERROR };
  }
}

async function checkUsernameAvailabilityApi(username: string): Promise<{ available: boolean; message?: string }> {
  try {
    const response = await api.get<{ available: boolean }>(`/auth/check-username/${username}`);
    return { available: response.data.available };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      return { available: false, message: error.response.data.message };
    }
    return { available: false, message: ERROR_MESSAGES.USERNAME_IN_USE }; // Default to this if API doesn't provide specific message
  }
}

export default function RegisterPage() {
  const { register, isLoading: isAuthLoading, isAuthenticated } = useUser();
  const router = useRouter();

  const [step, setStep] = useState<FormStep>('email');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(initialLoadingStates);

  // Effect for redirecting authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name as keyof FormErrors]: undefined }));
    }
    
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const validateEmailStep = async (): Promise<boolean> => {
    let isValid = true;
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
      isValid = false;
    } else if (!validateEmailFormat(formData.email)) {
      newErrors.email = ERROR_MESSAGES.EMAIL_INVALID;
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return false;
    }

    setLoadingStates(prev => ({ ...prev, emailCheck: true }));
    const emailCheckResult = await checkEmailAvailabilityApi(formData.email);
    setLoadingStates(prev => ({ ...prev, emailCheck: false }));

    if (!emailCheckResult.available) {
      newErrors.email = emailCheckResult.message || ERROR_MESSAGES.EMAIL_IN_USE;
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleAdvanceToDetails = async () => {
    if (await validateEmailStep()) {
      setStep('details');
    }
  };

  const validateDetailsStep = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = ERROR_MESSAGES.NAME_REQUIRED;
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = ERROR_MESSAGES.USERNAME_REQUIRED;
      isValid = false;
    } else if (formData.username.length < MIN_USERNAME_LENGTH || formData.username.length > MAX_USERNAME_LENGTH) {
      newErrors.username = ERROR_MESSAGES.USERNAME_LENGTH;
      isValid = false;
    } else if (!validateUsernameChars(formData.username)) {
      newErrors.username = ERROR_MESSAGES.USERNAME_PATTERN;
      isValid = false;
    }

    if (!formData.password) {
        newErrors.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
        isValid = false;
    } else if (formData.password.length < MIN_PASSWORD_LENGTH || formData.password.length > MAX_PASSWORD_LENGTH) {
      newErrors.password = ERROR_MESSAGES.PASSWORD_LENGTH;
      isValid = false;
    }
    
    if(!formData.confirmPassword) {
        newErrors.confirmPassword = ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
        isValid = false;
    } else if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.PASSWORDS_NO_MATCH;
      isValid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors })); // Merge with existing errors
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!validateDetailsStep()) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, usernameCheck: true }));
    const usernameCheckResult = await checkUsernameAvailabilityApi(formData.username);
    setLoadingStates(prev => ({ ...prev, usernameCheck: false }));

    if (!usernameCheckResult.available) {
      setErrors(prev => ({ ...prev, username: usernameCheckResult.message || ERROR_MESSAGES.USERNAME_IN_USE }));
      return;
    }

    setLoadingStates(prev => ({ ...prev, submitting: true }));
    setErrors(prev => ({ ...prev, general: undefined }));

    try {
      await register({ 
        email: formData.email, 
        username: formData.username, 
        password: formData.password,
        name: formData.name
      });
      router.push('/login?registered=true');
    } catch (err) {
      let errorMessage = ERROR_MESSAGES.UNEXPECTED_ERROR;
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setErrors(prev => ({ ...prev, general: errorMessage }));
    } finally {
      setLoadingStates(prev => ({ ...prev, submitting: false }));
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setFormData(prev => ({ ...prev, name: '', username: '', password: '', confirmPassword: ''}));
    setErrors(prev => ({ email: prev.email }));
  };

  const handleGoogleLogin = (e:FormEvent) => {
      if(e){
        e.preventDefault();
      }
    const backendOAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_WITHOUT_API_PREFIX}/oauth2/authorization/google`;
    window.location.href = backendOAuthUrl;
  };

  if (isAuthenticated) { // Show splash screen is already authenticated (before redirect)
    return <SplashScreenOverlay />;
  }

  return (
    <div className={styles.container}>
        <Link href={"/"}>
          <div className = {styles.logo}>
                <span className={styles.firstLetter}>E</span>SCRITR
          </div>
      </Link>
      <form className={styles.card} onSubmit={handleSubmit} noValidate>
        <div className={styles.logo}>Join <span className={styles.firstLetter}>E</span>scritr</div>

        {errors.general && <div className={styles.registerError}>{errors.general}</div>}
        
        {step === 'email' && (
          <>
            <div className={styles.inputGroup}>
              Enter your email to start
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                disabled={loadingStates.emailCheck}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              {errors.email && <span id="email-error" className={styles.error}>{errors.email}</span>}
            </div>

            <button 
              type="button" 
              onClick={handleAdvanceToDetails} 
              className={styles.button} 
              disabled={loadingStates.emailCheck}
            >
              {loadingStates.emailCheck ? <Spinner size={24}/> : 'Advance'}
            </button>
            <div className={styles.footer}>
              Already have an account? <Link className={styles.link} href="/login">Sign in</Link>
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
                  Sign up with Google
                </span>
              </div>
            </button>
          </div>
          </>

            

        )}


        {step === 'details' && (
          <>
            <div>
              <button type="button" className={`${styles.button} ${styles.backButton}`} onClick={handleBackToEmail}>
                <ArrowLeft size={14} /> Go back to Email
              </button>
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="name" 
                placeholder="Name"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                value={formData.name}
                onChange={handleInputChange}
                disabled={loadingStates.submitting}
                aria-invalid={!!errors.name}
                aria-describedby="name-error"
              />
              <small className={styles.small}>This name will be shown on articles and comments.</small>
              {errors.name && <span id="name-error" className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="username" 
                placeholder="Username"
                className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                value={formData.username}
                onChange={handleInputChange}
                disabled={loadingStates.usernameCheck || loadingStates.submitting}
                aria-invalid={!!errors.username}
                aria-describedby="username-error"
              />
              <small className={styles.small}>This must be unique.</small>
              <small className={styles.small}>Allowed characters: a-z, A-Z, 0-9, _</small>
              {errors.username && <span id="username-error" className={styles.error}>{errors.username}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                value={formData.password}
                onChange={handleInputChange}
                disabled={loadingStates.submitting}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <small className={styles.small}>Choose a strong password ({MIN_PASSWORD_LENGTH}-{MAX_PASSWORD_LENGTH} characters).</small>
              {errors.password && <span id="password-error" className={styles.error}>{errors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loadingStates.submitting}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby="confirm-password-error"
              />
              <small className={styles.small}>Confirm your password.</small>
              {errors.confirmPassword && <span id="confirm-password-error" className={styles.error}>{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit" 
              className={styles.button} 
              disabled={loadingStates.usernameCheck || loadingStates.submitting}
            >
              {loadingStates.usernameCheck ? 'Checking Username...' : loadingStates.submitting ? <Spinner size={24}/> : 'Sign Up'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}