"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import { emailSchema } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 60-second cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // 1. Zod Validation
    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      setValidationError(validation.error.issues[0]?.message || "Please enter a valid email address.");
      return;
    }

    if (countdown > 0) return;

    setIsSubmitting(true);

    try {
      if (supabase) {
        const redirectTo = `${window.location.origin}/admin/reset-password`;
        await supabase.auth.resetPasswordForEmail(validation.data.email, {
          redirectTo,
        });
      }
    } catch {
      // Intentionally suppress specific error details for security
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setCountdown(60);
    }
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
            Forgot Password
          </h1>
          <p style={{ color: "var(--adm-text-secondary)", fontSize: "0.825rem" }}>
            Enter your email to receive secure recovery instructions
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "1.75rem" }}>
          {isSubmitted && (
            <div
              style={{
                backgroundColor: "var(--adm-success-bg)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "var(--adm-success)",
                padding: "0.85rem 1rem",
                borderRadius: "var(--adm-radius-md)",
                fontSize: "0.825rem",
                marginBottom: "1.25rem",
                lineHeight: 1.5,
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>If this email is registered, you will receive a reset link.</span>
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

          <div className="adm-form-group">
            <label className="adm-form-label" htmlFor="forgot-email">
              Administrator Email <span>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="forgot-email"
                type="email"
                className="adm-input"
                style={{ paddingLeft: "2.35rem" }}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError("");
                }}
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

          <button
            type="submit"
            className="adm-btn adm-btn-primary"
            style={{ width: "100%", padding: "0.75rem", marginTop: "0.5rem" }}
            disabled={isSubmitting || countdown > 0}
          >
            {isSubmitting ? (
              <span>Sending...</span>
            ) : countdown > 0 ? (
              <span>Resend link ({countdown}s)</span>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link
              href="/admin/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "var(--adm-text-secondary)",
                fontSize: "0.8rem",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--adm-text-secondary)")}
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </Link>
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
