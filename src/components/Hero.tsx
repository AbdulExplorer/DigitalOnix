"use client";

import React from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { ArrowRight, Film, Image as ImageIcon, Video } from "lucide-react";

export function Hero() {
  const { content } = useAdminData();
  const heroData = content?.hero;

  const headlinePrefix = heroData?.headlinePrefix || "We Make";
  const subtitle =
    heroData?.subtitle ||
    "A forward-thinking digital marketing and creative agency in Bhopal, engineering high-impact advertising, cinematic visual productions, and bespoke brand experiences.";
  const primaryCtaText = heroData?.primaryCtaText || "Start a Project";
  const secondaryCtaText = heroData?.secondaryCtaText || "Explore Work";

  return (
    <section className="hero-section" data-antigravity-visible="true" aria-label="Digitalonix Agency Hero">
      <div className="container hero-container">
        <div className="hero-grid">
          {/* =========================================================================
              LEFT COLUMN — Editorial Content & CTAs (~48% width)
             ========================================================================= */}
          <div className="hero-text-col">
            <h1 className="hero-headline">
              {headlinePrefix} brands{" "}
              <br className="hero-headline-br" />
              <span className="hero-headline-accent">stand out.</span>
            </h1>

            <p className="hero-description">{subtitle}</p>

            <div className="hero-cta-group">
              <Link href="/#quote" className="btn btn-primary hero-btn-primary">
                <span>{primaryCtaText}</span>
                <ArrowRight size={17} strokeWidth={2.2} />
              </Link>

              <Link href="/portfolio" className="btn btn-secondary hero-btn-secondary">
                <span>{secondaryCtaText}</span>
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN — Visual Media Composition (3 Overlapping Frames)
             ========================================================================= */}
          <div className="hero-media-col" aria-label="Showcase Media Stage">
            <div className="hero-media-stage">
              {/* Subtle ambient stage backlight (non-intrusive) */}
              <div className="hero-stage-ambient" aria-hidden="true" />

              {/* ---------------------------------------------------------------------
                  FRAME 02: SECONDARY LEFT FRAME (Upper-Left Overlap)
                  Default Aspect: ~4:5 portrait / editorial
                 --------------------------------------------------------------------- */}
              <div className="hero-frame hero-frame-left">
                {/* 
                  ===================================================================
                  [FRAME 02 - MEDIA INSERTION POINT]
                  To replace this placeholder with your own MEDIA, insert either:

                  Option A (HTML img):
                  <img
                    src="/your-image-path.jpg"
                    alt="Brand Campaign"
                    className="hero-media-asset"
                  />

                  Option B (Next.js Image):
                  <Image
                    src="/your-image-path.jpg"
                    alt="Brand Campaign"
                    fill
                    sizes="(max-width: 768px) 45vw, 260px"
                    className="hero-media-asset"
                  />

                  Option C (HTML5 Video):
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="hero-media-asset"
                  >
                    <source src="/your-video.mp4" type="video/mp4" />
                  </video>
                  ===================================================================
                */}
                <div className="hero-frame-placeholder">
                  <span className="hero-frame-corner top-left" aria-hidden="true">+</span>
                  <span className="hero-frame-corner top-right" aria-hidden="true">+</span>
                  <span className="hero-frame-corner bottom-left" aria-hidden="true">+</span>
                  <span className="hero-frame-corner bottom-right" aria-hidden="true">+</span>

                  <div className="hero-frame-header">
                    <span className="hero-frame-tag">02 / CAMPAIGN</span>
                    <ImageIcon size={14} className="hero-frame-icon" />
                  </div>

                  <div className="hero-frame-body">
                    <div className="hero-frame-wireframe">
                      <div className="hero-wireframe-lines" />
                    </div>
                  </div>

                  <div className="hero-frame-footer">
                    <span className="hero-frame-spec">4:5 &bull; PORTRAIT</span>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------------------------
                  FRAME 01: PRIMARY CENTRAL FRAME (Main Anchor / Showreel)
                  Default Aspect: ~16:11 landscape / editorial showreel
                 --------------------------------------------------------------------- */}
              <div className="hero-frame hero-frame-center">
                {/* 
                  ===================================================================
                  [FRAME 01 - MAIN SHOWREEL / PRODUCTION INSERTION POINT]
                  To replace this placeholder with your own MEDIA, insert either:

                  Option A (HTML img):
                  <img
                    src="/your-showreel-thumbnail.jpg"
                    alt="Digitalonix Showreel"
                    className="hero-media-asset"
                  />

                  Option B (Next.js Image):
                  <Image
                    src="/your-showreel-thumbnail.jpg"
                    alt="Digitalonix Showreel"
                    fill
                    priority
                    sizes="(max-width: 768px) 80vw, 420px"
                    className="hero-media-asset"
                  />

                  Option C (HTML5 Video - Recommended for Showreel):
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="hero-media-asset"
                  >
                    <source src="/your-showreel.mp4" type="video/mp4" />
                  </video>
                  ===================================================================
                */}
                <div className="hero-frame-placeholder hero-frame-placeholder-primary">
                  <span className="hero-frame-corner top-left" aria-hidden="true">+</span>
                  <span className="hero-frame-corner top-right" aria-hidden="true">+</span>
                  <span className="hero-frame-corner bottom-left" aria-hidden="true">+</span>
                  <span className="hero-frame-corner bottom-right" aria-hidden="true">+</span>

                  <div className="hero-frame-header">
                    <span className="hero-frame-tag hero-frame-tag-primary">
                      <span className="hero-frame-live-dot" />
                      01 / SHOWREEL
                    </span>
                    <Film size={15} className="hero-frame-icon-primary" />
                  </div>

                  <div className="hero-frame-body">
                    <div className="hero-frame-aperture">
                      <div className="hero-frame-circle" />
                      <div className="hero-frame-cross-h" />
                      <div className="hero-frame-cross-v" />
                    </div>
                    <span className="hero-frame-prompt">Cinematic Showreel</span>
                  </div>

                  <div className="hero-frame-footer">
                    <span className="hero-frame-spec">16:10 &bull; 1080P PROD</span>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------------------------
                  FRAME 03: SECONDARY RIGHT FRAME (Lower-Right Foreground Overlap)
                  Default Aspect: ~9:16 vertical motion / reel
                 --------------------------------------------------------------------- */}
              <div className="hero-frame hero-frame-right">
                {/* 
                  ===================================================================
                  [FRAME 03 - EDITORIAL / REEL INSERTION POINT]
                  To replace this placeholder with your own MEDIA, insert either:

                  Option A (HTML img):
                  <img
                    src="/your-editorial-image.jpg"
                    alt="Editorial Production"
                    className="hero-media-asset"
                  />

                  Option B (Next.js Image):
                  <Image
                    src="/your-editorial-image.jpg"
                    alt="Editorial Production"
                    fill
                    sizes="(max-width: 768px) 45vw, 240px"
                    className="hero-media-asset"
                  />

                  Option C (HTML5 Video):
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="hero-media-asset"
                  >
                    <source src="/your-vertical-reel.mp4" type="video/mp4" />
                  </video>
                  ===================================================================
                */}
                <div className="hero-frame-placeholder">
                  <span className="hero-frame-corner top-left" aria-hidden="true">+</span>
                  <span className="hero-frame-corner top-right" aria-hidden="true">+</span>
                  <span className="hero-frame-corner bottom-left" aria-hidden="true">+</span>
                  <span className="hero-frame-corner bottom-right" aria-hidden="true">+</span>

                  <div className="hero-frame-header">
                    <span className="hero-frame-tag">03 / EDITORIAL</span>
                    <Video size={14} className="hero-frame-icon" />
                  </div>

                  <div className="hero-frame-body">
                    <div className="hero-frame-wireframe">
                      <div className="hero-wireframe-badge">9:16 REEL</div>
                    </div>
                  </div>

                  <div className="hero-frame-footer">
                    <span className="hero-frame-spec">9:16 &bull; MOTION</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
