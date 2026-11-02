import React from "react";
import Link from "next/link";
import { founderData } from "@/data/founder";
import { Linkedin, ArrowUpRight, Compass, Sparkles } from "lucide-react";

export function Founder() {
  return (
    <section className="founder-section section-padding" aria-label="Founder and Agency Leadership">
      <div className="container">
        <div className="founder-editorial-grid">
          {/* Minimalist Graphic Frame */}
          <div className="founder-image-column reveal-on-scroll">
            <div className="founder-image-frame">
              <div className="founder-portrait-placeholder">
                <div className="founder-avatar-icon" aria-hidden="true">
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.04em" }}>DO</span>
                </div>
                <span className="founder-placeholder-label">
                  Digitalonix Studio
                </span>
              </div>

              <div className="founder-badge-overlay">
                <span>{founderData.agencyRole}</span>
              </div>
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className="founder-editorial-column reveal-on-scroll reveal-delay-1">
            <span className="founder-section-tag">
              <Sparkles size={13} />
              Agency Leadership
            </span>

            <h2 className="founder-title">{founderData.name}</h2>
            <div className="founder-role-text">{founderData.role}</div>

            <div className="founder-quote-box">
              <p className="founder-quote-text">
                &ldquo;{founderData.quote}&rdquo;
              </p>
            </div>

            <div className="founder-bio-text">
              <p>{founderData.bioParagraph}</p>
            </div>

            <div className="founder-footer-actions">
              <div className="founder-approach-card">
                <Compass size={15} style={{ display: "inline", marginRight: "6px", color: "var(--brand-purple-light)", verticalAlign: "middle" }} />
                <span>{founderData.approachStatement}</span>
              </div>

              {founderData.linkedinUrl && (
                <Link
                  href={founderData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: "0.55rem 1.1rem", fontSize: "var(--text-xs)" }}
                >
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                  <ArrowUpRight size={12} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
