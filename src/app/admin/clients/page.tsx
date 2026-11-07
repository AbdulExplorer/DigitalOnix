"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Building2,
  ExternalLink,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useToast } from "@/context/AdminToastContext";
import { AdminClient } from "@/types/admin";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminDeleteConfirm } from "@/components/admin/AdminDeleteConfirm";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";

const SYMBOLS: AdminClient["symbol"][] = [
  "hexagon",
  "diamond",
  "circle-nodes",
  "rings",
  "triangle",
  "cross",
  "wave",
  "cube",
];

const INITIAL_CLIENT_STATE = {
  name: "",
  industry: "Technology",
  symbol: "hexagon" as AdminClient["symbol"],
  websiteUrl: "https://example.com",
  logoUrl: "",
  status: "active" as "active" | "inactive",
};

export default function AdminClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useAdminData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_CLIENT_STATE);
  const [deleteTarget, setDeleteTarget] = useState<AdminClient | null>(null);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(INITIAL_CLIENT_STATE);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminClient) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      industry: item.industry,
      symbol: item.symbol,
      websiteUrl: item.websiteUrl || "https://example.com",
      logoUrl: item.logoUrl || "",
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast("Please enter client brand name.", "error");
      return;
    }

    try {
      if (editingId) {
        await updateClient(editingId, {
          name: formData.name,
          industry: formData.industry,
          symbol: formData.symbol,
          websiteUrl: formData.websiteUrl,
          logoUrl: formData.logoUrl,
          status: formData.status,
        });
        showToast(`Updated "${formData.name}" successfully!`, "success");
      } else {
        await addClient({
          name: formData.name,
          industry: formData.industry,
          symbol: formData.symbol,
          websiteUrl: formData.websiteUrl,
          logoUrl: formData.logoUrl,
          status: formData.status,
        });
        showToast(`Added client "${formData.name}" successfully!`, "success");
      }
    } catch (err: any) {
      showToast(err?.message || "Saved locally.", "info");
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-wrap">
          <h1>Client Management</h1>
          <p>Manage partner brand logos featured in the marquee and social proof ribbons.</p>
        </div>

        <div className="admin-header-actions">
          <button onClick={handleOpenAdd} className="adm-btn adm-btn-primary">
            <Plus size={16} />
            <span>Add Client Brand</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Search */}
      <div className="admin-toolbar-row">
        <div className="admin-search-wrap">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by client or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>Industry</th>
                <th>Geometric Symbol</th>
                <th>Website</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--adm-text-muted)" }}>
                    No client logos found.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="admin-td-primary" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {client.logoUrl ? (
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid var(--adm-border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              padding: "2px",
                              flexShrink: 0,
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={client.logoUrl}
                              alt={client.name}
                              style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              backgroundColor: "rgba(139, 61, 255, 0.1)",
                              border: "1px solid rgba(139, 61, 255, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--adm-primary)",
                              flexShrink: 0,
                            }}
                          >
                            <Building2 size={18} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--adm-text)" }}>{client.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>{client.industry}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.8rem", color: "var(--adm-text-secondary)" }}>
                        {client.industry}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "var(--adm-radius-sm)",
                          backgroundColor: "var(--adm-card-elevated)",
                          border: "1px solid var(--adm-border)",
                          color: "var(--adm-text-secondary)",
                          textTransform: "capitalize",
                        }}
                      >
                        {client.symbol}
                      </span>
                    </td>
                    <td>
                      {client.websiteUrl ? (
                        <a
                          href={client.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            color: "var(--adm-primary)",
                            fontSize: "0.78rem",
                            textDecoration: "none",
                          }}
                        >
                          <span>Visit</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span style={{ fontSize: "0.78rem", color: "var(--adm-text-muted)" }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`adm-status-badge ${client.status}`}>
                        {client.status}
                      </span>
                    </td>
                    <td>
                      <div className="adm-action-btns" style={{ justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleOpenEdit(client)}
                          className="adm-icon-btn"
                          title="Edit Client"
                          aria-label={`Edit ${client.name}`}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(client)}
                          className="adm-icon-btn danger"
                          title="Delete Client"
                          aria-label={`Delete ${client.name}`}
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

      {/* Add / Edit Client Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Client Brand" : "Add Client Brand"}
        maxWidth="540px"
      >
        <form onSubmit={handleSave}>
          <div className="adm-form-grid-2">
            <div className="adm-form-group">
              <label className="adm-form-label">
                Client Brand Name <span>*</span>
              </label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. Apex Hospital Network"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Industry Sector</label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. Healthcare, Retail, Tech"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
          </div>

          <div className="adm-form-grid-2">
            <div className="adm-form-group">
              <label className="adm-form-label">Brand Website URL</label>
              <input
                type="url"
                className="adm-input"
                placeholder="https://clientbrand.com"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Marquee Symbol Type</label>
              <select
                className="adm-select"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value as AdminClient["symbol"] })}
              >
                {SYMBOLS.map((sym) => (
                  <option key={sym} value={sym} style={{ textTransform: "capitalize" }}>
                    {sym}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Logo Upload Dropzone */}
          <AdminImageUploader
            label="Upload Custom Logo Asset (Optional)"
            currentImageUrl={formData.logoUrl}
            onImageChange={(url) => setFormData({ ...formData, logoUrl: url })}
            helperText="Transparent SVG or PNG recommended"
          />

          <div className="adm-form-group">
            <label className="adm-form-label">Display Status</label>
            <select
              className="adm-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="active">Active (Featured in Marquee)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid var(--adm-border)" }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="adm-btn adm-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="adm-btn adm-btn-primary">
              {editingId ? "Save Changes" : "Create Client"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <AdminDeleteConfirm
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteClient(deleteTarget.id);
            showToast(`Deleted client "${deleteTarget.name}"`, "info");
          }}
          itemTitle={deleteTarget.name}
          itemType="Client Partner"
        />
      )}
    </div>
  );
}

