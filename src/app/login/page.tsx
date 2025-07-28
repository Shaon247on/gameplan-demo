"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm, SocialLogin } from "@/components/auth";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 md:px-4">
      <Card className="w-full max-w-lg md:px-3">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center md:mt-6 lg:mt-14 md:mb-4 lg:mb-10">
            <Image src={"/logo.png"} alt="logo-image" width={225} height={63} className="md:max-w-[225px] md:max-h-[63px] object-center" layout="responsive"/>
          </div>
          <CardTitle className="text-2xl md:text-4xl font-medium text-[#232323]">
            LOGIN to Account
          </CardTitle>
          <p className="text-sm text-[#232323] mt-2">
            Please enter your email and password to continue
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-[#232323]">
              Don&apos;t Have An Account?{" "}
              <Link href="/signup" className="text-purple-600 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>

          <SocialLogin title="Or Login With" />
        </CardContent>
      </Card>
    </div>
  );
} 