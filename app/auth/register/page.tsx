"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import api from "../../../lib/axios";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    privacyPolicyAccepted: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { firstName, lastName, email, password } = form;
      if (!form.privacyPolicyAccepted) {
        setError("You must accept the privacy policy to register");
        setLoading(false);
        return;
      }

      // Debug: Log the endpoint being called
      const endpoint = "/user/create-user";
      console.log("🔵 Calling API endpoint:", endpoint);
      console.log("🔵 Full URL:", `http://localhost:8000/api/v1${endpoint}`);

      // ✅ Correct backend route: POST /user/create-user
      const response = await api.post(endpoint, {
        firstName,
        lastName,
        email,
        password,
        privacyPolicyAccepted: true,
      });

      console.log("✅ Registration successful:", response.data);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err: any) {
      console.error(
        "❌ Registration error:",
        err.response?.data || err.message,
      );
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
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
            <BookOpen size={28} />
          </div>
          <h1 className="auth-logo-title">The Dark Library</h1>
          <p className="auth-logo-sub">Begin your legend today</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">Create Account</h2>
            <p className="auth-card-desc">Join thousands of storytellers</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}
          {success && (
            <div className="auth-success">
              <span>✓</span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name Row */}
            <div className="auth-row">
              <div className="auth-field">
                <label className="auth-label">First Name</label>
                <div className="auth-input-wrap">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="reg-firstname"
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    placeholder="John"
                    required
                    className="auth-input"
                  />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-label">Last Name</label>
                <div className="auth-input-wrap">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="reg-lastname"
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    placeholder="Doe"
                    className="auth-input"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="reg-email"
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
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Min. 8 characters"
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

            {/* Confirm Password */}
            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="reg-confirm"
                  type={showPass ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                  className="auth-input auth-input-pass"
                />
              </div>
            </div>

            {/* Privacy Policy */}
            <label className="auth-privacy">
              <input
                id="reg-privacy"
                type="checkbox"
                checked={form.privacyPolicyAccepted}
                onChange={(e) =>
                  setForm({ ...form, privacyPolicyAccepted: e.target.checked })
                }
                className="auth-checkbox"
                required
              />
              <span>
                I agree to the{" "}
                <a href="#" className="auth-link">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="auth-link">
                  Terms of Service
                </a>
              </span>
            </label>

            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="auth-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="auth-spinner" />
                  Creating your account...
                </>
              ) : (
                "Start Writing →"
              )}
            </button>
          </form>

          <p className="auth-footer">
            Already a member?{" "}
            <Link href="/auth/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
