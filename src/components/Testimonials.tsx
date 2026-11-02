"use client";

import React, { useState, useRef, useEffect } from "react";
import { testimonialsData } from "@/data/testimonials";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Testimonials() {
  const [isPaused, setIsPaused] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  // 4 duplicate sets guarantee continuous seamless loop coverage across all screen widths up to 4K
  const loopItems = [
    ...testimonialsData,
    ...testimonialsData,
    ...testimonialsData,
    ...testimonialsData,
  ];

  const handlePrev = () => {
    setManualOffset((prev) => {
      const next = prev + 380;
      return next > 1200 ? 0 : next;
    });
  };

  const handleNext = () => {
    setManualOffset((prev) => {
      const next = prev - 380;
      return next < -1200 ? 0 : next;
    });
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }

    touchStartXRef.current = null;
  };

  return (
    <section
      className="testimonials-section section-padding"
      aria-label="Client Testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div className="testimonials-header reveal-on-scroll">
          <div>
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title">What partners say.</h2>
          </div>

          <div className="carousel-controls-bar">
            <button
              className="carousel-nav-btn"
              onClick={handlePrev}
              aria-label="Scroll testimonials backward"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="carousel-nav-btn"
              onClick={handleNext}
              aria-label="Scroll testimonials forward"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Moving Loop Marquee */}
      <div
        className="testimonials-loop-container reveal-on-scroll reveal-delay-1"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="testimonials-nudge-wrapper"
          style={{
            transform: `translate3d(${manualOffset}px, 0, 0)`,
          }}
        >
          <div className={`testimonials-loop-track ${isPaused ? "is-paused" : ""}`}>
            {loopItems.map((item, idx) => (
              <article key={`${item.id}-${idx}`} className="testimonial-card">
                <p className="testimonial-quote">&ldquo;{item.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <span className="testimonial-author-name">{item.author}</span>
                  <span className="testimonial-author-role">{item.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
