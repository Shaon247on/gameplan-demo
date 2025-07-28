"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm, SocialLogin } from "@/components/auth";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 md:px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-4xl font-medium text-[#232323]">
            SIGN UP to Account
          </CardTitle>
          <p className="text-sm text-[#232323] mt-2">
            Please enter your email and password to continue
          </p>
        </CardHeader>
        <CardContent>
          <SignUpForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-[#232323]">
              Already Have An Account?{" "}
              <Link href="/login" className="text-purple-600 hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>

          <SocialLogin title="Or Login With" />
        </CardContent>
      </Card>
    </div>
  );
} 