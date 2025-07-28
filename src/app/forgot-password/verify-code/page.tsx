"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerifyForgotPasswordCodeMutation } from "@/store/features/ApiSlice";

export default function VerifyCodePage() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [verifyCode, { isLoading }] = useVerifyForgotPasswordCodeMutation();
  const router = useRouter();

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('forgotPasswordEmail');
    if (!storedEmail) {
      router.push('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      alert('Please enter the complete 6-digit code');
      return;
    }

    try {
      console.log("Verifying code:", fullCode);
      
      const result = await verifyCode({ 
        email, 
        code: fullCode 
      }).unwrap();
      
      console.log("Code verification successful:", result);
      
      // Store code in sessionStorage for next step
      sessionStorage.setItem('verificationCode', fullCode);
      
      // Redirect to reset password page
      router.push("/forgot-password/reset-password");
    } catch (error) {
      console.error("Code verification error:", error);
      alert("Invalid verification code. Please try again.");
    }
  };

  const handleResend = async () => {
    try {
      // Re-request the code
      const response = await fetch('https://127702b1a191.ngrok-free.app/api/auth/forgot-password/request-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert('Verification code has been resent to your email');
      } else {
        alert('Failed to resend code. Please try again.');
      }
    } catch (error) {
      console.error("Resend error:", error);
      alert('Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <Image src={"/logo.png"} alt="logo image" width={225} height={63} className="md:max-w-[225px] md:max-h-[63px]"/>
      </div>

      {/* Content */}
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h1>
          <p className="text-gray-600">Please enter your 6 digit code</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Verification Code</h2>
          
          {/* Code Input Fields */}
          <div className="flex justify-center space-x-2 mb-6">
            {code.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 focus:border-blue-500"
                maxLength={1}
                inputMode="numeric"
              />
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            variant={"primary"}
            className="w-full rounded-full h-[54px]"
            disabled={isLoading || code.join('').length !== 6}
          >
            {isLoading ? "VERIFYING..." : "VERIFY"}
          </Button>
        </div>

        {/* Resend Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            You have not received the email?{" "}
            <button
              onClick={handleResend}
              className="text-purple-600 hover:text-purple-800 underline"
            >
              Resend
            </button>
          </p>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 