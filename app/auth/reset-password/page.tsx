/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {  Lock, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import api from "../../../lib/axios";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempToken, setTempToken] = useState("");
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push("/auth/forgot-password");
    }
  }, [email, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.patch("/auth/verify-otp", {
        email,
        otp: otpCode,
      });

      if (data.success && data.data?.accessToken) {
        setTempToken(data.data.accessToken);
        setStep("password");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.patch(
        "/auth/reset-password",
        { password },
        {
          headers: { Authorization: tempToken },
        },
      );

      if (data.success) {
        alert(
          "Password reset successful! Please login with your new password.",
        );
        router.push("/auth/login");
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/forgot-password", { email });
      alert("New code sent! Check your email (or console in development mode)");
      setOtp(["", "", "", "", "", ""]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        <div className="auth-grid" />
      </div>

      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Lock size={28} />
          </div>
          <h1 className="auth-logo-title">Reset Password</h1>
          <p className="auth-logo-sub">
            {step === "otp" ? "Verify your identity" : "Create new password"}
          </p>
        </div>

        {/* Card */}
        <div className="auth-card">
          {step === "otp" ? (
            <>
              <div className="auth-card-header">
                <h2 className="auth-card-title">Enter Reset Code</h2>
                <p className="auth-card-desc">
                  We sent a code to <strong>{email}</strong>
                </p>
              </div>

              {error && (
                <div className="auth-error">
                  <span>⚠</span> {error}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="auth-form">
                <div className="otp-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="otp-input"
                      disabled={loading}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading} className="auth-btn">
                  {loading ? (
                    <>
                      <Loader2 size={16} className="auth-spinner" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </button>
              </form>

              <div className="auth-footer" style={{ textAlign: "center" }}>
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="auth-resend-btn"
                >
                  Didnt receive code? Resend
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="auth-card-header">
                <h2 className="auth-card-title">Create New Password</h2>
                <p className="auth-card-desc">
                  Choose a strong password (min 8 characters)
                </p>
              </div>

              {error && (
                <div className="auth-error">
                  <span>⚠</span> {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="auth-form">
                <div className="auth-field">
                  <label className="auth-label">New Password</label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="auth-input auth-input-pass"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="auth-eye-btn"
                      tabIndex={-1}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-label">Confirm Password</label>
                  <div className="auth-input-wrap">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="auth-input auth-input-pass"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="auth-eye-btn"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="auth-btn">
                  {loading ? (
                    <>
                      <Loader2 size={16} className="auth-spinner" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </>
          )}

          <p className="auth-footer">
            <Link href="/auth/login" className="auth-link">
              <ArrowLeft size={14} /> Back to login
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .otp-container {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin: 24px 0;
        }

        .otp-input {
          width: 48px;
          height: 56px;
          text-align: center;
          font-size: 24px;
          font-weight: 600;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.3);
          color: white;
          transition: all 0.3s ease;
        }

        .otp-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
          transform: scale(1.05);
        }

        .otp-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .auth-resend-btn {
          background: none;
          border: none;
          color: #8b5cf6;
          cursor: pointer;
          font-size: 14px;
          padding: 8px 0;
          text-decoration: underline;
          transition: all 0.2s;
        }

        .auth-resend-btn:hover:not(:disabled) {
          color: #a78bfa;
        }

        .auth-resend-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
