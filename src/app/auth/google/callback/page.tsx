"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useHandleGoogleCallbackMutation } from '@/store/features/ApiSlice';

// Cookie utility function
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

export default function GoogleCallbackPage() {
  const [handleGoogleCallback, { isLoading, error }] = useHandleGoogleCallbackMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        // Get the authorization code from URL parameters
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          console.error('Google OAuth error:', error);
          setStatus('error');
          setTimeout(() => {
            router.push('/login?error=google_auth_failed');
          }, 2000);
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          setStatus('error');
          setTimeout(() => {
            router.push('/login?error=no_auth_code');
          }, 2000);
          return;
        }

        // Exchange the authorization code for tokens
        const result = await handleGoogleCallback({ code }).unwrap();
        
        console.log('Google login successful:', result);
        
        // Store tokens in cookies
        setCookie('access_token', result.access_token, 7);
        setCookie('refresh_token', result.refresh_token, 7);
        setCookie('token_type', result.token_type, 7);
        
        // Store login data in sessionStorage
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('loginMethod', 'google');
        
        setStatus('success');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
        
      } catch (error) {
        console.error('Google callback error:', error);
        setStatus('error');
        setTimeout(() => {
          router.push('/login?error=google_callback_failed');
        }, 2000);
      }
    };

    handleGoogleAuth();
  }, [searchParams, handleGoogleCallback, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Completing Google Sign In...
              </h2>
              <p className="text-gray-600">
                Please wait while we complete your authentication.
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Sign In Successful!
              </h2>
              <p className="text-gray-600">
                Redirecting you to the dashboard...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Sign In Failed
              </h2>
              <p className="text-gray-600">
                Redirecting you back to login...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 