"use client";

import React, { useState } from "react";
import { servicesData } from "@/data/services";
import { siteConfig } from "@/data/config";
import { Send, CheckCircle2, AlertCircle, MapPin, Mail, Phone } from "lucide-react";

interface FormState {
  name: string;
  contact: string;
  service: string;
  description: string;
  honeypot: string;
}

interface FormErrors {
  name?: string;
  contact?: string;
  service?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    contact: "",
    service: "",
    description: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Please enter your name.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+0-9\s-]{8,20}$/;

    if (
      !formData.contact.trim() ||
      (!emailPattern.test(formData.contact.trim()) &&
        !phonePattern.test(formData.contact.trim()))
    ) {
      newErrors.contact = "Please provide an email or phone number.";
    }

    if (!formData.service) {
      newErrors.service = "Please select a service.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit quote inquiry.");
      }

      setSuccessMessage(result.message);
      setFormData({
        name: "",
        contact: "",
        service: "",
        description: "",
        honeypot: "",
      });
      setErrors({});
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="quote" className="quote-section section-padding" aria-label="Get a Project Quote">
      <div className="container">
        <div className="quote-layout-grid">
          {/* Info Column */}
          <div className="quote-info-column">
            <span className="section-tag">Contact</span>
            <h2 className="section-title">
              Let&apos;s build something exceptional.
            </h2>
            <p className="quote-subheading">
              Have a campaign, video project, or website build in mind? Send us a message and we will get back to you within 24 hours.
            </p>

            <div className="quote-contact-card">
              <div className="quote-contact-detail">
                <MapPin size={16} style={{ color: "var(--brand-purple-light)" }} />
                <span>{siteConfig.locationDisplay}</span>
              </div>
              <div className="quote-contact-detail">
                <Mail size={16} style={{ color: "var(--brand-purple-light)" }} />
                <span>{siteConfig.contactEmail}</span>
              </div>
              <div className="quote-contact-detail">
                <Phone size={16} style={{ color: "var(--brand-purple-light)" }} />
                <span>{siteConfig.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Clean Form Card */}
          <div className="quote-form-card">
            <div className="quote-form-header">
              <h3 className="quote-form-title">Get a Quote</h3>
              <p className="quote-form-desc">
                Tell us about your project requirements.
              </p>
            </div>

            {successMessage && (
              <div className="form-status-banner banner-success" role="alert" style={{ marginBottom: "var(--space-lg)" }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="form-status-banner banner-error" role="alert" style={{ marginBottom: "var(--space-lg)" }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form className="quote-form" onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                className="honeypot-field"
                aria-hidden="true"
              />

              <div className="form-group">
                <label htmlFor="quote-name" className="form-label">
                  Your Name
                </label>
                <input
                  id="quote-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="form-input"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <span className="form-error-text">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="quote-contact" className="form-label">
                  Email or Phone
                </label>
                <input
                  id="quote-contact"
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter email or phone number"
                  className="form-input"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.contact}
                />
                {errors.contact && (
                  <span className="form-error-text">{errors.contact}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="quote-service" className="form-label">
                  Service Needed
                </label>
                <select
                  id="quote-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="form-select"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.service}
                >
                  <option value="" disabled>Select a capability</option>
                  {servicesData.map((svc) => (
                    <option key={svc.id} value={svc.title}>
                      {svc.title}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <span className="form-error-text">{errors.service}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="quote-description" className="form-label">
                  Project Notes (Optional)
                </label>
                <textarea
                  id="quote-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe your objectives or timeline..."
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary quote-submit-btn"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <Send size={15} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
