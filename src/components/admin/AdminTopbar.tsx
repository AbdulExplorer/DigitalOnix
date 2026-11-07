"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink, ShieldCheck, Key, LogOut, ChevronDown } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ChangePasswordModal } from "./ChangePasswordModal";

interface AdminTopbarProps {
  onOpenMobileSidebar: () => void;
}

const PAGE_NAMES: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/portfolio": "Portfolio Projects",
  "/admin/services": "Services Catalog",
  "/admin/testimonials": "Client Testimonials",
  "/admin/clients": "Brand Partners & Logos",
  "/admin/enquiries": "Client Enquiries",
  "/admin/content": "Website Content Management",
};

export function AdminTopbar({ onOpenMobileSidebar }: AdminTopbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const currentPageTitle = PAGE_NAMES[pathname] || "Admin Console";

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            onClick={onOpenMobileSidebar}
            className="admin-mobile-toggle-btn"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <nav className="admin-breadcrumbs" aria-label="Breadcrumbs">
            <span>Admin</span>
            <span style={{ color: "var(--adm-border-light)" }}>/</span>
            <strong>{currentPageTitle}</strong>
          </nav>
        </div>

        <div className="admin-topbar-right">
          {/* View Live Public Site */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="adm-btn adm-btn-secondary adm-btn-sm"
            title="Open Public Website in new tab"
          >
            <span>Live Site</span>
            <ExternalLink size={14} />
          </Link>

          {/* User Profile Menu */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.75rem",
                borderRadius: "var(--adm-radius-full)",
                backgroundColor: "var(--adm-card)",
                border: "1px solid var(--adm-border)",
                color: "var(--adm-text)",
                cursor: "pointer",
                transition: "border-color 0.15s ease",
              }}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <ShieldCheck size={15} style={{ color: "var(--adm-primary)" }} />
              <span style={{ fontSize: "0.785rem", fontWeight: 600 }}>
                {user?.name?.split(" ")[0] || "Admin"}
              </span>
              <ChevronDown size={14} style={{ color: "var(--adm-text-muted)" }} />
            </button>

            {isUserMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "220px",
                  backgroundColor: "var(--adm-card-elevated)",
                  border: "1px solid var(--adm-border)",
                  borderRadius: "var(--adm-radius-md)",
                  boxShadow: "var(--adm-shadow)",
                  padding: "0.5rem",
                  zIndex: 60,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                <div style={{ padding: "0.5rem 0.65rem", borderBottom: "1px solid var(--adm-border)" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#FFFFFF" }}>
                    {user?.name || "Administrator"}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--adm-text-muted)", wordBreak: "break-all" }}>
                    {user?.email || "admin"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsChangePasswordOpen(true);
                  }}
                  className="adm-btn adm-btn-ghost adm-btn-sm"
                  style={{ width: "100%", justifyContent: "flex-start", gap: "0.5rem", padding: "0.55rem 0.65rem" }}
                >
                  <Key size={14} style={{ color: "var(--adm-primary)" }} />
                  <span>Change Password</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="adm-btn adm-btn-ghost adm-btn-sm"
                  style={{ width: "100%", justifyContent: "flex-start", gap: "0.5rem", padding: "0.55rem 0.65rem", color: "var(--adm-danger)" }}
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}
