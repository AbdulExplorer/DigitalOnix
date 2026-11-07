"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useToast } from "@/context/AdminToastContext";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, KeyRound, CheckCircle2 } from "lucide-react";

function AdminLoginForm() {
  const { login, isAuthenticated } = useAdminAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const urlMessage = searchParams.get("message");

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        showToast("Welcome to Digitalonix Admin Console", "success");
        router.push("/admin");
      } else {
        setErrorMessage(result.error || "Invalid credentials. Please check your email and password.");
      }
    } catch {
      setErrorMessage("Authentication service unavailable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@digitalonix.in");
    setPassword("admin123");
    setErrorMessage("");
    showToast("Filled demo administrator credentials", "info");
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        padding: "2rem 1.5rem",
        margin: "0 auto",
      }}
    >
      <div
        className="admin-card"
        style={{
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6), 0 0 40px rgba(139, 61, 255, 0.12)",
          borderColor: "var(--adm-border)",
        }}
      >
        <div
          style={{
            padding: "2rem 1.75rem 1.25rem 1.75rem",
            textAlign: "center",
            borderBottom: "1px solid var(--adm-border)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--adm-primary), #4C1D95)",
              margin: "0 auto 1rem auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "1.25rem",
              boxShadow: "0 4px 18px var(--adm-primary-glow)",
            }}
          >
            D
          </div>
          <h1
            style={{
              fontFamily: "var(--adm-font-heading)",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: "0.25rem",
            }}
          >
            Digitalonix Admin Console
          </h1>
          <p style={{ color: "var(--adm-text-secondary)", fontSize: "0.825rem" }}>
            Sign in to manage agency projects, services &amp; enquiries
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "1.75rem" }}>
          {urlMessage && (
            <div
              style={{
                backgroundColor: "var(--adm-success-bg)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "var(--adm-success)",
                padding: "0.75rem 0.85rem",
                borderRadius: "var(--adm-radius-md)",
                fontSize: "0.8rem",
                marginBottom: "1.25rem",
                lineHeight: 1.4,
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              <CheckCircle2 size={16} />
              <span>{urlMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                backgroundColor: "var(--adm-danger-bg)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "var(--adm-danger)",
                padding: "0.65rem 0.85rem",
                borderRadius: "var(--adm-radius-md)",
                fontSize: "0.8rem",
                marginBottom: "1.25rem",
                lineHeight: 1.4,
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Email Field */}
          <div className="adm-form-group">
            <label className="adm-form-label" htmlFor="admin-email">
              Admin Email <span>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="admin-email"
                type="email"
                className="adm-input"
                style={{ paddingLeft: "2.35rem" }}
                placeholder="admin@digitalonix.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--adm-text-muted)",
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="adm-form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="adm-form-label" htmlFor="admin-password">
                Password <span>*</span>
              </label>
              <Link
                href="/admin/forgot-password"
                style={{
                  color: "var(--adm-primary)",
                  fontSize: "0.75rem",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                className="adm-input"
                style={{ paddingLeft: "2.35rem", paddingRight: "2.35rem" }}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--adm-text-muted)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "var(--adm-text-muted)",
                  cursor: "pointer",
                  display: "flex",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              marginTop: "0.25rem",
            }}
          >
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                accentColor: "var(--adm-primary)",
                cursor: "pointer",
                width: "15px",
                height: "15px",
              }}
            />
            <label
              htmlFor="remember-me"
              style={{
                fontSize: "0.8rem",
                color: "var(--adm-text-secondary)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Remember this secure session
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="adm-btn adm-btn-primary"
            style={{ width: "100%", padding: "0.75rem" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Quick Demo Credentials Filler */}
          <div
            style={{
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px dashed var(--adm-border)",
              textAlign: "center",
            }}
          >
            <button
              type="button"
              onClick={handleFillDemo}
              className="adm-btn adm-btn-secondary adm-btn-sm"
              style={{ width: "100%", fontSize: "0.78rem" }}
            >
              <KeyRound size={14} style={{ color: "var(--adm-primary)" }} />
              <span>Fill Demo Credentials (admin@digitalonix.in)</span>
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.45rem",
          color: "var(--adm-text-muted)",
          fontSize: "0.72rem",
          textAlign: "center",
          marginTop: "1.25rem",
        }}
      >
        <ShieldCheck size={14} />
        <span>TLS Encrypted Administrative Gateway</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ color: "var(--adm-text-secondary)" }}>Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
