"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Quote,
  Building2,
  Inbox,
  FileText,
  LogOut,
  X,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useAdminData } from "@/context/AdminDataContext";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  count?: number | null;
  highlight?: boolean;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const { stats } = useAdminData();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Portfolio",
      href: "/admin/portfolio",
      icon: FolderKanban,
      count: stats.totalProjects,
    },
    {
      label: "Services",
      href: "/admin/services",
      icon: Layers,
      count: stats.totalServices,
    },
    {
      label: "Testimonials",
      href: "/admin/testimonials",
      icon: Quote,
      count: stats.totalTestimonials,
    },
    {
      label: "Client Logos",
      href: "/admin/clients",
      icon: Building2,
      count: stats.totalClients,
    },
    {
      label: "Enquiries",
      href: "/admin/enquiries",
      icon: Inbox,
      count: stats.newEnquiries > 0 ? stats.newEnquiries : null,
      highlight: stats.newEnquiries > 0,
    },
    {
      label: "Website Content",
      href: "/admin/content",
      icon: FileText,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        {/* Header Branding (Clean & Minimal: No SaaS pill, No extra clutter) */}
        <div className="admin-sidebar-header">
          <Link href="/admin" className="admin-brand-link" onClick={onClose}>
            <div className="admin-brand-logo">D</div>
            <span className="admin-brand-text">
              Digital<span style={{ color: "var(--adm-primary)" }}>onix</span>
            </span>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="adm-icon-btn admin-sidebar-close-btn"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Minimal Clean Navigation List */}
        <nav className="admin-nav-group" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
                onClick={onClose}
              >
                <Icon size={18} className="admin-nav-icon" />
                <span>{item.label}</span>
                {item.count !== undefined && item.count !== null && (
                  <span
                    className="admin-nav-count-badge"
                    style={
                      item.highlight
                        ? { backgroundColor: "var(--adm-primary)", color: "#FFFFFF" }
                        : { backgroundColor: "rgba(255, 255, 255, 0.08)", color: "var(--adm-text-secondary)" }
                    }
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}

          {/* View Website Link */}
          <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-nav-item"
              style={{ color: "var(--adm-text-muted)" }}
            >
              <ExternalLink size={16} />
              <span>Public Website</span>
            </Link>
          </div>
        </nav>

        {/* User Footer Profile */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-info-row">
            <div className="admin-user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">
                {user?.name || "Administrator"}
              </span>
              <span className="admin-user-role">
                {user?.role || "Super Admin"}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="admin-logout-icon-btn"
            title="Log out of console"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
