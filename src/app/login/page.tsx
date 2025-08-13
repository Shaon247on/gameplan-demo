"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm, SocialLogin } from "@/components/auth";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [storage, setStorage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      switch (error) {
        case "google_auth_failed":
          setErrorMessage("Google authentication failed. Please try again.");
          break;
        case "no_auth_code":
          setErrorMessage("No authorization code received from Google.");
          break;
        case "google_callback_failed":
          setErrorMessage(
            "Failed to complete Google sign in. Please try again."
          );
          break;
        default:
          setErrorMessage("An error occurred during authentication.");
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 md:px-4">
      <Card className="w-full max-w-lg md:px-3">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center md:mt-6 lg:mt-14 md:mb-4 lg:mb-10">
            <Image
              src={"/logo.png"}
              alt="logo-image"
              width={225}
              height={63}
              className="md:max-w-[225px] md:max-h-[63px] object-center"
              layout="responsive"
            />
          </div>
          <CardTitle className="text-2xl md:text-4xl font-medium text-[#232323]">
            LOGIN to Account
          </CardTitle>
          <p className="text-sm text-[#232323] mt-2">
            Please enter your email and password to continue
          </p>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}
          <Suspense>
            <LoginForm />
          </Suspense>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-[#232323]">
              Don&apos;t Have An Account?{" "}
              <Link
                href="/signup"
                className="text-purple-600 hover:underline font-medium"
              >
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
