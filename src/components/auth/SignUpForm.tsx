"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSignUpMutation } from "@/store/features/ApiSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUpSchema, type SignUpFormData } from "@/lib/schemas/auth";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUp, { isLoading, error }] = useSignUpMutation();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  console.log("hello error", form.formState.errors)

  const router = useRouter();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log("Sign up data:", data);
      
      // Transform form data to match API requirements
      const signUpData = {
        username: data.username,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
        agreed_to_terms: data.acceptTerms,
      };

      const result = await signUp(signUpData).unwrap();
      
      console.log("API Response:", result);
      
      // Check if the response indicates success (either by success field or message)
      if (result.success || result.message?.includes("successfully") || result.status === "success") {
        console.log("Signup successful:", result);
        // After successful signup, redirect to pricing page
        router.push("/pricing");
      } else {
        console.error("Signup failed:", result.message);
        alert(result.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      // If the error contains a success message, treat it as success
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = (error as { data?: { message?: string } }).data;
        if (errorData?.message?.includes("successfully")) {
          console.log("Signup successful despite error wrapper:", errorData);
          router.push("/pricing");
          return;
        }
      }
      alert("Signup failed. Please try again.");
    }
  };

    //   const handleGoogleSignUp = async () => {
    //   try {
    //     console.log("Initiating Google OAuth for signup...");
        
    //     // Show loading popup
    //     const loadingPopup = window.open('', '_blank', 'width=400,height=300,scrollbars=yes,resizable=yes');
    //     if (loadingPopup) {
    //       loadingPopup.document.write(`
    //         <html>
    //           <head>
    //             <title>Google OAuth</title>
    //             <style>
    //               body { 
    //                 font-family: Arial, sans-serif; 
    //                 display: flex; 
    //                 flex-direction: column; 
    //                 align-items: center; 
    //                 justify-content: center; 
    //                 height: 100vh; 
    //                 margin: 0; 
    //                 background: #f5f5f5;
    //               }
    //               .spinner { 
    //                 border: 4px solid #f3f3f3; 
    //                 border-top: 4px solid #3498db; 
    //                 border-radius: 50%; 
    //                 width: 40px; 
    //                 height: 40px; 
    //                 animation: spin 1s linear infinite; 
    //                 margin-bottom: 20px;
    //               }
    //               @keyframes spin { 
    //                 0% { transform: rotate(0deg); } 
    //                 100% { transform: rotate(360deg); } 
    //               }
    //             </style>
    //           </head>
    //           <body>
    //             <div class="spinner"></div>
    //             <h3>Connecting to Google...</h3>
    //             <p>Please wait while we redirect you to Google's authorization page.</p>
    //           </body>
    //         </html>
    //       `);
    //     }

    //     // Call the Google OAuth API
    //     const result = await initiateGoogleAuth().unwrap();
    //     console.log("Google auth result:", result);

    //     if (!result.authUrl) {
    //       console.error("No auth URL received from API");
    //       if (loadingPopup) loadingPopup.close();
    //       alert("Google signup failed: No authorization URL received.");
    //       return;
    //     }

    //     console.log("Redirecting to Google OAuth URL:", result.authUrl);
        
    //     // Close the loading popup and redirect to Google OAuth URL
    //     if (loadingPopup) {
    //       loadingPopup.location.href = result.authUrl;
    //     } else {
    //       // Fallback: redirect in the same window
    //       window.location.href = result.authUrl;
    //     }
        
    //   } catch (error) {
    //     console.error("Google signup error:", error);

    //     // More detailed error handling
    //     if (error && typeof error === 'object' && 'data' in error) {
    //       const errorData = (error as { data?: { message?: string } }).data;
    //       alert(`Google signup failed: ${errorData?.message || 'Unknown error'}`);
    //     } else if (error && typeof error === 'object' && 'error' in error) {
    //       const errorMessage = (error as { error?: string }).error;
    //       if (errorMessage?.includes('HTML response')) {
    //         alert("Google OAuth is not available at the moment. Please try again later.");
    //       } else {
    //         alert(`Google signup failed: ${errorMessage || 'Unknown error'}`);
    //       }
    //     } else {
    //       alert("Google signup failed. Please try again.");
    //     }
    //   }
    // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input
                  className="py-3 h-[50px]"
                  placeholder="Enter your username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...field}
                    className="pr-10 py-3 h-[50px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div>
                <FormLabel className="text-xs leading-[140%] text-gray-600">
                  By creating an account, I accept the Terms & Conditions &
                  Privacy Policy.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant={"primary"}
          className="w-full rounded-full h-[54px]"
          disabled={form.formState.isSubmitting || isLoading}
        >
          {form.formState.isSubmitting || isLoading ? "SIGNING UP..." : "SIGN UP"}
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

        {/* Google Sign Up Button */}
        {/* <Button
          type="button"
          onClick={handleGoogleSignUp}
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
        </Button> */}
      </form>
    </Form>
  );
}
