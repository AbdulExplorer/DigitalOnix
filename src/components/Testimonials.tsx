"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles, Volume2, VolumeX, Play, Video } from "lucide-react";
import testimonialPosters from "@/data/testimonial-posters.json";

export function Testimonials() {
  const { testimonials } = useAdminData();
  const publishedTestimonials = testimonials.filter((t) => t.status === "published");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);

  const touchStartXRef = useRef<number | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const cardRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const intersectingMap = useRef<{ [key: string]: boolean }>({});
  const activeAudioIdRef = useRef<string | null>(null);
  activeAudioIdRef.current = activeAudioId;
  const activePlayingIdRef = useRef<string | null>(null);
  activePlayingIdRef.current = activePlayingId;

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

  // Stop playing video if carousel moves away from it
  const stopActiveVideoIfHidden = useCallback((targetIndex: number) => {
    const playingId = activePlayingIdRef.current;
    if (!playingId) return;

    const playingIndex = publishedTestimonials.findIndex((t) => t.id === playingId);
    const isStillVisible = isMobile
      ? playingIndex === targetIndex
      : playingIndex >= targetIndex && playingIndex < targetIndex + visibleCount;

    if (!isStillVisible) {
      const vid = videoRefs.current[playingId];
      if (vid) {
        vid.pause();
        vid.muted = true;
      }
      setActivePlayingId(null);
      activePlayingIdRef.current = null;
      setActiveAudioId(null);
      activeAudioIdRef.current = null;
    }
  }, [publishedTestimonials, isMobile, visibleCount]);

  // Auto-advance carousel on mobile with delay (pauses if user unmuted audio or watching video)
  useEffect(() => {
    if (!isMobile || totalItems <= 1 || isPaused || activeAudioId !== null || activePlayingId !== null) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIdx = prev + 1 >= totalItems ? 0 : prev + 1;
        stopActiveVideoIfHidden(nextIdx);
        return nextIdx;
      });
    }, 4500); // 4.5s delay between slides

    return () => clearInterval(interval);
  }, [isMobile, totalItems, isPaused, activeAudioId, activePlayingId, stopActiveVideoIfHidden]);

  // Ensure currentIndex stays within bounds if visibleCount changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Viewport scroll playback coordinator: pause active video if scrolled out of view
  const updateVideoPlayback = useCallback(() => {
    if (typeof window === "undefined") return;

    const currentPlaying = activePlayingIdRef.current;
    if (!currentPlaying) return;

    const isIntersecting = !!intersectingMap.current[currentPlaying];
    const playingIndex = publishedTestimonials.findIndex((t) => t.id === currentPlaying);
    const isVisibleInCarousel = isMobile
      ? playingIndex === currentIndex
      : playingIndex >= currentIndex && playingIndex < currentIndex + visibleCount;

    const video = videoRefs.current[currentPlaying];
    if (video) {
      if (!isIntersecting || !isVisibleInCarousel) {
        if (!video.paused) {
          video.pause();
        }
      }
    }
  }, [publishedTestimonials, isMobile, currentIndex, visibleCount]);

  // Viewport IntersectionObserver (single observer for all testimonials)
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-testimonial-id");
          if (id) {
            intersectingMap.current[id] = entry.isIntersecting;
          }
        });
        updateVideoPlayback();
      },
      {
        root: null,
        threshold: 0.35,
      }
    );

    publishedTestimonials.forEach((item) => {
      const el = cardRefs.current[item.id];
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [publishedTestimonials, updateVideoPlayback]);

  // Sync playback when carousel shifts or resize occurs
  useEffect(() => {
    updateVideoPlayback();
  }, [currentIndex, visibleCount, isMobile, updateVideoPlayback]);

  // Fullscreen Aspect Ratio and Format Preservation
  useEffect(() => {
    const handleFullscreenChange = () => {
      publishedTestimonials.forEach((item) => {
        const video = videoRefs.current[item.id];
        if (!video) return;

        const isFullscreen =
          document.fullscreenElement === video ||
          (document as any).webkitFullscreenElement === video ||
          (video as any).webkitDisplayingFullscreen;

        if (isFullscreen) {
          video.style.objectFit = "contain";
          video.style.backgroundColor = "#000000";
        } else {
          video.style.objectFit = "";
          video.style.backgroundColor = "";
        }
      });
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
    };
  }, [publishedTestimonials]);

  // On-demand video start handler (Zero video bytes transferred until user clicks Play)
  const handleStartPlayback = (id: string) => {
    // If another video was playing, pause it
    if (activePlayingIdRef.current && activePlayingIdRef.current !== id) {
      const prevVid = videoRefs.current[activePlayingIdRef.current];
      if (prevVid) {
        prevVid.pause();
        prevVid.muted = true;
      }
    }

    setActivePlayingId(id);
    activePlayingIdRef.current = id;
    setIsPaused(true);

    activeAudioIdRef.current = id;
    setActiveAudioId(id);

    if (isMobile) {
      const itemIdx = publishedTestimonials.findIndex((t) => t.id === id);
      if (itemIdx !== -1 && itemIdx !== currentIndex) {
        setCurrentIndex(itemIdx);
      }
    }
  };

  // Explicit Sound Toggle Handler (Single Active Audio Rule)
  const handleToggleSound = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (activeAudioIdRef.current === id) {
      const video = videoRefs.current[id];
      if (video) video.muted = true;
      activeAudioIdRef.current = null;
      setActiveAudioId(null);
    } else {
      activeAudioIdRef.current = id;
      setActiveAudioId(id);

      const video = videoRefs.current[id];
      if (video) {
        video.muted = false;
        if (video.paused) {
          video.play().catch(() => {});
        }
      }
    }
  };

  // Synchronize when user adjusts audio via native controls
  const handleNativeVolumeChange = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (!video.muted && video.volume > 0) {
      if (activeAudioIdRef.current !== id) {
        activeAudioIdRef.current = id;
        setActiveAudioId(id);
      }
    } else if (video.muted || video.volume === 0) {
      if (activeAudioIdRef.current === id) {
        activeAudioIdRef.current = null;
        setActiveAudioId(null);
      }
    }
  };

  const handlePrev = () => {
    const nextIdx = isMobile
      ? (currentIndex === 0 ? totalItems - 1 : currentIndex - 1)
      : Math.max(0, currentIndex - 1);
    stopActiveVideoIfHidden(nextIdx);
    setCurrentIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = isMobile
      ? (currentIndex + 1 >= totalItems ? 0 : currentIndex + 1)
      : Math.min(maxIndex, currentIndex + 1);
    stopActiveVideoIfHidden(nextIdx);
    setCurrentIndex(nextIdx);
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
            {publishedTestimonials.map((item) => {
              const posterMapItem = (testimonialPosters as Record<string, { localUrl?: string; publicUrl?: string }>)[item.id];
              const posterUrl = posterMapItem?.localUrl || posterMapItem?.publicUrl || "";
              const isPlaying = activePlayingId === item.id;

              return (
                <article
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[item.id] = el;
                  }}
                  data-testimonial-id={item.id}
                  className="modern-testimonial-card"
                  role="article"
                  aria-label={`Review by ${item.author}`}
                >
                  {/* Video Area Above Card Content (On-Demand Video Loading) */}
                  <div className="testimonial-video-area">
                    {isPlaying ? (
                      <>
                        <video
                          ref={(el) => {
                            videoRefs.current[item.id] = el;
                          }}
                          src={
                            item.videoUrl ||
                            "https://wlysuqlciiekbqhrmjhy.supabase.co/storage/v1/object/public/assets/testimonials/1794079229796-0f950p.MP4"
                          }
                          controls
                          autoPlay
                          playsInline
                          preload="auto"
                          className="testimonial-video-player"
                          onVolumeChange={() => handleNativeVolumeChange(item.id)}
                          onEnded={() => {
                            if (activeAudioIdRef.current === item.id) {
                              activeAudioIdRef.current = null;
                              setActiveAudioId(null);
                            }
                          }}
                        />

                        {/* Dedicated Sound Toggle Overlay Button */}
                        <button
                          type="button"
                          className={`testimonial-sound-btn ${activeAudioId === item.id ? "is-unmuted" : "is-muted"}`}
                          onClick={(e) => handleToggleSound(item.id, e)}
                          aria-label={activeAudioId === item.id ? "Mute testimonial audio" : "Enable sound for testimonial video"}
                          title={activeAudioId === item.id ? "Mute audio" : "Enable sound"}
                        >
                          {activeAudioId === item.id ? (
                            <Volume2 size={16} />
                          ) : (
                            <VolumeX size={16} />
                          )}
                        </button>
                      </>
                    ) : (
                      <div
                        className="testimonial-poster-container"
                        onClick={() => handleStartPlayback(item.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleStartPlayback(item.id);
                          }
                        }}
                        aria-label={`Play video review by ${item.author}`}
                      >
                        {posterUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={posterUrl}
                            alt={`Video review by ${item.author}`}
                            className="testimonial-poster-img"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="testimonial-poster-fallback">
                            <div className="testimonial-avatar-bubble" aria-hidden="true">
                              {(item.author || "A").charAt(0).toUpperCase()}
                            </div>
                            <span>{item.author}</span>
                          </div>
                        )}

                        <div className="testimonial-video-badge" aria-hidden="true">
                          <Video size={12} />
                          <span>Video Review</span>
                        </div>

                        <button
                          type="button"
                          className="testimonial-play-btn"
                          aria-label={`Play review by ${item.author}`}
                          tabIndex={-1}
                        >
                          <Play size={24} fill="currentColor" />
                        </button>
                      </div>
                    )}
                  </div>

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
            );
          })}
          </div>
        </div>

        {/* Pagination Dots */}
        {totalItems > (isMobile ? 1 : visibleCount) && (
          <div className="testimonials-dots-nav" aria-hidden="true">
            {Array.from({ length: isMobile ? totalItems : maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                className={`testimonials-dot ${currentIndex === dotIdx ? "is-active" : ""}`}
                onClick={() => {
                  if (isMobile && currentIndex !== dotIdx) {
                    const currentItem = publishedTestimonials[currentIndex];
                    if (currentItem && videoRefs.current[currentItem.id]) {
                      videoRefs.current[currentItem.id]?.pause();
                    }
                  }
                  setCurrentIndex(dotIdx);
                }}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
