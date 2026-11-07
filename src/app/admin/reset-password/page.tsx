"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { resetPasswordSchema } from "@/lib/validation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setIsValidSession(false);
      return;
    }

    // 1. Listen for PASSWORD_RECOVERY event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidSession(true);
      }
    });

    // 2. Also check if the URL hash contains access_token or session is present
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      } else {
        // Wait briefly in case Supabase is parsing hash tokens
        setTimeout(() => {
          setIsValidSession((current) => (current === true ? true : false));
        }, 1200);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setErrorMessage("");

    // Zod validation
    const validation = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validation.success) {
      setValidationError(validation.error.issues[0]?.message || "Password does not meet requirements.");
      return;
    }

    if (!supabase) {
      setErrorMessage("Authentication client is unavailable.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: validation.data.password,
      });

      if (error) {
        setErrorMessage("Unable to update password. Please request a new recovery link.");
        return;
      }

      // On success: global sign out and redirect to login with message
      await supabase.auth.signOut({ scope: "global" });
      router.push(`/admin/login?message=${encodeURIComponent("Password updated. Please log in.")}`);
    } catch {
      setErrorMessage("An unexpected error occurred while updating password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Checking session state
  if (isValidSession === null) {
    return (
      <div style={{ textAlign: "center", color: "var(--adm-text-secondary)" }}>
        <p style={{ fontSize: "0.9rem" }}>Verifying password recovery link...</p>
      </div>
    );
  }

  // Invalid or expired recovery link
  if (isValidSession === false) {
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
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
            borderColor: "var(--adm-border)",
            textAlign: "center",
            padding: "2.5rem 1.75rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "var(--adm-danger-bg)",
              color: "var(--adm-danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem auto",
            }}
          >
            <AlertTriangle size={24} />
          </div>

          <h2
            style={{
              fontFamily: "var(--adm-font-heading)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: "0.5rem",
            }}
          >
            This link is invalid or expired
          </h2>
          <p
            style={{
              color: "var(--adm-text-secondary)",
              fontSize: "0.85rem",
              lineHeight: 1.5,
              marginBottom: "1.75rem",
            }}
          >
            Password reset links are single-use and expire after a short period. Please request a new reset link.
          </p>

          <Link
            href="/admin/forgot-password"
            className="adm-btn adm-btn-primary"
            style={{ width: "100%", padding: "0.75rem" }}
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

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
            Set New Password
          </h1>
          <p style={{ color: "var(--adm-text-secondary)", fontSize: "0.825rem" }}>
            Choose a strong password with at least 12 characters, letters &amp; numbers
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "1.75rem" }}>
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

          {validationError && (
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
              {validationError}
            </div>
          )}

          {/* New Password */}
          <div className="adm-form-group">
            <label className="adm-form-label" htmlFor="reset-new-password">
              New Password <span>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="reset-new-password"
                type={showPassword ? "text" : "password"}
                className="adm-input"
                style={{ paddingLeft: "2.35rem", paddingRight: "2.35rem" }}
                placeholder="Minimum 12 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationError) setValidationError("");
                }}
                required
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="adm-form-group">
            <label className="adm-form-label" htmlFor="reset-confirm-password">
              Confirm Password <span>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="reset-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className="adm-input"
                style={{ paddingLeft: "2.35rem", paddingRight: "2.35rem" }}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (validationError) setValidationError("");
                }}
                required
                autoComplete="new-password"
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="adm-btn adm-btn-primary"
            style={{ width: "100%", padding: "0.75rem", marginTop: "0.5rem" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Updating Password...</span>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
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
