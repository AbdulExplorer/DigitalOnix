"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { testimonialsData } from "@/data/testimonials";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const totalItems = testimonialsData.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5500);

    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
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
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "var(--space-2xl)",
          }}
        >
          <div>
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title" style={{ marginBottom: "0.25rem" }}>
              What partners say about us.
            </h2>
          </div>

          <div className="carousel-controls-bar">
            <button
              className="carousel-nav-btn"
              onClick={prevSlide}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="carousel-nav-btn"
              onClick={nextSlide}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div
          className="carousel-viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / Math.min(5, totalItems))}%)`,
            }}
          >
            {testimonialsData.map((item, idx) => (
              <article key={item.id} className="testimonial-card">
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span className="testimonial-badge">{item.serviceCategory}</span>
                    <Quote size={18} style={{ color: "var(--brand-purple-light)", opacity: 0.6 }} />
                  </div>
                  <p className="testimonial-quote">&ldquo;{item.placeholderQuote}&rdquo;</p>
                </div>

                <div className="testimonial-author">
                  <div className="testimonial-avatar-fallback">
                    {`0${idx + 1}`}
                  </div>
                  <div className="testimonial-author-info">
                    <span className="testimonial-author-name">{item.clientIdentifier}</span>
                    <span className="testimonial-author-role">{item.rolePlaceholder}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {testimonialsData.map((item, idx) => (
            <button
              key={item.id}
              className={`indicator-dot ${currentIndex === idx ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
