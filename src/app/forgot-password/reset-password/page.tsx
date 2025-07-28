"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

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
import { useResetPasswordMutation } from "@/store/features/ApiSlice";
import { z } from "zod";

// Password validation schema
const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();

  useEffect(() => {
    // Get email and code from sessionStorage
    const storedEmail = sessionStorage.getItem('forgotPasswordEmail');
    const storedCode = sessionStorage.getItem('verificationCode');
    
    if (!storedEmail || !storedCode) {
      router.push('/forgot-password');
      return;
    }
    
    setEmail(storedEmail);
    setVerificationCode(storedCode);
  }, [router]);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      console.log("Resetting password for:", email);
      
      const result = await resetPassword({
        email,
        new_password: data.newPassword,
        code: verificationCode,
      }).unwrap();
      
      console.log("Password reset successful:", result);
      
      // Clear sessionStorage
      sessionStorage.removeItem('forgotPasswordEmail');
      sessionStorage.removeItem('verificationCode');
      
      // Redirect to success page
      router.push("/forgot-password/success");
    } catch (error) {
      console.error("Password reset error:", error);
      alert("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <Image src={"/logo.png"} alt="logo image" width={225} height={63} className="md:max-w-[225px] md:max-h-[63px]"/>
      </div>

      {/* Form */}
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Set New Password</h1>
          <p className="text-gray-600">Create a new password. Make it different from previous one.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
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
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...field}
                        className="pr-10 py-3 h-[50px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant={"primary"}
              className="w-full rounded-full h-[54px]"
              disabled={isLoading}
            >
              {isLoading ? "RESETTING..." : "CONFIRM PASSWORD"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
} 