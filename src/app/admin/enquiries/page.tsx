"use client";

import React, { useState } from "react";
import {
  Inbox,
  Search,
  Trash2,
  Mail,
  Phone,
  Eye,
  Download,
  Calendar,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useToast } from "@/context/AdminToastContext";
import { AdminEnquiry, EnquiryStatus } from "@/types/admin";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminDeleteConfirm } from "@/components/admin/AdminDeleteConfirm";

export default function AdminEnquiriesPage() {
  const { enquiries, updateEnquiryStatus, deleteEnquiry } = useAdminData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // View Details Modal
  const [activeEnquiry, setActiveEnquiry] = useState<AdminEnquiry | null>(null);

  // Delete Confirm
  const [deleteTarget, setDeleteTarget] = useState<AdminEnquiry | null>(null);

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || e.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: EnquiryStatus) => {
    updateEnquiryStatus(id, newStatus);
    showToast(`Updated enquiry status to "${newStatus}"`, "success");
    if (activeEnquiry && activeEnquiry.id === id) {
      setActiveEnquiry({ ...activeEnquiry, status: newStatus });
    }
  };

  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      showToast("No enquiries available to export.", "info");
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone", "Service", "Status", "Date", "Message"];
    const rows = filteredEnquiries.map((e) => [
      e.id,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.email.replace(/"/g, '""')}"`,
      `"${e.phone.replace(/"/g, '""')}"`,
      `"${e.service.replace(/"/g, '""')}"`,
      e.status,
      `"${e.submittedAt}"`,
      `"${e.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `digitalonix_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported enquiries to CSV", "success");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-wrap">
          <h1>Client Enquiries &amp; Leads</h1>
          <p>Review and follow up with prospective clients who requested quotes.</p>
        </div>

        <div className="admin-header-actions">
          <button onClick={handleExportCSV} className="adm-btn adm-btn-secondary">
            <Download size={15} />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="admin-toolbar-row">
        <div className="admin-search-wrap">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search leads by name, email, phone or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="admin-filter-pills">
          {["All", "new", "contacted", "completed"].map((st) => (
            <button
              key={st}
              className={`admin-filter-btn ${selectedStatus === st ? "active" : ""}`}
              onClick={() => setSelectedStatus(st)}
              style={{ textTransform: "capitalize" }}
            >
              {st === "All" ? "All Leads" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Lead / Contact</th>
                <th>Phone</th>
                <th>Service Requested</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--adm-text-muted)" }}>
                    No enquiries found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <div className="admin-td-primary">{enq.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>
                        <a
                          href={`mailto:${enq.email}`}
                          style={{ color: "var(--adm-primary)", textDecoration: "none" }}
                        >
                          {enq.email}
                        </a>
                      </div>
                    </td>
                    <td>
                      <a
                        href={`tel:${enq.phone}`}
                        style={{ fontSize: "0.8rem", color: "var(--adm-text-secondary)", textDecoration: "none" }}
                      >
                        {enq.phone}
                      </a>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.8rem", color: "var(--adm-text-secondary)" }}>
                        {enq.service}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>
                        {enq.submittedAt}
                      </div>
                    </td>
                    <td>
                      <select
                        className="adm-select"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", width: "auto" }}
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                        aria-label="Change status"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <div className="adm-action-btns" style={{ justifyContent: "flex-end" }}>
                        <button
                          onClick={() => setActiveEnquiry(enq)}
                          className="adm-icon-btn"
                          title="View Full Details"
                          aria-label={`View details for ${enq.name}`}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(enq)}
                          className="adm-icon-btn danger"
                          title="Delete Enquiry"
                          aria-label={`Delete enquiry from ${enq.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {activeEnquiry && (
        <AdminModal
          isOpen={!!activeEnquiry}
          onClose={() => setActiveEnquiry(null)}
          title="Client Enquiry Details"
          maxWidth="580px"
          footer={
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <a
                  href={`mailto:${activeEnquiry.email}?subject=Digitalonix%20Inquiry%20Response`}
                  className="adm-btn adm-btn-primary adm-btn-sm"
                >
                  <Mail size={14} />
                  <span>Email Lead</span>
                </a>
                <a
                  href={`tel:${activeEnquiry.phone}`}
                  className="adm-btn adm-btn-secondary adm-btn-sm"
                >
                  <Phone size={14} />
                  <span>Call Client</span>
                </a>
              </div>

              <button
                onClick={() => setActiveEnquiry(null)}
                className="adm-btn adm-btn-ghost adm-btn-sm"
              >
                Close
              </button>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "0.75rem", borderBottom: "1px solid var(--adm-border)" }}>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.2rem" }}>
                  {activeEnquiry.name}
                </h3>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.78rem", color: "var(--adm-text-secondary)" }}>
                  <span>{activeEnquiry.email}</span>
                  <span>•</span>
                  <span>{activeEnquiry.phone}</span>
                </div>
              </div>
              <span className={`adm-status-badge ${activeEnquiry.status}`}>
                {activeEnquiry.status}
              </span>
            </div>

            <div className="adm-form-grid-2">
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                  Requested Service
                </span>
                <p style={{ fontSize: "0.875rem", color: "#FFFFFF", fontWeight: 500, marginTop: "0.2rem" }}>
                  {activeEnquiry.service}
                </p>
              </div>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                  Submission Timestamp
                </span>
                <p style={{ fontSize: "0.875rem", color: "#FFFFFF", fontWeight: 500, marginTop: "0.2rem" }}>
                  {activeEnquiry.submittedAt}
                </p>
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Client Project Inquiry Note
              </span>
              <div
                style={{
                  backgroundColor: "var(--adm-card-elevated)",
                  border: "1px solid var(--adm-border)",
                  borderRadius: "var(--adm-radius-md)",
                  padding: "1rem",
                  marginTop: "0.35rem",
                  fontSize: "0.85rem",
                  color: "var(--adm-text)",
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                }}
              >
                {activeEnquiry.message || "No additional project brief specified."}
              </div>
            </div>

            {/* Quick Status Update */}
            <div>
              <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Workflow Progress
              </span>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.35rem" }}>
                {(["new", "contacted", "completed"] as EnquiryStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(activeEnquiry.id, status)}
                    className={`adm-filter-btn ${activeEnquiry.status === status ? "active" : ""}`}
                    style={{ textTransform: "capitalize", flex: 1, textAlign: "center" }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <AdminDeleteConfirm
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteEnquiry(deleteTarget.id);
            showToast(`Deleted enquiry from ${deleteTarget.name}`, "info");
          }}
          itemTitle={`Enquiry from ${deleteTarget.name}`}
          itemType="Client Lead"
        />
      )}
    </div>
  );
}

