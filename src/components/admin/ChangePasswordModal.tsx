"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { AdminModal } from "./AdminModal";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useToast } from "@/context/AdminToastContext";
import { supabase } from "@/lib/supabase-client";
import { changePasswordSchema } from "@/lib/validation";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const { user } = useAdminAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [validationError, setValidationError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setValidationError("");
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setErrorMessage("");

    // 1. Validate with Zod
    const validation = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      setValidationError(validation.error.issues[0]?.message || "Password does not meet requirements.");
      return;
    }

    // 2. Read logged-in user's email directly from active session (NEVER hardcoded)
    const userEmail = user?.email;
    if (!userEmail) {
      setErrorMessage("Unable to verify logged-in user session.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (supabase) {
        // Step A: Verify current password
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: currentPassword,
        });

        if (verifyError) {
          // Show generic error message for security
          setErrorMessage("Current password verification failed. Please try again.");
          setIsSubmitting(false);
          return;
        }

        // Step B: Update user password
        const { error: updateError } = await supabase.auth.updateUser({
          password: validation.data.newPassword,
        });

        if (updateError) {
          setErrorMessage("Failed to update password. Please try again.");
          setIsSubmitting(false);
          return;
        }

        // Step C: Sign out other sessions
        await supabase.auth.signOut({ scope: "others" });
      }

      showToast("Password updated successfully. Other active sessions signed out.", "success");
      handleClose();
    } catch {
      setErrorMessage("An unexpected error occurred while updating your password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      maxWidth="500px"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            className="adm-btn adm-btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="adm-btn adm-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <p style={{ color: "var(--adm-text-secondary)", fontSize: "0.825rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
          Enter your current password followed by a new password with at least 12 characters, including letters and numbers.
        </p>

        {errorMessage && (
          <div
            style={{
              backgroundColor: "var(--adm-danger-bg)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "var(--adm-danger)",
              padding: "0.65rem 0.85rem",
              borderRadius: "var(--adm-radius-md)",
              fontSize: "0.8rem",
              marginBottom: "1rem",
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
              marginBottom: "1rem",
              lineHeight: 1.4,
            }}
          >
            {validationError}
          </div>
        )}

        {/* Current Password */}
        <div className="adm-form-group">
          <label className="adm-form-label" htmlFor="change-current-password">
            Current Password <span>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="change-current-password"
              type={showCurrent ? "text" : "password"}
              className="adm-input"
              style={{ paddingLeft: "2.35rem", paddingRight: "2.35rem" }}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (validationError) setValidationError("");
              }}
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
              onClick={() => setShowCurrent(!showCurrent)}
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
              aria-label={showCurrent ? "Hide password" : "Show password"}
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="adm-form-group">
          <label className="adm-form-label" htmlFor="change-new-password">
            New Password <span>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="change-new-password"
              type={showNew ? "text" : "password"}
              className="adm-input"
              style={{ paddingLeft: "2.35rem", paddingRight: "2.35rem" }}
              placeholder="Minimum 12 characters"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
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
              onClick={() => setShowNew(!showNew)}
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
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="adm-form-group">
          <label className="adm-form-label" htmlFor="change-confirm-password">
            Confirm New Password <span>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="change-confirm-password"
              type={showConfirm ? "text" : "password"}
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
              onClick={() => setShowConfirm(!showConfirm)}
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
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </form>
    </AdminModal>
  );
}
