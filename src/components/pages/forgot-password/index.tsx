import type React from "react"

import { useState, forwardRef } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return <input ref={ref} {...props} />
})

interface SendOtpFormData {
  email: string
}

interface VerifyOtpFormData {
  otp: string
  password: string
  confirmPassword: string
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [step, setStep] = useState<"send" | "verify">("send")
  const [emailForReset, setEmailForReset] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendOtpFormData>()
  const {
    register: registerVerify,
    handleSubmit: handleVerifySubmit,
    getValues: getVerifyValues,
    formState: { errors: verifyErrors },
  } = useForm<VerifyOtpFormData>()

  const onSendOtp = async (data: SendOtpFormData) => {
    setError(null)
    setMessage(null)
    setDevOtp(null)
    setLoading(true)

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(result.message || "Failed to request a reset link.")
        return
      }

      setMessage(result.message || "If the email exists, we sent an OTP.")
      setEmailForReset(data.email)
      setStep("verify")
      if (result.otp) {
        setDevOtp(result.otp)
      }
    } catch (err) {
      setError("Connection error. Please check your internet connection.")
    } finally {
      setLoading(false)
    }
  }

  const onVerifyOtp = async (data: VerifyOtpFormData) => {
    setError(null)
    setMessage(null)

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setVerifyLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailForReset,
          otp: data.otp,
          password: data.password,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(result.message || "Failed to verify OTP.")
        return
      }

      setMessage(result.message || "Password reset successful.")
      navigate("/login")
    } catch (err) {
      setError("Connection error. Please check your internet connection.")
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {step === "send" ? "Forgot Password" : "Verify OTP"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === "send" && (
            <form onSubmit={handleSubmit(onSendOtp)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 
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
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 
                  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm 
                  file:font-medium placeholder:text-muted-foreground focus-visible:outline-none 
                  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                  disabled:opacity-50"
                  type="text"
                  {...registerVerify("otp", {
                    required: "OTP is required",
                    minLength: { value: 6, message: "OTP must be 6 digits" },
                    maxLength: { value: 6, message: "OTP must be 6 digits" },
                  })}
                />
                {verifyErrors.otp && <p className="text-sm text-red-500">{verifyErrors.otp.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 
                  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm 
                  file:font-medium placeholder:text-muted-foreground focus-visible:outline-none 
                  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed 
                  disabled:opacity-50"
                  type="password"
                  {...registerVerify("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                {verifyErrors.password && <p className="text-sm text-red-500">{verifyErrors.password.message}</p>}
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
                  {...registerVerify("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === getVerifyValues("password") || "Passwords do not match",
                  })}
                />
                {verifyErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{verifyErrors.confirmPassword.message}</p>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              <Button type="submit" className="w-full" disabled={verifyLoading}>
                {verifyLoading ? "Verifying..." : "Reset password"}
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setStep("send")}
                >
                  Change email
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
