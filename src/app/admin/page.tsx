"use client";

import React from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Inbox,
  Sparkles,
  ArrowRight,
  Plus,
  Layers,
  Building2,
  Quote,
  FileText,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { EnquiryStatus } from "@/types/admin";

export default function AdminDashboardPage() {
  const { stats, enquiries, projects, updateEnquiryStatus } = useAdminData();
  const { user } = useAdminAuth();

  const recentEnquiries = enquiries.slice(0, 5);
  const recentProjects = projects.slice(0, 4);

  return (
    <div>
      {/* Page Header (Minimal & Clean) */}
      <div className="admin-page-header">
        <div className="admin-page-title-wrap">
          <h1>Welcome, {user?.name?.split(" ")[0] || "Admin"}</h1>
          <p>Overview of your agency projects, leads, and website content.</p>
        </div>

        <div className="admin-header-actions">
          <Link href="/admin/portfolio" className="adm-btn adm-btn-primary">
            <Plus size={16} />
            <span>Add Project</span>
          </Link>
          <Link href="/admin/enquiries" className="adm-btn adm-btn-secondary">
            <Inbox size={16} />
            <span>View Leads</span>
          </Link>
        </div>
      </div>

      {/* 4 Minimal Metric Cards (Clean & Uncluttered) */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Total Projects</span>
            <div className="admin-stat-icon-wrap">
              <FolderKanban size={18} />
            </div>
          </div>
          <div className="admin-stat-value">{stats.totalProjects}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Published Projects</span>
            <div className="admin-stat-icon-wrap" style={{ color: "var(--adm-success)", backgroundColor: "var(--adm-success-bg)", borderColor: "rgba(16, 185, 129, 0.25)" }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="admin-stat-value">{stats.publishedProjects}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">Total Enquiries</span>
            <div className="admin-stat-icon-wrap" style={{ color: "var(--adm-info)", backgroundColor: "var(--adm-info-bg)", borderColor: "rgba(59, 130, 246, 0.25)" }}>
              <Inbox size={18} />
            </div>
          </div>
          <div className="admin-stat-value">{stats.totalEnquiries}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <span className="admin-stat-label">New Enquiries</span>
            <div className="admin-stat-icon-wrap" style={{ color: "var(--adm-primary)", backgroundColor: "var(--adm-primary-subtle)", borderColor: "rgba(139, 61, 255, 0.25)" }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div className="admin-stat-value" style={{ color: stats.newEnquiries > 0 ? "var(--adm-primary)" : "inherit" }}>
            {stats.newEnquiries}
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Enquiries & Quick Management */}
      <div className="admin-dashboard-two-col">
        {/* Recent Enquiries Table */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Recent Enquiries</h2>
              <span className="admin-card-subtitle">Prospective clients from website quote form</span>
            </div>
            <Link href="/admin/enquiries" className="adm-btn adm-btn-ghost adm-btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--adm-text-muted)" }}>
                      No enquiries yet. Leads submitted through the website will appear here.
                    </td>
                  </tr>
                ) : (
                  recentEnquiries.map((enq) => (
                    <tr key={enq.id}>
                      <td>
                        <div className="admin-td-primary">{enq.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>{enq.email || enq.phone}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.8rem", color: "var(--adm-text-secondary)" }}>{enq.service}</div>
                      </td>
                      <td>
                        <span className={`adm-status-badge ${enq.status}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="adm-select"
                          style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem", width: "auto" }}
                          value={enq.status}
                          onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)}
                          aria-label="Change enquiry status"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Quick Management</h2>
          </div>
          <div className="admin-card-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link
              href="/admin/portfolio"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderRadius: "var(--adm-radius-md)",
                backgroundColor: "var(--adm-card-elevated)",
                border: "1px solid var(--adm-border)",
                textDecoration: "none",
                color: "var(--adm-text)",
                transition: "border-color 0.15s ease",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
                <FolderKanban size={18} style={{ color: "var(--adm-primary)" }} />
                <span>Projects</span>
              </span>
              <span style={{ fontWeight: 600, color: "var(--adm-text-secondary)" }}>{stats.totalProjects}</span>
            </Link>

            <Link
              href="/admin/services"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderRadius: "var(--adm-radius-md)",
                backgroundColor: "var(--adm-card-elevated)",
                border: "1px solid var(--adm-border)",
                textDecoration: "none",
                color: "var(--adm-text)",
                transition: "border-color 0.15s ease",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
                <Layers size={18} style={{ color: "var(--adm-primary)" }} />
                <span>Services</span>
              </span>
              <span style={{ fontWeight: 600, color: "var(--adm-text-secondary)" }}>{stats.activeServices}</span>
            </Link>

            <Link
              href="/admin/testimonials"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderRadius: "var(--adm-radius-md)",
                backgroundColor: "var(--adm-card-elevated)",
                border: "1px solid var(--adm-border)",
                textDecoration: "none",
                color: "var(--adm-text)",
                transition: "border-color 0.15s ease",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
                <Quote size={18} style={{ color: "var(--adm-primary)" }} />
                <span>Testimonials</span>
              </span>
              <span style={{ fontWeight: 600, color: "var(--adm-text-secondary)" }}>{stats.totalTestimonials}</span>
            </Link>

            <Link
              href="/admin/clients"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderRadius: "var(--adm-radius-md)",
                backgroundColor: "var(--adm-card-elevated)",
                border: "1px solid var(--adm-border)",
                textDecoration: "none",
                color: "var(--adm-text)",
                transition: "border-color 0.15s ease",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
                <Building2 size={18} style={{ color: "var(--adm-primary)" }} />
                <span>Client Logos</span>
              </span>
              <span style={{ fontWeight: 600, color: "var(--adm-text-secondary)" }}>{stats.totalClients}</span>
            </Link>

            <Link
              href="/admin/content"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                borderRadius: "var(--adm-radius-md)",
                backgroundColor: "var(--adm-card-elevated)",
                border: "1px solid var(--adm-border)",
                textDecoration: "none",
                color: "var(--adm-text)",
                transition: "border-color 0.15s ease",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
                <FileText size={18} style={{ color: "var(--adm-primary)" }} />
                <span>Website Content</span>
              </span>
              <ArrowRight size={14} style={{ color: "var(--adm-text-muted)" }} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Projects List (Clean card) */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Recent Projects</h2>
            <span className="admin-card-subtitle">Active creative work published on the website</span>
          </div>
          <Link href="/admin/portfolio" className="adm-btn adm-btn-ghost adm-btn-sm">
            <span>Manage All Projects</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="admin-card-body" style={{ padding: "1.25rem" }}>
          <div className="admin-projects-grid">
            {recentProjects.map((proj) => (
              <div
                key={proj.id}
                style={{
                  padding: "1rem",
                  borderRadius: "var(--adm-radius-md)",
                  backgroundColor: "var(--adm-card-elevated)",
                  border: "1px solid var(--adm-border)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--adm-primary)", fontWeight: 600, marginBottom: "0.25rem" }}>
                    {proj.category}
                  </div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#FFFFFF", marginBottom: "0.35rem" }}>
                    {proj.title}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--adm-text-secondary)", lineHeight: 1.4, margin: 0 }}>
                    {proj.clientLabel || proj.client}
                  </p>
                </div>
                <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className={`adm-status-badge ${proj.status}`}>
                    {proj.status}
                  </span>
                  <Link
                    href="/admin/portfolio"
                    className="adm-btn adm-btn-ghost adm-btn-sm"
                    style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
