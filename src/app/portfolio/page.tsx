import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Portfolio } from "@/components/Portfolio";
import { Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies",
  description:
    "Explore Digitalonix's client work across performance campaign results, cinematic video production, and bespoke design systems.",
};

export default function PortfolioPage() {
  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="section-tag">
            <Sparkles size={13} />
            Our Work
          </span>
          <h1 className="page-hero-title">
            Proven execution across <br />
            <span className="text-highlight">campaigns, film &amp; design.</span>
          </h1>
          <p className="page-hero-desc">
            Explore our multidisciplinary portfolio divided into quantifiable campaign results, high-impact video productions, and curated brand design systems.
          </p>
        </div>
      </section>

      {/* Main Interactive Portfolio Component */}
      <Portfolio />

      {/* Bottom CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-banner">
            <h2 className="cta-banner-title">Have a specific creative vision in mind?</h2>
            <p className="cta-banner-desc">
              Whether you need high-retention social content or a complete brand overhaul, we engineer custom solutions designed for your market.
            </p>
            <Link href="/#quote" className="btn btn-primary">
              <span>Start Your Project Quote</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

