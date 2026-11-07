"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles, Play } from "lucide-react";

export function Testimonials() {
  const { testimonials } = useAdminData();
  const publishedTestimonials = testimonials.filter((t) => t.status === "published");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Responsive visible cards count
  useEffect(() => {
    const updateVisibleCount = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
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
  const maxIndex = isMobile ? Math.max(0, totalItems - 1) : Math.max(0, totalItems - visibleCount);

  // Auto-advance carousel on mobile with delay
  useEffect(() => {
    if (!isMobile || totalItems <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= totalItems ? 0 : prev + 1));
    }, 4500); // 4.5s delay between slides

    return () => clearInterval(interval);
  }, [isMobile, totalItems, isPaused]);

  // Ensure currentIndex stays within bounds if visibleCount changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    if (isMobile) {
      setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (isMobile) {
      setCurrentIndex((prev) => (prev + 1 >= totalItems ? 0 : prev + 1));
    } else {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartXRef.current - touchEndX;

      if (diff > 40) {
        handleNext();
      } else if (diff < -40) {
        handlePrev();
      }
      touchStartXRef.current = null;
    }

    // Resume auto-cycling after user stops swiping
    setTimeout(() => {
      setIsPaused(false);
    }, 4000);
  };

  // If no published testimonials exist
  if (publishedTestimonials.length === 0) {
    return null;
  }

  // Calculate slide percentage based on visible cards
  const cardWidthPercent = isMobile ? 100 : 100 / visibleCount;
  const transformPercent = currentIndex * cardWidthPercent;

  return (
    <section
      id="testimonials"
      className="testimonials-section section-padding"
      data-antigravity-visible="true"
      aria-label="Client Testimonials and Reviews"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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
                disabled={!isMobile && currentIndex === 0}
                className="testimonials-nav-btn"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                disabled={!isMobile && currentIndex >= maxIndex}
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
            className={`testimonials-slider-track ${totalItems <= visibleCount && !isMobile ? "track-centered" : ""}`}
            style={{
              transform: totalItems > (isMobile ? 1 : visibleCount) ? `translateX(-${transformPercent}%)` : "none",
            }}
          >
            {publishedTestimonials.map((item) => (
              <article
                key={item.id}
                className="modern-testimonial-card"
                role="article"
                aria-label={`Review by ${item.author}`}
              >
                {/* Optional Video Area Above Card Content */}
                {item.videoUrl && (
                  <div className="testimonial-video-area">
                    <video
                      src={item.videoUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="testimonial-video-player"
                      onPlay={() => setIsPaused(true)}
                      onPause={() => setIsPaused(false)}
                      onEnded={() => setIsPaused(false)}
                    />
                  </div>
                )}

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
        {totalItems > (isMobile ? 1 : visibleCount) && (
          <div className="testimonials-dots-nav" aria-hidden="true">
            {Array.from({ length: isMobile ? totalItems : maxIndex + 1 }).map((_, dotIdx) => (
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
