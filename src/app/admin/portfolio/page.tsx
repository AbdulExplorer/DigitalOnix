"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useToast } from "@/context/AdminToastContext";
import { AdminProject, ProjectCategory, ProjectStatus } from "@/types/admin";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminDeleteConfirm } from "@/components/admin/AdminDeleteConfirm";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";

const INITIAL_FORM_STATE = {
  title: "",
  category: "Results" as ProjectCategory,
  subcategory: "Paid Advertising & Performance",
  client: "",
  clientLabel: "",
  summary: "",
  description: "",
  projectUrl: "https://digitalonix.in",
  status: "published" as ProjectStatus,
  mediaType: "image" as "image" | "video",
  videoDuration: "",
  aspectRatio: "16/9" as "16/9" | "9/16" | "4/5" | "1/1",
  thumbnailUrl: "",
  metrics: [
    { label: "ROAS / Growth", value: "+120%" },
    { label: "Cost Per Lead", value: "-35%" },
  ],
};

export default function AdminPortfolioPage() {
  const { projects, addProject, updateProject, deleteProject } = useAdminData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<AdminProject | null>(null);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All" || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingProjectId(null);
    setFormData(INITIAL_FORM_STATE);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (project: AdminProject) => {
    setEditingProjectId(project.id);
    setFormData({
      title: project.title,
      category: project.category,
      subcategory: project.subcategory,
      client: project.client,
      clientLabel: project.clientLabel,
      summary: project.summary,
      description: project.description || "",
      projectUrl: project.projectUrl || "https://digitalonix.in",
      status: project.status,
      mediaType: project.mediaType,
      videoDuration: project.videoDuration || "",
      aspectRatio: project.aspectRatio || "16/9",
      thumbnailUrl: project.thumbnailUrl || "",
      metrics: project.metrics || [
        { label: "ROAS / Growth", value: "+100%" },
        { label: "Conversion Rate", value: "3.5%" },
      ],
    });
    setIsFormModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast("Please enter a project title.", "error");
      return;
    }

    if (editingProjectId) {
      updateProject(editingProjectId, {
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        client: formData.client || "Client Brand",
        clientLabel: formData.clientLabel || formData.client,
        summary: formData.summary,
        description: formData.description,
        projectUrl: formData.projectUrl,
        status: formData.status,
        mediaType: formData.mediaType,
        videoDuration: formData.videoDuration,
        aspectRatio: formData.aspectRatio,
        thumbnailUrl: formData.thumbnailUrl,
        metrics: formData.metrics,
      });
      showToast(`Updated "${formData.title}"`, "success");
    } else {
      addProject({
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        client: formData.client || "Client Brand",
        clientLabel: formData.clientLabel || formData.client,
        summary: formData.summary,
        description: formData.description,
        projectUrl: formData.projectUrl,
        status: formData.status,
        mediaType: formData.mediaType,
        videoDuration: formData.videoDuration,
        aspectRatio: formData.aspectRatio,
        thumbnailUrl: formData.thumbnailUrl,
        metrics: formData.metrics,
      });
      showToast(`Created new project "${formData.title}"`, "success");
    }

    setIsFormModalOpen(false);
  };

  const handleMetricChange = (index: number, field: "label" | "value", value: string) => {
    const updated = [...formData.metrics];
    updated[index][field] = value;
    setFormData({ ...formData, metrics: updated });
  };

  const handleAddMetric = () => {
    setFormData({
      ...formData,
      metrics: [...formData.metrics, { label: "Metric Label", value: "Value" }],
    });
  };

  const handleRemoveMetric = (index: number) => {
    setFormData({
      ...formData,
      metrics: formData.metrics.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-wrap">
          <h1>Portfolio Management</h1>
          <p>Create, update, and showcase client case studies and productions.</p>
        </div>

        <div className="admin-header-actions">
          <button onClick={handleOpenAdd} className="adm-btn adm-btn-primary">
            <Plus size={16} />
            <span>Add New Project</span>
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
            placeholder="Search by title, client or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="admin-filter-pills">
          {["All", "Results", "Production", "Designing"].map((cat) => (
            <button
              key={cat}
              className={`admin-filter-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}

          <span style={{ color: "var(--adm-border)", margin: "0 0.25rem" }}>|</span>

          {["All", "published", "draft"].map((st) => (
            <button
              key={st}
              className={`admin-filter-btn ${selectedStatus === st ? "active" : ""}`}
              onClick={() => setSelectedStatus(st)}
              style={{ textTransform: "capitalize" }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project / Campaign</th>
                <th>Category</th>
                <th>Media</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--adm-text-muted)" }}>
                    No projects found matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-td-primary">{p.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>
                        Client: {p.client} • {p.subcategory}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "0.785rem",
                          fontWeight: 600,
                          color:
                            p.category === "Results"
                              ? "var(--adm-primary)"
                              : p.category === "Production"
                              ? "#C084FC"
                              : "#A78BFA",
                        }}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem" }}>
                        {p.mediaType === "video" ? <Film size={14} /> : <ImageIcon size={14} />}
                        {p.mediaType === "video" ? `Video (${p.videoDuration || "Reel"})` : "Graphics"}
                      </span>
                    </td>
                    <td>
                      <span className={`adm-status-badge ${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.78rem", color: "var(--adm-text-muted)" }}>
                        {p.updatedAt}
                      </span>
                    </td>
                    <td>
                      <div className="adm-action-btns" style={{ justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="adm-icon-btn"
                          title="Edit Project"
                          aria-label={`Edit ${p.title}`}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="adm-icon-btn danger"
                          title="Delete Project"
                          aria-label={`Delete ${p.title}`}
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

      {/* Add / Edit Project Modal */}
      <AdminModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingProjectId ? "Edit Portfolio Project" : "Add New Portfolio Project"}
        maxWidth="680px"
      >
        <form onSubmit={handleSave}>
          <div className="adm-form-grid-2">
            <div className="adm-form-group">
              <label className="adm-form-label">
                Project Title <span>*</span>
              </label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. Kinetic Brand Anthem Reel"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Client Name</label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. Fitness & Wellness Brand"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              />
            </div>
          </div>

          <div className="adm-form-grid-3">
            <div className="adm-form-group">
              <label className="adm-form-label">Category</label>
              <select
                className="adm-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
              >
                <option value="Results">Results</option>
                <option value="Production">Production</option>
                <option value="Designing">Designing</option>
              </select>
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Subcategory / Tag</label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. Reels & Short-Form"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Publishing Status</label>
              <select
                className="adm-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
              >
                <option value="published">Published</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label">Summary / Hook Description</label>
            <textarea
              className="adm-textarea"
              placeholder="Concise overview of the campaign strategy, deliverables, and outcome..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={2}
            />
          </div>

          <div className="adm-form-grid-2">
            <div className="adm-form-group">
              <label className="adm-form-label">Media Type</label>
              <select
                className="adm-select"
                value={formData.mediaType}
                onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as "image" | "video" })}
              >
                <option value="image">Image / Graphic Deck</option>
                <option value="video">Video / Reel / Commercial</option>
              </select>
            </div>

            {formData.mediaType === "video" ? (
              <div className="adm-form-group">
                <label className="adm-form-label">Video Duration (e.g. 0:30)</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="0:30"
                  value={formData.videoDuration}
                  onChange={(e) => setFormData({ ...formData, videoDuration: e.target.value })}
                />
              </div>
            ) : (
              <div className="adm-form-group">
                <label className="adm-form-label">Aspect Ratio</label>
                <select
                  className="adm-select"
                  value={formData.aspectRatio}
                  onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value as any })}
                >
                  <option value="16/9">16:9 Landscape</option>
                  <option value="9/16">9:16 Vertical Reel</option>
                  <option value="4/5">4:5 Social Banner</option>
                  <option value="1/1">1:1 Square</option>
                </select>
              </div>
            )}
          </div>

          {/* Image Uploader */}
          <AdminImageUploader
            label="Project Thumbnail & Cover Image"
            currentImageUrl={formData.thumbnailUrl}
            onImageChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
            helperText="Upload 16:9 or 9:16 promotional image/graphic"
            maxDimension={1200}
            folder="portfolio"
          />

          {/* Dynamic Metrics Row */}
          <div style={{ marginTop: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label className="adm-form-label" style={{ margin: 0 }}>
                Performance Metrics Badges (Optional)
              </label>
              <button
                type="button"
                onClick={handleAddMetric}
                className="adm-btn adm-btn-secondary adm-btn-sm"
              >
                + Add Metric
              </button>
            </div>

            {formData.metrics.map((m, idx) => (
              <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="Metric Value (e.g. +148%)"
                  value={m.value}
                  onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                  style={{ flex: 1 }}
                />
                <input
                  type="text"
                  className="adm-input"
                  placeholder="Metric Label (e.g. Lead Volume)"
                  value={m.label}
                  onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                  style={{ flex: 1.5 }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMetric(idx)}
                  className="adm-icon-btn danger"
                  title="Remove metric"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid var(--adm-border)" }}>
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="adm-btn adm-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="adm-btn adm-btn-primary">
              {editingProjectId ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <AdminDeleteConfirm
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteProject(deleteTarget.id);
            showToast(`Deleted "${deleteTarget.title}"`, "info");
          }}
          itemTitle={deleteTarget.title}
          itemType="Portfolio Project"
        />
      )}
    </div>
  );
}

