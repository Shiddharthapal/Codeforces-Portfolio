import type React from "react";

import { useEffect, useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => {
    return <input ref={ref} {...props} />;
  }
);

interface SendOtpFormData {
  email: string;
}

interface VerifyOtpFormData {
  otp: string;
}

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [step, setStep] = useState<"send" | "verify" | "reset">("send");
  const [emailForReset, setEmailForReset] = useState<string>("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendOtpFormData>();
  const {
    register: registerVerify,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors },
  } = useForm<VerifyOtpFormData>();
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    getValues: getResetValues,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordFormData>();

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const onSendOtp = async (data: SendOtpFormData) => {
    setError(null);
    setMessage(null);
    setDevOtp(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.message || "Failed to request a reset OTP.");
        return;
      }

      setMessage(result.message || "If the email exists, we sent an OTP.");
      setEmailForReset(data.email);
      setStep("verify");
      setResendCooldown(120);

      if (result.otp) {
        setDevOtp(result.otp);
      }
    } catch (_err) {
      setError("Connection error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const onResendOtp = async () => {
    if (!emailForReset) {
      setError("Please enter your email first.");
      return;
    }

    setError(null);
    setMessage(null);
    setDevOtp(null);
    setResendLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailForReset }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.message || "Failed to resend OTP.");
        return;
      }

      setMessage(result.message || "If the email exists, we sent an OTP.");
      setResendCooldown(60);

      if (result.otp) {
        setDevOtp(result.otp);
      }
    } catch (_err) {
      setError("Connection error. Please check your internet connection.");
    } finally {
      setResendLoading(false);
    }
  };

  const onVerifyOtp = async (data: VerifyOtpFormData) => {
    if (!emailForReset) {
      setError("Please enter your email first.");
      return;
    }

    setError(null);
    setMessage(null);
    setVerifyLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailForReset,
          otp: data.otp,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.message || "Failed to verify OTP.");
        return;
      }

      setMessage(result.message || "OTP verified. Set your new password.");
      setStep("reset");
    } catch (_err) {
      setError("Connection error. Please check your internet connection.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const onResetPassword = async (data: ResetPasswordFormData) => {
    if (!emailForReset) {
      setError("Please enter your email first.");
      return;
    }

    setError(null);
    setMessage(null);

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setResetLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailForReset,
          password: data.password,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.message || "Failed to reset password.");
        return;
      }

      setMessage(result.message || "Password reset successful.");
      navigate("/login");
    } catch (_err) {
      setError("Connection error. Please check your internet connection.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-[350px] border border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {step === "send"
              ? "Forgot Password"
              : step === "verify"
              ? "Verify OTP"
              : "Set New Password"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === "send" && (
            <form onSubmit={handleSubmit(onSendOtp)} className="space-y-4">
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

              {error && <p className="text-sm text-red-500">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}
              {devOtp && (
                <div className="rounded-md border border-dashed border-input p-2 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Dev OTP</p>
                  <p className="text-primary">{devOtp}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </Button>

              <div className="text-center text-sm">
                <Link to="/login" className="text-primary hover:underline">
                  Back to login
                </Link>
              </div>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerifySubmit(onVerifyOtp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  className="flex h-8 w-full rounded-md border border-gray-500 bg-background px-3 py-2 
                  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm 
                  file:font-medium placeholder:text-muted-foreground focus-visible:outline-none 
                  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                  disabled:opacity-50"
                  type="text"
                  {...registerVerify("otp", {
                    required: "OTP is required",
                    minLength: { value: 6, message: "OTP must be 6 digits" },
                    maxLength: { value: 6, message: "OTP must be 6 digits" },
                    pattern: { value: /^\d{6}$/, message: "OTP must be 6 digits" },
                  })}
                />
                {verifyErrors.otp && <p className="text-sm text-red-500">{verifyErrors.otp.message}</p>}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}
          

              <Button type="submit" className="w-full" disabled={verifyLoading}>
                {verifyLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={onResendOtp}
                disabled={resendLoading || resendCooldown > 0}
              >
                {resendLoading
                  ? "Resending..."
                  : resendCooldown > 0
                  ? `Resend OTP (${resendCooldown}s)`
                  : "Resend OTP"}
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    setStep("send");
                    setError(null);
                    setMessage(null);
                  }}
                >
                  Change email
                </button>
              </div>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetSubmit(onResetPassword)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  className="flex h-8 w-full rounded-md border border-gray-500 bg-background px-3 py-2 
                  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm 
                  file:font-medium placeholder:text-muted-foreground focus-visible:outline-none 
                  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                  disabled:opacity-50"
                  type="password"
                  {...registerReset("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
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
                {resetErrors.password && <p className="text-sm text-red-500">{resetErrors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 
                  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm 
                  file:font-medium placeholder:text-muted-foreground focus-visible:outline-none 
                  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                  disabled:opacity-50"
                  type="password"
                  {...registerReset("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getResetValues("password") || "Passwords do not match",
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
                {resetErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{resetErrors.confirmPassword.message}</p>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              <Button type="submit" className="w-full" disabled={resetLoading}>
                {resetLoading ? "Saving..." : "Reset password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
