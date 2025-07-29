"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation, useInitiateGoogleAuthMutation } from "@/store/features/ApiSlice";

// Cookie utility function
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const [initiateGoogleAuth, { isLoading: isGoogleLoading }] = useInitiateGoogleAuthMutation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Login data:", data);
      
      const result = await login(data).unwrap();
      
      console.log("Login successful:", result);
      
      // Store tokens in cookies
      setCookie('access_token', result.access_token, 7); // 7 days expiry
      setCookie('refresh_token', result.refresh_token, 7);
      setCookie('token_type', result.token_type, 7);
      
      // Store login data in sessionStorage for immediate access
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userEmail', data.email);
      
      // After successful login, redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code'); // Get the code from the query params
  
    if (code) {
      console.log('Received Google OAuth code:', code);
      // You can send the code to your backend or handle it here
      handleGoogleCallback(code);
    }
  }, []);

  
const handleGoogleCallback = async (code) => {
  try {
    // Send the code to your backend to exchange for tokens
    const response = await fetch('https://93dddca0bf3f.ngrok-free.app/api/oauth/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    console.log('OAuth response data:', data);
    // Handle the data (store tokens, etc.)
  } catch (error) {
    console.error('Google OAuth callback error:', error);
  }
};

  const handleGoogleLogin = async () => {
    try {
      console.log("Initiating Google OAuth...");
      
      // First, let's test the API directly to see what it returns
      const testResponse = await fetch('https://93dddca0bf3f.ngrok-free.app/api/oauth/auth/google', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Direct API test response status:", testResponse.status);
      console.log("Direct API test response:", testResponse);
      const testData = await testResponse.text();
      // console.log("Direct API test response data:", testData.authUrl );
      
      // Now try the RTK Query approach
      const result = await initiateGoogleAuth().unwrap();
      console.log("Google auth result:", result);
      
      let authUrl = result.authUrl;
      
      // Fallback: if RTK Query fails, use the direct API response
      if (!authUrl && testData) {
        try {
          // Try to parse as JSON first
          const parsedData = JSON.parse(testData);
          authUrl = parsedData.authUrl || parsedData.url || parsedData;
        } catch {
          // If not JSON, use as string
          authUrl = testData;
        }
      }
      
      if (!authUrl) {
        console.error("No auth URL received from API");
        alert("Google login failed: No authorization URL received.");
        return;
      }
      
      console.log("Redirecting to Google OAuth URL:", authUrl);
      // Redirect to Google OAuth URL
      window.location.href = authUrl;
    } catch (error) {
      console.error("Google login error:", error);
      
      // More detailed error handling
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = (error as { data?: { message?: string } }).data;
        alert(`Google login failed: ${errorData?.message || 'Unknown error'}`);
      } else if (error && typeof error === 'object' && 'error' in error) {
        const errorMessage = (error as { error?: string }).error;
        if (errorMessage?.includes('ngrok warning page')) {
          alert("Please accept the ngrok security warning first, then try again.");
        } else {
          alert(`Google login failed: ${errorMessage || 'Unknown error'}`);
        }
      } else {
        alert("Google login failed. Please try again.");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="py-3 h-[50px]"
                  placeholder="Asadujoman@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    className="pr-10 py-3 h-[50px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-red-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant={"primary"}
          className="w-full rounded-full h-[54px]"
          disabled={form.formState.isSubmitting || isLoading}
        >
          {form.formState.isSubmitting || isLoading ? "LOGGING IN..." : "LOGIN"}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full rounded-full h-[54px] bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2"
        >
          {isGoogleLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span>{isGoogleLoading ? "Connecting..." : "Continue with Google"}</span>
        </Button>
      </form>
    </Form>
  );
}
