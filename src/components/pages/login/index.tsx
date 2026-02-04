"use client"

import type React from "react";
import { useState, forwardRef,useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Eye, EyeOff } from "lucide-react";
import type { RootState } from "@/redux/store";
import { loginStart, loginSuccess, loginFailure } from "@/redux/slices/authSlice";

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return <input ref={ref} {...props} />
})

interface LoginFormData {
  email: string
  password: string
}

declare global {
  interface Window {
    google: any;
  }
}

const API_BASE = import.meta.env.VITE_API_BASE_URL; 

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Clear any previous errors
      dispatch(loginStart())

      const response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      // console.log("🧞‍♂️result --->", result);

      if (!response.ok) {
        // Handle different types of errors
        switch (response.status) {
          case 400:
            dispatch(loginFailure(result.message || "Invalid input"))
            break
          case 401:
            dispatch(loginFailure("Invalid email or password"))
            break
          case 500:
            dispatch(loginFailure("Server error. Please try again later."))
            break
          default:
            dispatch(loginFailure(result.message || "Login failed"))
        }
        return // Don't throw error, just return
      }

      // Update Redux state on success
      dispatch(
        loginSuccess({
          _id: result._id,
          email: data.email,
          name: result.name,
          token: result.token,
        }),
      )

      navigate("/")
    } catch (error) {
      // Handle network or parsing errors
      const message =
        error instanceof Error ? "Connection error. Please check your internet connection." : "Login failed"
      dispatch(loginFailure(message))
    }
  }

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('[v0] Google Sign-In script loaded');
      setGoogleReady(true);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      console.log('[v0] Google login button clicked');
      
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-button-container'),
          { theme: 'outline', size: 'large', width: '100%' }
        );

        // Trigger the One Tap UI
        window.google.accounts.id.prompt((notification:any) => {
          console.log('[v0] Google prompt notification:', notification);
        });
      } else {
        console.warn('[v0] Google library not loaded yet');
        alert('Google Sign-In is loading. Please try again.');
      }
    } catch (error) {
      console.error('[v0] Google login error:', error);
      alert('Google login error. Using fallback...');
    }
    setLoading(false);
  };

  const handleCredentialResponse = (response: any) => {
    console.log('[v0] Google credential response received');
    const decodedToken = JSON.parse(atob(response.credential.split('.')[1]));
    console.log('[v0] Decoded token:', decodedToken);
    alert(`Google login successful! Welcome ${decodedToken.name}`);
  };
  return (
    <div className="flex justify-center items-center min-h-screen  bg-background">
      <Card className="w-[350px] border border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                className="flex h-8 w-full rounded-md border border-gray-500 bg-background px-3 py-2 
                text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm 
                file:font-medium placeholder:text-muted-foreground focus-visible:outline-none 
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                disabled:opacity-50"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  className="flex h-8 w-full rounded-md border border-gray-500 bg-background px-3
                   py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm 
                   file:font-medium placeholder:text-muted-foreground focus-visible:outline-none 
                   focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                   disabled:cursor-not-allowed disabled:opacity-50"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>


            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>

            <div id="google-button-container" className="w-full mb-4"></div>
          
          <Button
            onClick={handleGoogleLogin}
            disabled={loading || !googleReady}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition duration-200"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-gray-700 font-medium">
              {loading ? 'Signing in...' : googleReady ? 'Sign in with Google' : 'Loading...'}
            </span>
          </Button>

            <div className="text-center text-sm">
              <Link to="/register" className="text-primary hover:underline">
                Don't have an account? Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Rolling News Ticker */}
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-gray-900 py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap inline-block">
          <span className="text-sm font-medium mx-8">
            ⚠️ Forgot Password and Login using Google icon is under construction
          </span>
          <span className="text-sm font-medium mx-8">
            ⚠️ Forgot Password and Login using Google icon is under construction
          </span>
          <span className="text-sm font-medium mx-8">
            ⚠️ Forgot Password and Login using Google icon is under construction
          </span>
          <span className="text-sm font-medium mx-8">
            ⚠️ Forgot Password and Login using Google icon is under construction
          </span>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}
      </style>
    </div>
  )
}
