"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { useAuthStore } from "../../../store/authStore";
import api from "../../../lib/axios";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);

      if (data.data?.accessToken) {
        const profileRes = await api.get("/auth/me", {
          headers: { Authorization: data.data.accessToken },
        });
        setAuth(profileRes.data.data, data.data.accessToken);
        router.push("/rooms");
      } else {
        setError(data.message || "Please verify your email first");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
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
            <BookOpen size={28} />
          </div>
          <h1 className="auth-logo-title">The Dark Library</h1>
          <p className="auth-logo-sub">Your story awaits...</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Welcome Back</h2>
            <p className="auth-card-desc">Sign in to continue your story</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
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

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="auth-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="auth-spinner" />
                  Opening the doors...
                </>
              ) : (
                "Enter the Library"
              )}
            </button>
          </form>

          <p className="auth-footer">
            New writer?{" "}
            <Link href="/auth/register" className="auth-link">
              Join the Library →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}