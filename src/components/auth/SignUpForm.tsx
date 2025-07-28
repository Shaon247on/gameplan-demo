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
      </form>
    </Form>
  );
}
