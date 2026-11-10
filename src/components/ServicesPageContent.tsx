"use client";

import React from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { serviceCategories } from "@/data/services";
import {
  Megaphone,
  Share2,
  Target,
  PenTool,
  Video,
  Newspaper,
  Bot,
  Globe,
  Code2,
  MapPin,
  Users,
  Search,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function ServicesPageContent() {
  const { services } = useAdminData();
  const activeServices = services.filter((s) => s.status === "active");

  const renderIcon = (name: string) => {
    switch (name) {
      case "Megaphone":
        return <Megaphone size={24} />;
      case "Share2":
        return <Share2 size={24} />;
      case "Target":
        return <Target size={24} />;
      case "PenTool":
        return <PenTool size={24} />;
      case "Video":
        return <Video size={24} />;
      case "Newspaper":
        return <Newspaper size={24} />;
      case "Bot":
        return <Bot size={24} />;
      case "Globe":
        return <Globe size={24} />;
      case "Code2":
        return <Code2 size={24} />;
      case "MapPin":
        return <MapPin size={24} />;
      case "Users":
        return <Users size={24} />;
      case "Search":
        return <Search size={24} />;
      default:
        return <Globe size={24} />;
    }
  };

  const executionSteps = [
    {
      step: "01",
      title: "Commercial Diagnostic",
      desc: "Deep analysis of your current market share, acquisition unit economics, competitor messaging, and growth bottlenecks.",
    },
    {
      step: "02",
      title: "Creative Engineering",
      desc: "Developing high-retention visual hooks, copywriting frameworks, video scripts, and custom digital conversion assets.",
    },
    {
      step: "03",
      title: "Surgical Deployment",
      desc: "Systematic campaign rollout across Meta, Google, local search, and custom digital web platforms with granular pixel tracking.",
    },
    {
      step: "04",
      title: "Iterative Optimization",
      desc: "Rapid creative testing, budget reallocation toward top-performing segments, and weekly data-driven performance updates.",
    },
  ];

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container reveal-on-scroll">
          <span className="section-tag">
            <Sparkles size={13} />
            Agency Capabilities
          </span>
          <h1 className="page-hero-title">
            Purpose-built services for <br />
            <span className="text-highlight">exponential business scale.</span>
          </h1>
          <p className="page-hero-desc">
            We don&apos;t offer generic bundles. We engineer disciplined growth engines tailored to your specific commercial objectives.
          </p>
          <Link href="/#quote" className="btn btn-primary">
            <span>Inquire About Scope</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Categories Detailed Sections */}
      <section className="section-padding services-section-wrapper">
        <div className="container">
          {serviceCategories.map((catName) => {
            const catServices = activeServices.filter((s) => s.category === catName);
            if (catServices.length === 0) return null;

            return (
              <div key={catName} className="services-category-block">
                <div className="reveal-on-scroll services-category-header">
                  <span className="section-tag">{catName}</span>
                  <h2 className="services-category-title">
                    {catName === "Marketing & Growth" && "Accelerate Market Reach & Revenue Funnels"}
                    {catName === "Creative Production" && "High-Retention Visual Storytelling & PR"}
                    {catName === "Technology" && "Modern Web, Software & AI Automation"}
                    {catName === "Local Visibility" && "Dominance in Regional Search & Google Maps"}
                  </h2>
                </div>

                <div className="services-grid">
                  {catServices.map((service, idx) => (
                    <article
                      key={service.id}
                      className={`service-card reveal-on-scroll reveal-delay-${(idx % 3) + 1}`}
                    >
                      <div className="service-card-top">
                        <div className="service-icon-wrap" aria-hidden="true">
                          {renderIcon(service.iconName)}
                        </div>
                        <span className="service-category-pill">{service.category}</span>
                      </div>

                      <h3 className="service-title">{service.title}</h3>
                      <p className="service-description">{service.detailedDescription || service.shortDescription}</p>

                      {service.deliverables && service.deliverables.length > 0 && (
                        <div style={{ marginBottom: "1rem" }}>
                          <strong style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text)", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }}>
                            Core Deliverables:
                          </strong>
                          <ul className="service-features-list" style={{ borderTop: "none", paddingTop: 0 }}>
                            {service.deliverables.map((deliv, dIdx) => (
                              <li key={dIdx} className="service-feature-item">
                                <Check className="service-feature-check" />
                                <span>{deliv}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="service-card-footer">
                        <Link
                          href={`/#quote?service=${encodeURIComponent(service.title)}`}
                          className="btn btn-secondary"
                          style={{ width: "100%", padding: "0.6rem 1rem", fontSize: "var(--text-xs)" }}
                        >
                          <span>Get Quote for {service.title}</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}

          {/* 4-Phase Agency Workflow */}
          <div style={{ marginTop: "var(--space-4xl)" }}>
            <div className="section-header reveal-on-scroll">
              <span className="section-tag">Methodology</span>
              <h2 className="section-title">The Digitalonix Execution Blueprint</h2>
              <p className="section-subtitle">
                A predictable four-phase framework designed to eliminate guesswork and maximize return on creative investment.
              </p>
            </div>

            <div className="process-grid">
              {executionSteps.map((step, idx) => (
                <div
                  key={step.step}
                  className={`process-step-card reveal-on-scroll reveal-delay-${(idx % 4) + 1}`}
                >
                  <div className="process-step-number">{step.step}</div>
                  <h3 className="process-step-title">{step.title}</h3>
                  <p className="process-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="cta-banner reveal-on-scroll">
            <h2 className="cta-banner-title">Need a custom enterprise solution?</h2>
            <p className="cta-banner-desc">
              Schedule a direct consultation with our senior strategy team to map out an omnichannel campaign tailored to your industry.
            </p>
            <Link href="/#quote" className="btn btn-primary">
              <span>Start Your Scope Discussion</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

