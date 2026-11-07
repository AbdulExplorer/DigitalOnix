"use client";

import React, { useState } from "react";
import {
  Save,
  RotateCcw,
  Sparkles,
  Home,
  BarChart3,
  PhoneCall,
  Megaphone,
  CheckCircle2,
} from "lucide-react";
import { useAdminData } from "@/context/AdminDataContext";
import { useToast } from "@/context/AdminToastContext";
import { AdminSiteContent } from "@/types/admin";

export default function AdminContentPage() {
  const { content, updateContent } = useAdminData();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"hero" | "stats" | "cta" | "contact">("hero");
  const [formData, setFormData] = useState<AdminSiteContent>(content);
  const [isSaving, setIsSaving] = useState(false);

  const handleHeroChange = (field: keyof AdminSiteContent["hero"], value: any) => {
    setFormData({
      ...formData,
      hero: { ...formData.hero, [field]: value },
    });
  };

  const handleDynamicLineChange = (index: number, value: string) => {
    const updated = [...formData.hero.dynamicLines];
    updated[index] = value;
    setFormData({
      ...formData,
      hero: { ...formData.hero, dynamicLines: updated },
    });
  };

  const handleAddDynamicLine = () => {
    setFormData({
      ...formData,
      hero: {
        ...formData.hero,
        dynamicLines: [...formData.hero.dynamicLines, "new milestone."],
      },
    });
  };

  const handleRemoveDynamicLine = (index: number) => {
    setFormData({
      ...formData,
      hero: {
        ...formData.hero,
        dynamicLines: formData.hero.dynamicLines.filter((_, i) => i !== index),
      },
    });
  };

  const handleStatsChange = (field: keyof AdminSiteContent["stats"], value: string) => {
    setFormData({
      ...formData,
      stats: { ...formData.stats, [field]: value },
    });
  };

  const handleCtaChange = (field: keyof AdminSiteContent["cta"], value: string) => {
    setFormData({
      ...formData,
      cta: { ...formData.cta, [field]: value },
    });
  };

  const handleContactChange = (field: keyof AdminSiteContent["contact"], value: string) => {
    setFormData({
      ...formData,
      contact: { ...formData.contact, [field]: value },
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateContent(formData);
      setIsSaving(false);
      showToast("Website content updated successfully!", "success");
    }, 250);
  };

  const handleReset = () => {
    setFormData(content);
    showToast("Reverted changes to current values", "info");
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title-wrap">
          <h1>Website Content Management</h1>
          <p>Update homepage copy, rotating headlines, agency statistics, and contact details.</p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            onClick={handleReset}
            className="adm-btn adm-btn-secondary"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="adm-btn adm-btn-primary"
            disabled={isSaving}
          >
            <Save size={15} />
            <span>{isSaving ? "Saving..." : "Save All Changes"}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="adm-tabs-nav">
        <button
          type="button"
          className={`adm-tab-item ${activeTab === "hero" ? "active" : ""}`}
          onClick={() => setActiveTab("hero")}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Home size={15} />
            <span>Hero &amp; Headlines</span>
          </span>
        </button>
        <button
          type="button"
          className={`adm-tab-item ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <BarChart3 size={15} />
            <span>Agency Statistics</span>
          </span>
        </button>
        <button
          type="button"
          className={`adm-tab-item ${activeTab === "cta" ? "active" : ""}`}
          onClick={() => setActiveTab("cta")}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Megaphone size={15} />
            <span>Call to Action Banner</span>
          </span>
        </button>
        <button
          type="button"
          className={`adm-tab-item ${activeTab === "contact" ? "active" : ""}`}
          onClick={() => setActiveTab("contact")}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <PhoneCall size={15} />
            <span>Agency Contact Details</span>
          </span>
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* TAB 1: HERO & HEADLINES */}
        {activeTab === "hero" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Hero Section &amp; Headlines</h2>
                <span className="admin-card-subtitle">
                  Configure the primary homepage value proposition and rotating kinetic lines
                </span>
              </div>
            </div>

            <div className="admin-card-body">
              <div className="adm-form-grid-2">
                <div className="adm-form-group">
                  <label className="adm-form-label">First Line Fixed Heading</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={formData.hero.headlinePrefix}
                    onChange={(e) => handleHeroChange("headlinePrefix", e.target.value)}
                  />
                  <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)" }}>
                    Appears directly on the first line (e.g. &ldquo;We Make&rdquo;)
                  </span>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Primary CTA Button Text</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={formData.hero.primaryCtaText}
                    onChange={(e) => handleHeroChange("primaryCtaText", e.target.value)}
                  />
                </div>
              </div>

              {/* Dynamic Rotating Lines List */}
              <div className="adm-form-group" style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label className="adm-form-label" style={{ margin: 0 }}>
                    Second Line Rotating Dynamic Statements
                  </label>
                  <button
                    type="button"
                    onClick={handleAddDynamicLine}
                    className="adm-btn adm-btn-secondary adm-btn-sm"
                  >
                    + Add Rotating Line
                  </button>
                </div>

                {formData.hero.dynamicLines.map((line, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.45rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--adm-text-muted)", width: "24px" }}>
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      className="adm-input"
                      value={line}
                      onChange={(e) => handleDynamicLineChange(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDynamicLine(idx)}
                      className="adm-icon-btn danger"
                      title="Remove statement"
                      disabled={formData.hero.dynamicLines.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="adm-form-group" style={{ marginTop: "1rem" }}>
                <label className="adm-form-label">Hero Subtitle / Description</label>
                <textarea
                  className="adm-textarea"
                  value={formData.hero.subtitle}
                  onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Secondary CTA Button Text</label>
                <input
                  type="text"
                  className="adm-input"
                  value={formData.hero.secondaryCtaText}
                  onChange={(e) => handleHeroChange("secondaryCtaText", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AGENCY STATISTICS */}
        {activeTab === "stats" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Homepage Agency Statistics</h2>
                <span className="admin-card-subtitle">
                  Configure the 3 key metric cards shown on your live website
                </span>
              </div>
            </div>

            <div className="admin-card-body">
              <div className="adm-form-grid-3">
                <div className="adm-form-group">
                  <label className="adm-form-label">Projects Delivered</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={formData.stats.projectsDelivered || "1000+"}
                    placeholder="e.g. 1000+"
                    onChange={(e) => handleStatsChange("projectsDelivered", e.target.value)}
                  />
                  <span className="adm-form-helper">Featured as the top statistics card</span>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Clients Served</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={formData.stats.clientsServed || "250+"}
                    placeholder="e.g. 250+"
                    onChange={(e) => handleStatsChange("clientsServed", e.target.value)}
                  />
                  <span className="adm-form-helper">Featured as the middle statistics card</span>
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Meta Ad Spend</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={formData.stats.metaAdSpend || "₹10Lakh+"}
                    placeholder="e.g. ₹10Lakh+"
                    onChange={(e) => handleStatsChange("metaAdSpend", e.target.value)}
                  />
                  <span className="adm-form-helper">Featured as the bottom statistics card</span>
                </div>
              </div>

              {/* Minimal Preview of the 3 Cards */}
              <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--adm-border)" }}>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--adm-text-muted)", fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>
                  Live Preview on Website
                </span>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                  <div style={{ padding: "1rem 1.25rem", background: "var(--adm-card-elevated)", border: "1px solid var(--adm-border)", borderRadius: "var(--adm-radius-md)" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF" }}>
                      {formData.stats.projectsDelivered || "1000+"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--adm-text-secondary)", marginTop: "2px" }}>
                      Projects Delivered
                    </div>
                  </div>

                  <div style={{ padding: "1rem 1.25rem", background: "var(--adm-card-elevated)", border: "1px solid var(--adm-border)", borderRadius: "var(--adm-radius-md)" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF" }}>
                      {formData.stats.clientsServed || "250+"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--adm-text-secondary)", marginTop: "2px" }}>
                      Clients Served
                    </div>
                  </div>

                  <div style={{ padding: "1rem 1.25rem", background: "var(--adm-card-elevated)", border: "1px solid var(--adm-border)", borderRadius: "var(--adm-radius-md)" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF" }}>
                      {formData.stats.metaAdSpend || "₹10Lakh+"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--adm-text-secondary)", marginTop: "2px" }}>
                      Meta Ad Spend
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CTA BANNER */}
        {activeTab === "cta" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Call to Action (CTA) Banner</h2>
                <span className="admin-card-subtitle">
                  Closing conversion ribbon located before the footer
                </span>
              </div>
            </div>

            <div className="admin-card-body">
              <div className="adm-form-group">
                <label className="adm-form-label">Main Heading</label>
                <input
                  type="text"
                  className="adm-input"
                  value={formData.cta.heading}
                  onChange={(e) => handleCtaChange("heading", e.target.value)}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Supporting Subtitle</label>
                <textarea
                  className="adm-textarea"
                  value={formData.cta.subtitle}
                  onChange={(e) => handleCtaChange("subtitle", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-form-label">Action Button Label</label>
                <input
                  type="text"
                  className="adm-input"
                  value={formData.cta.buttonText}
                  onChange={(e) => handleCtaChange("buttonText", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT & SOCIAL DETAILS */}
        {activeTab === "contact" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h2 className="admin-card-title">Agency Contact &amp; Social Links</h2>
                <span className="admin-card-subtitle">
                  Displayed on the contact section, footer, and inquiry response meta
                </span>
              </div>
            </div>

            <div className="admin-card-body">
              <div className="adm-form-grid-2">
                <div className="adm-form-group">
                  <label className="adm-form-label">Official Contact Email</label>
                  <input
                    type="email"
                    className="adm-input"
                    value={formData.contact.email}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Official Phone Number</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={formData.contact.phone}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="adm-form-grid-3">
                <div className="adm-form-group">
                  <label className="adm-form-label">Office Address / Sector</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={formData.contact.address}
                    onChange={(e) => handleContactChange("address", e.target.value)}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">City</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={formData.contact.city}
                    onChange={(e) => handleContactChange("city", e.target.value)}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">State / Country</label>
                  <input
                    type="text"
                    className="adm-input"
                    value={`${formData.contact.state}, ${formData.contact.country}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(",");
                      handleContactChange("state", parts[0]?.trim() || "");
                      if (parts[1]) handleContactChange("country", parts[1].trim());
                    }}
                  />
                </div>
              </div>

              <div className="adm-form-grid-2">
                <div className="adm-form-group">
                  <label className="adm-form-label">Instagram Profile URL</label>
                  <input
                    type="url"
                    className="adm-input"
                    value={formData.contact.instagramUrl}
                    onChange={(e) => handleContactChange("instagramUrl", e.target.value)}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">LinkedIn Company URL</label>
                  <input
                    type="url"
                    className="adm-input"
                    value={formData.contact.linkedinUrl}
                    onChange={(e) => handleContactChange("linkedinUrl", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <button
            type="button"
            onClick={handleReset}
            className="adm-btn adm-btn-secondary"
          >
            Reset
          </button>
          <button
            type="submit"
            className="adm-btn adm-btn-primary"
            disabled={isSaving}
          >
            <Save size={15} />
            <span>{isSaving ? "Saving..." : "Save All Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

