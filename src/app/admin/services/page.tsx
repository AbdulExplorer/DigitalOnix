"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  Megaphone,
  Share2,
  Target,
  Video,
  Code,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useToast } from "@/context/AdminToastContext";
import { AdminService, ServiceCategory } from "@/types/admin";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminDeleteConfirm } from "@/components/admin/AdminDeleteConfirm";

const AVAILABLE_ICONS = [
  "Megaphone",
  "Share2",
  "Target",
  "Video",
  "Code",
  "MapPin",
  "TrendingUp",
  "Sparkles",
  "Palette",
];

const INITIAL_SERVICE_STATE = {
  title: "",
  category: "Marketing & Growth" as ServiceCategory,
  shortDescription: "",
  detailedDescription: "",
  iconName: "Megaphone",
  features: ["Strategic Execution", "Target Optimization", "Performance Analytics"],
  deliverables: ["Monthly Reporting", "Dedicated Support"],
  status: "active" as "active" | "draft",
};

export default function AdminServicesPage() {
  const { services, addService, updateService, deleteService } = useAdminData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_SERVICE_STATE);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<AdminService | null>(null);

  // Filter
  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingServiceId(null);
    setFormData(INITIAL_SERVICE_STATE);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc: AdminService) => {
    setEditingServiceId(svc.id);
    setFormData({
      title: svc.title,
      category: svc.category,
      shortDescription: svc.shortDescription,
      detailedDescription: svc.detailedDescription,
      iconName: svc.iconName,
      features: svc.features || [],
      deliverables: svc.deliverables || [],
      status: svc.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Service title is required.", "error");
      return;
    }

    if (editingServiceId) {
      updateService(editingServiceId, {
        title: formData.title,
        category: formData.category,
        shortDescription: formData.shortDescription,
        detailedDescription: formData.detailedDescription,
        iconName: formData.iconName,
        features: formData.features,
        deliverables: formData.deliverables,
        status: formData.status,
      });
      showToast(`Updated "${formData.title}"`, "success");
    } else {
      addService({
        title: formData.title,
        category: formData.category,
        shortDescription: formData.shortDescription,
        detailedDescription: formData.detailedDescription,
        iconName: formData.iconName,
        features: formData.features,
        deliverables: formData.deliverables,
        status: formData.status,
      });
      showToast(`Added service "${formData.title}"`, "success");
    }

    setIsModalOpen(false);
  };

  const handleFeatureAdd = () => {
    setFormData({ ...formData, features: [...formData.features, "New Feature"] });
  };

  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...formData.features];
    updated[index] = val;
    setFormData({ ...formData, features: updated });
  };

  const handleFeatureRemove = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-wrap">
          <h1>Services Management</h1>
          <p>Add, edit, or customize agency service offerings and deliverables.</p>
        </div>

        <div className="admin-header-actions">
          <button onClick={handleOpenAdd} className="adm-btn adm-btn-primary">
            <Plus size={16} />
            <span>Add New Service</span>
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
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="admin-filter-pills">
          {[
            "All",
            "Marketing & Growth",
            "Creative Production",
            "Technology",
            "Local Visibility",
          ].map((cat) => (
            <button
              key={cat}
              className={`admin-filter-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Icon</th>
                <th>Highlights</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--adm-text-muted)" }}>
                    No services found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredServices.map((svc) => (
                  <tr key={svc.id}>
                    <td>
                      <div className="admin-td-primary">{svc.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)", maxWidth: "380px" }}>
                        {svc.shortDescription}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.8rem", color: "var(--adm-text-secondary)" }}>
                        {svc.category}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "var(--adm-radius-sm)",
                          backgroundColor: "var(--adm-primary-subtle)",
                          color: "var(--adm-primary)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {svc.iconName}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                        {svc.features.slice(0, 2).map((f, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "0.7rem",
                              backgroundColor: "var(--adm-card-elevated)",
                              border: "1px solid var(--adm-border)",
                              padding: "0.1rem 0.4rem",
                              borderRadius: "var(--adm-radius-sm)",
                              color: "var(--adm-text-secondary)",
                            }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`adm-status-badge ${svc.status}`}>
                        {svc.status}
                      </span>
                    </td>
                    <td>
                      <div className="adm-action-btns" style={{ justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleOpenEdit(svc)}
                          className="adm-icon-btn"
                          title="Edit Service"
                          aria-label={`Edit ${svc.title}`}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(svc)}
                          className="adm-icon-btn danger"
                          title="Delete Service"
                          aria-label={`Delete ${svc.title}`}
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

      {/* Add / Edit Service Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingServiceId ? "Edit Agency Service" : "Add New Agency Service"}
        maxWidth="620px"
      >
        <form onSubmit={handleSave}>
          <div className="adm-form-grid-2">
            <div className="adm-form-group">
              <label className="adm-form-label">
                Service Title <span>*</span>
              </label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. Paid Advertising & Performance"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Category</label>
              <select
                className="adm-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
              >
                <option value="Marketing & Growth">Marketing &amp; Growth</option>
                <option value="Creative Production">Creative Production</option>
                <option value="Technology">Technology</option>
                <option value="Local Visibility">Local Visibility</option>
              </select>
            </div>
          </div>

          <div className="adm-form-grid-2">
            <div className="adm-form-group">
              <label className="adm-form-label">Visual Icon Identifier</label>
              <select
                className="adm-select"
                value={formData.iconName}
                onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
              >
                {AVAILABLE_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Status</label>
              <select
                className="adm-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label">Short Summary (for Service Cards)</label>
            <textarea
              className="adm-textarea"
              placeholder="High-conversion ad copy, creative A/B testing..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              rows={2}
            />
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label">Detailed Description</label>
            <textarea
              className="adm-textarea"
              placeholder="Comprehensive growth systems combining market research, inbound funnel architecture..."
              value={formData.detailedDescription}
              onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
              rows={3}
            />
          </div>

          {/* Dynamic Key Features */}
          <div style={{ marginTop: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label className="adm-form-label" style={{ margin: 0 }}>
                Features &amp; Capabilities
              </label>
              <button
                type="button"
                onClick={handleFeatureAdd}
                className="adm-btn adm-btn-secondary adm-btn-sm"
              >
                + Add Feature
              </button>
            </div>

            {formData.features.map((feature, idx) => (
              <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.45rem", alignItems: "center" }}>
                <input
                  type="text"
                  className="adm-input"
                  value={feature}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleFeatureRemove(idx)}
                  className="adm-icon-btn danger"
                  title="Remove feature"
                >
                  ✕
                </button>
              </div>
            ))}
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
              {editingServiceId ? "Save Changes" : "Create Service"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirm */}
      {deleteTarget && (
        <AdminDeleteConfirm
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteService(deleteTarget.id);
            showToast(`Deleted service "${deleteTarget.title}"`, "info");
          }}
          itemTitle={deleteTarget.title}
          itemType="Agency Service"
        />
      )}
    </div>
  );
}

