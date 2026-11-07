"use client";

import React from "react";
import { AdminModal } from "./AdminModal";
import { AlertTriangle } from "lucide-react";

interface AdminDeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
  itemType: string;
}

export function AdminDeleteConfirm({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  itemType,
}: AdminDeleteConfirmProps) {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete ${itemType}`}
      maxWidth="440px"
      footer={
        <>
          <button onClick={onClose} className="adm-btn adm-btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="adm-btn adm-btn-danger"
          >
            Yes, Delete
          </button>
        </>
      }
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            backgroundColor: "var(--adm-danger-bg)",
            color: "var(--adm-danger)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={22} />
        </div>
        <div>
          <p style={{ color: "#FFFFFF", fontWeight: 600, marginBottom: "0.45rem" }}>
            Are you sure you want to delete this {itemType.toLowerCase()}?
          </p>
          <p style={{ color: "var(--adm-text-secondary)", fontSize: "0.85rem", lineHeight: 1.5 }}>
            &ldquo;<strong>{itemTitle}</strong>&rdquo; will be permanently removed. This action cannot be undone.
          </p>
        </div>
      </div>
    </AdminModal>
  );
}

