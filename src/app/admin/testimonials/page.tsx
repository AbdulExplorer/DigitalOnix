"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Quote,
  CheckCircle2,
  Film,
  Video,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useToast } from "@/context/AdminToastContext";
import { AdminTestimonial } from "@/types/admin";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminDeleteConfirm } from "@/components/admin/AdminDeleteConfirm";
import { AdminImageUploader } from "@/components/admin/AdminImageUploader";

const INITIAL_TESTIMONIAL_STATE = {
  author: "",
  role: "Marketing Director",
  company: "",
  quote: "",
  rating: 5,
  status: "published" as "published" | "pending",
  videoUrl: "",
};

export default function AdminTestimonialsPage() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useAdminData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_TESTIMONIAL_STATE);
  const [deleteTarget, setDeleteTarget] = useState<AdminTestimonial | null>(null);

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(INITIAL_TESTIMONIAL_STATE);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminTestimonial) => {
    setEditingId(item.id);
    setFormData({
      author: item.author,
      role: item.role,
      company: item.company,
      quote: item.quote,
      rating: item.rating || 5,
      status: item.status,
      videoUrl: item.videoUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.author.trim() || !formData.quote.trim()) {
      showToast("Please enter client name and testimonial text.", "error");
      return;
    }

    if (editingId) {
      updateTestimonial(editingId, {
        author: formData.author,
        role: formData.role,
        company: formData.company || `${formData.author} Brand`,
        quote: formData.quote,
        rating: formData.rating,
        status: formData.status,
        videoUrl: formData.videoUrl || undefined,
      });
      showToast(`Updated testimonial from ${formData.author}`, "success");
    } else {
      addTestimonial({
        author: formData.author,
        role: formData.role,
        company: formData.company || `${formData.author} Brand`,
        quote: formData.quote,
        rating: formData.rating,
        status: formData.status,
        videoUrl: formData.videoUrl || undefined,
      });
      showToast(`Added testimonial from ${formData.author}`, "success");
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-wrap">
          <h1>Testimonials Management</h1>
          <p>Curate authentic client feedback, ratings, and social proof.</p>
        </div>

        <div className="admin-header-actions">
          <button onClick={handleOpenAdd} className="adm-btn adm-btn-primary">
            <Plus size={16} />
            <span>Add Testimonial</span>
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
            placeholder="Search by client name, company or quote text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client / Reviewer</th>
                <th>Company &amp; Designation</th>
                <th>Rating</th>
                <th>Testimonial Quote</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--adm-text-muted)" }}>
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="admin-td-primary" style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                        <span>{t.author}</span>
                        {t.videoUrl ? (
                          <span
                            title="Video testimonial attached"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.68rem",
                              padding: "0.15rem 0.45rem",
                              borderRadius: "4px",
                              backgroundColor: "rgba(139, 61, 255, 0.15)",
                              color: "var(--adm-primary)",
                              border: "1px solid rgba(139, 61, 255, 0.25)",
                            }}
                          >
                            <Video size={11} />
                            <span>Video</span>
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.8rem", color: "var(--adm-text-secondary)" }}>{t.role}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)" }}>{t.company}</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "2px", color: "#FBBF24" }}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < t.rating ? "currentColor" : "none"}
                            color={i < t.rating ? "#FBBF24" : "var(--adm-border-light)"}
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--adm-text-secondary)",
                          lineHeight: 1.4,
                          maxWidth: "360px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        &ldquo;{t.quote}&rdquo;
                      </div>
                    </td>
                    <td>
                      <span className={`adm-status-badge ${t.status}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div className="adm-action-btns" style={{ justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="adm-icon-btn"
                          title="Edit Testimonial"
                          aria-label={`Edit ${t.author}`}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(t)}
                          className="adm-icon-btn danger"
                          title="Delete Testimonial"
                          aria-label={`Delete ${t.author}`}
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

      {/* Add / Edit Testimonial Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Client Testimonial" : "Add Client Testimonial"}
        maxWidth="560px"
      >
        <form onSubmit={handleSave}>
          <div className="adm-form-grid-2">
            <div className="adm-form-group">
              <label className="adm-form-label">
                Client Name <span>*</span>
              </label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. Retail Partner / Rajesh Singhal"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Company / Brand</label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. Apex Health Systems"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="adm-form-grid-2">
            <div className="adm-form-group">
              <label className="adm-form-label">Client Designation / Role</label>
              <input
                type="text"
                className="adm-input"
                placeholder="e.g. Managing Director / Founder"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>

            <div className="adm-form-group">
              <label className="adm-form-label">Star Rating (1 - 5)</label>
              <select
                className="adm-select"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★☆</option>
                <option value={3}>3 Stars ★★★☆☆</option>
              </select>
            </div>
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label">
              Testimonial Quote <span>*</span>
            </label>
            <textarea
              className="adm-textarea"
              placeholder="What did the client say about working with Digitalonix?"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label">Publishing Status</label>
            <select
              className="adm-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="published">Published (Visible on site)</option>
              <option value="pending">Pending (Hidden)</option>
            </select>
          </div>

          {/* Video Testimonial Upload */}
          <AdminImageUploader
            label="Client Video Testimonial (9:16 Portrait Reel)"
            currentImageUrl={formData.videoUrl}
            onImageChange={(url) => setFormData({ ...formData, videoUrl: url })}
            helperText="Upload vertical 9:16 client video review (MP4, WebM, MOV) or paste video URL. Displayed in portrait format above the quote card."
            folder="testimonials"
            allowVideo={true}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid var(--adm-border)" }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="adm-btn adm-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="adm-btn adm-btn-primary">
              {editingId ? "Save Changes" : "Create Testimonial"}
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
            deleteTestimonial(deleteTarget.id);
            showToast(`Deleted testimonial from ${deleteTarget.author}`, "info");
          }}
          itemTitle={`Testimonial from ${deleteTarget.author}`}
          itemType="Client Testimonial"
        />
      )}
    </div>
  );
}

