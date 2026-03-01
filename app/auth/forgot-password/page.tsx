/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {  Mail, Loader2, ArrowLeft, Key } from "lucide-react";
import api from "../../../lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/forgot-password", { email });

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(
            `/auth/reset-password?email=${encodeURIComponent(email)}`,
          );
        }, 2000);
      } else {
        setError(data.message || "Failed to send reset code");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset code. Please try again.",
      );
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
            <Key size={28} />
          </div>
          <h1 className="auth-logo-title">Reset Password</h1>
          <p className="auth-logo-sub">We ll send you a reset code</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Forgot Password?</h2>
            <p className="auth-card-desc">
              Enter your email to receive a password reset code
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              <span>✓</span> Reset code sent! Check your email (or console in
              dev mode)
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="auth-input"
                  disabled={loading || success}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="auth-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="auth-spinner" />
                  Sending code...
                </>
              ) : success ? (
                "Code sent ✓"
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>

          <p className="auth-footer">
            <Link href="/auth/login" className="auth-link">
              <ArrowLeft size={14} /> Back to login
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
          padding: 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}
