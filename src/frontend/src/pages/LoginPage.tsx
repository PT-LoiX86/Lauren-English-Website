import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin, type CodeResponse } from "@react-oauth/google";
import { Button } from "@/components/ui/button"; // Added Shadcn Button
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { apiClient } from "../api/Client";
import { useAuthStore, type UserProfile } from "../stores/AuthStore";

import pageBackground from "../assets/backgrounds/background.png";
import poster from "../assets/posters/poster2.png";

// The clean Google "G" logo SVG for our custom button
const GoogleIcon = () => (
  <svg
    className="w-5 h-5 mr-3"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. THE ENTERPRISE FLOW: We use the hook with flow: 'auth_code'
  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse: CodeResponse) => {
      setIsLoading(true);
      setError(null);
      try {
        // 2. We send the Authorization Code to Spring Boot, NOT the ID Token
        const response = await apiClient.post("/auth/google", {
          authCode: codeResponse.code,
        });

        const data = response.data;

        const userProfile: UserProfile = {
          userId: data.userId,
          email: data.email,
          name: data.name,
          avatarUrl: data.avatarUrl,
          role: data.role,
        };

        login(data.accessToken, data.refreshToken, userProfile);
        navigate("/dashboard");
      } catch (err: any) {
        console.error("Login failed:", err);
        setError(
          err.response?.data?.message ||
            "Authentication failed. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError("Google Authentication was canceled."),
  });

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${pageBackground})` }}
    >
      <div className="absolute inset-0 bg-black/10 z-0"></div>

      {/* The card container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white min-h-[600px]">
        {/* Left column */}
        <div className="hidden md:flex flex-col justify-center w-7/12 bg-gradient-to-br from-[#f4f3f4] to-[#7fa6c9] text-white p-10 relative overflow-hidden">
          {/* Left column poster */}
          <div className="relative w-full max-w-xl rounded-xl overflow-hidden shadow-2xl border border-[#aebfcf]">
            <img
              src={poster}
              alt="Platform preview"
              className="w-full h-auto object-cover"
              draggable="false"
            />
          </div>
        </div>

        {/* Right column */}
        <div className="w-full md:w-5/12 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 bg-gradient-to-br from-[#f4f3f4] to-[#7fa6c9]">
          <div className="w-full max-w-sm space-y-8">
            {/* Header Text */}
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-[#2d58a1]">
                Sign in
              </h1>
              <p className="text-sm text-[#3a65a7]">
                Welcome back! Authenticate with your Google account to continue
                learning!
              </p>
            </div>

            {/* Error State */}
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-50/90 border-red-200 text-red-800 backdrop-blur-sm"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Authentication Button Area */}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex justify-center w-full">
                {/* 3. THE CUSTOM SHADCN BUTTON */}
                <Button
                  onClick={() => loginWithGoogle()}
                  variant="outline"
                  disabled={isLoading}
                  className="w-full max-w-[320px] bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm rounded-lg h-12 text-base font-medium transition-all"
                >
                  {isLoading ? (
                    <span className="animate-pulse text-[#2d58a1]">
                      Connecting to server...
                    </span>
                  ) : (
                    <>
                      <GoogleIcon />
                      Continue with Google
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
