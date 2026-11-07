"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles } from "lucide-react";

export function Testimonials() {
  const { testimonials } = useAdminData();
  const publishedTestimonials = testimonials.filter((t) => t.status === "published");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const touchStartXRef = useRef<number | null>(null);

  // Responsive visible cards count
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 680) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1080) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const totalItems = publishedTestimonials.length;
  const maxIndex = Math.max(0, totalItems - visibleCount);

  // Ensure currentIndex stays within bounds if visibleCount changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 50 && currentIndex < maxIndex) {
      handleNext();
    } else if (diff < -50 && currentIndex > 0) {
      handlePrev();
    }

    touchStartXRef.current = null;
  };

  // If no published testimonials exist
  if (publishedTestimonials.length === 0) {
    return null;
  }

  // Calculate slide percentage based on visible cards
  // card width + gap (1.5rem = 24px)
  const cardWidthPercent = 100 / visibleCount;
  const transformPercent = currentIndex * cardWidthPercent;

  return (
    <section
      id="testimonials"
      className="testimonials-section section-padding"
      data-antigravity-visible="true"
      aria-label="Client Testimonials and Reviews"
    >
      <div className="container">
        {/* Header with Title and Carousel Controls */}
        <div className="testimonials-header-row reveal-on-scroll">
          <div className="testimonials-header-left">
            <span className="section-tag">
              <Sparkles size={13} />
              Partner Feedback
            </span>
            <h2 className="section-title" style={{ marginTop: "0.35rem" }}>
              Trusted by founders, directors &amp; brand leaders.
            </h2>
            <p className="section-subtitle">
              Authentic feedback from partners who transformed their brand presence with Digitalonix.
            </p>
          </div>

          {/* Controls Bar */}
          {totalItems > visibleCount && (
            <div className="testimonials-controls" aria-label="Testimonial Navigation">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="testimonials-nav-btn"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="testimonials-nav-btn"
                aria-label="Next Testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Viewport & Slider Track (Each review rendered ONCE) */}
        <div
          className="testimonials-viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`testimonials-slider-track ${totalItems <= visibleCount ? "track-centered" : ""}`}
            style={{
              transform: totalItems > visibleCount ? `translateX(-${transformPercent}%)` : "none",
            }}
          >
            {publishedTestimonials.map((item) => (
              <article
                key={item.id}
                className="modern-testimonial-card"
                role="article"
                aria-label={`Review by ${item.author}`}
              >
                {/* Topbar: Stars + Quote Emblem */}
                <div className="testimonial-card-topbar">
                  <div className="testimonial-stars-group" aria-label={`${item.rating || 5} out of 5 stars`}>
                    {Array.from({ length: item.rating || 5 }).map((_, rIdx) => (
                      <Star key={rIdx} size={15} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                  <Quote size={24} className="testimonial-quote-icon" aria-hidden="true" />
                </div>

                {/* Quote Text */}
                <blockquote className="testimonial-body-quote">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                {/* Author Meta */}
                <div className="testimonial-author-wrapper">
                  <div className="testimonial-avatar-bubble" aria-hidden="true">
                    {(item.author || "A").charAt(0).toUpperCase()}
                  </div>
                  <div className="testimonial-info-block">
                    <span className="testimonial-author-fullname">{item.author}</span>
                    <span className="testimonial-author-position">
                      {item.role || "Client"}
                      {item.company ? ` • ${item.company}` : ""}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {totalItems > visibleCount && (
          <div className="testimonials-dots-nav" aria-hidden="true">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                className={`testimonials-dot ${currentIndex === dotIdx ? "is-active" : ""}`}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
