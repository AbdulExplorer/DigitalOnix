"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AntigravityField } from "@/components/AntigravityField";

const DYNAMIC_STATEMENTS = [
  { prefix: "brands ", highlight: "stand out." },
  { prefix: "creativity ", highlight: "work." },
  { prefix: "brands ", highlight: "grow." },
];

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return;
    }

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % DYNAMIC_STATEMENTS.length);
        setIsTransitioning(false);
      }, 350);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  const currentStatement = DYNAMIC_STATEMENTS[currentIndex];

  return (
    <section ref={heroRef} className="hero-section" aria-label="Digitalonix Agency Hero">
      <div className="hero-glow-blob" aria-hidden="true" />
      <AntigravityField containerRef={heroRef} />

      <div className="container hero-content">
        {/* Minimal Pill Badge */}
        {/* <div className="hero-pill">
          <span className="hero-pill-dot" aria-hidden="true" />
          <span>Creative &amp; Digital Marketing Agency</span>
        </div> */}

        {/* Stable Headline Container with Dynamic Second Line */}
        <div className="hero-headline-wrapper">
          <h1 className="hero-headline">
            <span className="hero-static-prefix">We Make</span>
            <span className="hero-dynamic-slot">
              <span
                key={currentIndex}
                className={`hero-dynamic-phrase ${
                  isTransitioning ? "headline-exiting" : "headline-active"
                }`}
              >
                <span>{currentStatement.prefix}</span>
                <span className="hero-headline-accent">{currentStatement.highlight}</span>
              </span>
            </span>
          </h1>

          <noscript>
            <h1 className="hero-headline noscript-headline">
              <span className="hero-static-prefix">We Make</span>
              <span className="hero-dynamic-slot">
                <span>brands </span>
                <span className="hero-headline-accent">stand out &amp; grow.</span>
              </span>
            </h1>
          </noscript>
        </div>

        {/* Clean, Concise Supporting Copy */}
        <p className="hero-description">
          Digitalonix helps businesses grow through creative marketing, digital strategy, and technology.
        </p>

        {/* Primary & Secondary CTAs */}
        <div className="hero-cta-group">
          <Link href="/#quote" className="btn btn-primary">
            <span>Get a Quote</span>
            <ArrowRight size={17} />
          </Link>

          <Link href="/portfolio" className="btn btn-secondary">
            <span>Explore Our Work</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
