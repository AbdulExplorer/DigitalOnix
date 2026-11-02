"use client";

import React, { useState, useEffect } from "react";
import { portfolioItems, portfolioCategories, PortfolioCategory, PortfolioItem } from "@/data/portfolio";
import { Play, TrendingUp, Sparkles, X, BarChart3, Video, Palette } from "lucide-react";

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("Results");
  const [selectedModalItem, setSelectedModalItem] = useState<PortfolioItem | null>(null);

  const displayedItems = portfolioItems.filter(
    (item) => item.category === activeCategory
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedModalItem(null);
      }
    };
    if (selectedModalItem) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedModalItem]);

  return (
    <section id="portfolio" className="portfolio-section section-padding" aria-label="Our Portfolio">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">Featured Work</span>
          <h2 className="section-title">
            Case studies, creative productions &amp; design.
          </h2>
          <p className="section-subtitle">
            Explore our campaigns, video productions, and brand design systems.
          </p>
        </div>

        {/* Portfolio Tabs Navigation */}
        <div className="portfolio-tabs-nav reveal-on-scroll reveal-delay-1" role="tablist" aria-label="Portfolio category filter">
          {portfolioCategories.map((category) => (
            <button
              key={category}
              className={`portfolio-tab-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
              role="tab"
              aria-selected={activeCategory === category}
            >
              {category === "Results" && (
                <BarChart3 size={15} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
              )}
              {category === "Production" && (
                <Video size={15} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
              )}
              {category === "Designing" && (
                <Palette size={15} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
              )}
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="portfolio-grid">
          {displayedItems.map((item, idx) => (
            <article
              key={item.id}
              className={`portfolio-card reveal-on-scroll reveal-delay-${(idx % 3) + 1}`}
              onClick={() => setSelectedModalItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedModalItem(item);
                }
              }}
              aria-label={`View details for ${item.title}`}
            >
              {/* Visual Container */}
              <div className={`portfolio-visual-container aspect-${item.aspectRatio.replace("/", "-")}`}>
                <div className="portfolio-placeholder-graphic">
                  {item.mediaType === "video" ? (
                    <div className="portfolio-play-overlay">
                      <Play size={22} fill="currentColor" />
                    </div>
                  ) : item.category === "Results" ? (
                    <div className="portfolio-play-overlay" style={{ background: "rgba(120, 29, 181, 0.25)", border: "1px solid var(--brand-purple-light)" }}>
                      <TrendingUp size={24} style={{ color: "var(--brand-purple-light)" }} />
                    </div>
                  ) : (
                    <div className="portfolio-play-overlay" style={{ background: "rgba(120, 29, 181, 0.25)", border: "1px solid var(--brand-purple-light)" }}>
                      <Sparkles size={24} style={{ color: "var(--brand-purple-light)" }} />
                    </div>
                  )}

                  {item.videoDuration && (
                    <span className="video-badge">{item.videoDuration}</span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="portfolio-card-body">
                <div className="portfolio-meta-header">
                  <span className="portfolio-client-tag">{item.clientLabel}</span>
                  <span className="portfolio-type-pill">{item.subcategory}</span>
                </div>

                <h3 className="portfolio-item-title">{item.title}</h3>
                <p className="portfolio-item-summary">{item.summary}</p>

                {item.metrics && item.metrics.length > 0 && (
                  <div className="portfolio-metrics-row">
                    {item.metrics.map((metric, idx) => (
                      <div key={idx} className="portfolio-metric-box">
                        <div className="portfolio-metric-value">{metric.value}</div>
                        <div className="portfolio-metric-label">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedModalItem && (
        <div
          className="portfolio-modal-backdrop"
          onClick={() => setSelectedModalItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedModalItem.title}
        >
          <div
            className="portfolio-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="portfolio-modal-close"
              onClick={() => setSelectedModalItem(null)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <span className="section-tag" style={{ marginBottom: "0.75rem" }}>
              {selectedModalItem.category} • {selectedModalItem.subcategory}
            </span>

            <h3 style={{ fontSize: "1.75rem", color: "#FFFFFF", marginBottom: "0.5rem" }}>
              {selectedModalItem.title}
            </h3>

            <p style={{ color: "var(--brand-purple-light)", fontWeight: 600, fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              {selectedModalItem.clientLabel}
            </p>

            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              {selectedModalItem.summary}
            </p>

            {selectedModalItem.objective && (
              <div style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#FFFFFF", display: "block", fontSize: "0.9rem", marginBottom: "4px" }}>
                  Objective:
                </strong>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  {selectedModalItem.objective}
                </p>
              </div>
            )}

            {selectedModalItem.strategy && (
              <div style={{ marginBottom: "1.5rem" }}>
                <strong style={{ color: "#FFFFFF", display: "block", fontSize: "0.9rem", marginBottom: "4px" }}>
                  Strategy:
                </strong>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  {selectedModalItem.strategy}
                </p>
              </div>
            )}

            {selectedModalItem.metrics && (
              <div className="portfolio-metrics-row" style={{ marginBottom: "1.5rem" }}>
                {selectedModalItem.metrics.map((m, idx) => (
                  <div key={idx} className="portfolio-metric-box">
                    <div className="portfolio-metric-value">{m.value}</div>
                    <div className="portfolio-metric-label">{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary"
                onClick={() => setSelectedModalItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
