"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "./AdminLoginHero.css";

interface AdminLoginHeroProps {
  id?: string;
}

export default function AdminLoginHero({ id = "admin-login-hero" }: AdminLoginHeroProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <section id={id} className="admin-login-section">
      <div className="admin-login-container">
        {/* LEFT COLUMN: HERO CARD */}
        <div className="hero-card">
          <img
            src="https://images.pexels.com/photos/17485820/pexels-photo-17485820.png"
            alt="Hero Graphic"
            className="hero-card-image"
          />
          <div className="hero-card-overlay" />
          <div className="hero-card-content">
            <h2 className="hero-card-title">Look first, then leap.</h2>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM SECTION */}
        <div className="form-section">
          <div className="form-wrapper">
            <div className="form-header">
              <div className="logo-container">
                <img
                  src="/images/logo.png"
                  alt="Company Logo"
                  className="company-logo"
                />
              </div>
              <div className="header-text">
                <h1 className="header-title">Almost there</h1>
                <p className="header-subtitle">
                  Sign in to your administrative account
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input password-input"
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="form-hint">
                  Enter your assigned administrator credentials
                </p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? "Signing in..." : "Next"}
              </button>
            </form>

            <div className="form-footer">
              <p className="footer-text">
                Protected by system authentication rules and privacy guidelines.
              </p>
              <div className="legal-links">
                <a href="/privacy" className="legal-link">
                  Privacy Portal
                </a>
                <span className="link-divider">•</span>
                <a href="/terms" className="legal-link">
                  Terms of Use
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}