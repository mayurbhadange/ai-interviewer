"use client";

import { redirect } from "next/navigation";
import { useUser } from "@/context/user.context";
import { AuthForm } from "@/components/auth/auth-form";
import Image from "next/image";
import { CheckCircle, ChevronRight } from "lucide-react";
import { Suspense } from "react";

export default function SignUpPage() {
  const { user } = useUser();
  if (user.id) {
    return redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="relative w-full md:w-1/2 bg-white text-blue-900">
        {/* Gradient spots */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-gradient-to-r from-blue-300/40 to-blue-500/40 blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[10%] w-72 h-72 rounded-full bg-gradient-to-r from-blue-400/30 to-blue-600/30 blur-3xl"></div>
          <div className="absolute top-[60%] left-[5%] w-48 h-48 rounded-full bg-gradient-to-r from-blue-200/40 to-blue-400/40 blur-3xl"></div>
        </div>

        <div className="relative flex flex-col h-full p-8 md:p-12 lg:p-16">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <Image
              src="/assets/brand.png"
              alt="InterviewPrep Logo"
              width={48}
              height={48}
              className="mr-3"
            />
            <h1 className="text-2xl font-bold">InterviewPrep</h1>
          </div>

          {/* Content */}
          <div className="my-auto">
            <h2 className="text-3xl md:text-4xl mb-6 text-blue-700">
              Ace Your Next Interview
            </h2>
            <p className="text-lg md:text-xl mb-8 text-blue-900">
              Practice with AI-powered mock interviews tailored to your career
              goals.
            </p>

            <div className="space-y-4 mb-12">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-3 mt-0.5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg text-blue-700">
                    Personalized Practice
                  </h3>
                  <p className="text-blue-900">
                    Custom interviews based on your skills and target roles
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-3 mt-0.5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg text-blue-700">
                    Detailed Feedback
                  </h3>
                  <p className="text-blue-900">
                    Get actionable insights to improve your interview
                    performance
                  </p>
                </div>
              </div>
              {/* <div className="flex items-start">
                <CheckCircle className="h-6 w-6 mr-3 mt-0.5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg text-blue-900">
                    Video Recording
                  </h3>
                  <p className="text-blue-800">
                    Review your responses and track your progress over time
                  </p>
                </div>
              </div> */}
            </div>

            <div className="hidden md:block">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-sm text-blue-800">
                <span className="mr-2">
                  Join thousands of successful candidates
                </span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto text-sm text-blue-700">
            <p>© 2025 InterviewPrep. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to InterviewPrep
            </h2>
            <p className="text-gray-500 mt-2">
              Sign in to continue your interview practice
            </p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <AuthForm mode="signup" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
