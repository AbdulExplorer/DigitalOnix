"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "640px",
}: AdminModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="adm-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="adm-modal-title"
    >
      <div
        className="adm-modal-box"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="adm-modal-header">
          <h2 id="adm-modal-title" className="adm-modal-title">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="adm-icon-btn"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <div className="adm-modal-body">{children}</div>

        {footer && <div className="adm-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

