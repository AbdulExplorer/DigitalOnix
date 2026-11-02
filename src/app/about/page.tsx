import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/data/config";
import { Founder } from "@/components/Founder";
import { Sparkles, MapPin, Target, Eye, Zap, Shield, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Digitalonix, a creative and digital marketing agency based in Bhopal, Madhya Pradesh, delivering high-performance campaigns and digital builds.",
};

export default function AboutPage() {
  const agencyValues = [
    {
      title: "Craft Obsession",
      desc: "Every pixel, headline, frame of video, and line of code is held to relentless standards. We refuse to output generic agency filler.",
      icon: <Sparkles size={22} />,
    },
    {
      title: "Commercial Accountability",
      desc: "Creative work must move the commercial needle. We monitor lead acquisition costs, engagement velocity, and verified ROAS.",
      icon: <Target size={22} />,
    },
    {
      title: "Speed of Execution",
      desc: "In modern digital marketing, speed is competitive moat. We build agile workflows that test, iterate, and deploy within days, not quarters.",
      icon: <Zap size={22} />,
    },
    {
      title: "Radical Transparency",
      desc: "No confusing agency jargon or opaque retainer invoices. Real-time metric dashboards, clear deliverables, and direct team access.",
      icon: <Shield size={22} />,
    },
  ];

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container reveal-on-scroll">
          <span className="section-tag">
            <MapPin size={13} />
            Bhopal, Madhya Pradesh
          </span>
          <h1 className="page-hero-title">
            Crafting distinctive brands <br />
            <span className="text-highlight">with creative conviction.</span>
          </h1>
          <p className="page-hero-desc">
            Digitalonix was founded on a singular premise: regional and national businesses deserve world-class creative production paired with rigorous digital growth engineering.
          </p>
        </div>
      </section>

      {/* Story & Heritage Section */}
      <section className="section-padding">
        <div className="container">
          <div className="reveal-on-scroll" style={{ maxWidth: "840px", margin: "0 auto", marginBottom: "var(--space-4xl)" }}>
            <span className="section-tag">Our Origin</span>
            <h2 style={{ fontSize: "2.4rem", color: "var(--color-text)", marginBottom: "1.5rem", lineHeight: 1.25 }}>
              Bridging the gap between artistic ambition and quantifiable ROI.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", color: "var(--color-text-secondary)", fontSize: "1.05rem", lineHeight: 1.75 }}>
              <p>
                Rooted in Bhopal, Digitalonix began as a creative studio determined to redefine how brands engage modern audiences. While many traditional agencies focused purely on awards or isolated graphics, businesses were left struggling to see tangible commercial returns.
              </p>
              <p>
                We built our agency from the ground up as an integrated growth collective. By uniting talented cinematographers, copywriters, performance media buyers, and full-stack software engineers under one roof, we eliminate handoff friction and maintain uncompromising creative quality across every touchpoint.
              </p>
              <p>
                Today, our work spans high-velocity social media narratives, cinematic commercial films, performance Meta &amp; Google ad campaigns, and enterprise web solutions that empower brands to dominate their categories.
              </p>
            </div>
          </div>

          {/* Agency Core Values */}
          <div style={{ marginBottom: "var(--space-4xl)" }}>
            <div className="section-header reveal-on-scroll">
              <span className="section-tag">Our Standards</span>
              <h2 className="section-title">The Principles Guiding Every Project</h2>
              <p className="section-subtitle">
                Core commitments that govern our client partnerships, creative choices, and technical execution.
              </p>
            </div>

            <div className="values-grid">
              {agencyValues.map((val, idx) => (
                <div key={idx} className={`value-card reveal-on-scroll reveal-delay-${(idx % 2) + 1}`}>
                  <div className="value-card-icon">{val.icon}</div>
                  <h3 className="value-card-title">{val.title}</h3>
                  <p className="value-card-desc">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <Founder />

      {/* Bottom CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-banner reveal-on-scroll">
            <h2 className="cta-banner-title">Ready to build something extraordinary?</h2>
            <p className="cta-banner-desc">
              Connect with our team to discuss how Digitalonix can elevate your brand perception and digital performance.
            </p>
            <Link href="/#quote" className="btn btn-primary">
              <span>Schedule a Discussion</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

