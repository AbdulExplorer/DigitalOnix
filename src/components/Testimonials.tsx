"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAdminData } from "@/context/AdminDataContext";
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles, Volume2, VolumeX } from "lucide-react";

export function Testimonials() {
  const { testimonials } = useAdminData();
  const publishedTestimonials = testimonials.filter((t) => t.status === "published");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  const touchStartXRef = useRef<number | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const cardRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const intersectingMap = useRef<{ [key: string]: boolean }>({});
  const activeAudioIdRef = useRef<string | null>(null);
  activeAudioIdRef.current = activeAudioId;

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

  // Auto-advance carousel on mobile with delay (pauses if user unmuted audio)
  useEffect(() => {
    if (!isMobile || totalItems <= 1 || isPaused || activeAudioId !== null) return;

    const interval = setInterval(() => {
      // Pause currently playing video before transitioning slide on mobile
      const currentItem = publishedTestimonials[currentIndex];
      if (currentItem && videoRefs.current[currentItem.id]) {
        videoRefs.current[currentItem.id]?.pause();
      }
      setCurrentIndex((prev) => (prev + 1 >= totalItems ? 0 : prev + 1));
    }, 4500); // 4.5s delay between slides

    return () => clearInterval(interval);
  }, [isMobile, totalItems, isPaused, activeAudioId, currentIndex, publishedTestimonials]);

  // Ensure currentIndex stays within bounds if visibleCount changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Viewport & Carousel slice playback coordinator
  const updateVideoPlayback = useCallback(() => {
    if (typeof window === "undefined") return;

    const isMobileDevice = isMobile || window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobileDevice) {
      // ON MOBILE: Strictly only ONE video can play at any time.
      // 1. Immediately pause and mute all videos not at currentIndex
      publishedTestimonials.forEach((item, index) => {
        if (index !== currentIndex) {
          const video = videoRefs.current[item.id];
          if (video) {
            if (!video.paused) {
              video.pause();
            }
            video.muted = true;
          }
        }
      });

      // 2. Control playback of the single active video at currentIndex
      const activeItem = publishedTestimonials[currentIndex];
      if (activeItem) {
        const activeVideo = videoRefs.current[activeItem.id];
        if (activeVideo) {
          const isIntersecting = !!intersectingMap.current[activeItem.id];
          const shouldPlay = isIntersecting && !prefersReducedMotion;

          if (shouldPlay) {
            const shouldHaveAudio = activeAudioIdRef.current === activeItem.id;
            if (activeVideo.muted !== !shouldHaveAudio) {
              activeVideo.muted = !shouldHaveAudio;
            }
            if (activeVideo.paused) {
              activeVideo.play().catch(() => {});
            }
          } else {
            if (!activeVideo.paused) {
              activeVideo.pause();
            }
            activeVideo.muted = true;
            if (activeAudioIdRef.current === activeItem.id) {
              activeAudioIdRef.current = null;
              setActiveAudioId(null);
            }
          }
        }
      }
      return;
    }

    // ON DESKTOP: Multiple visible cards can play simultaneously (muted), single active audio
    publishedTestimonials.forEach((item, index) => {
      const video = videoRefs.current[item.id];
      if (!video) return;

      const isIntersecting = !!intersectingMap.current[item.id];
      const isVisibleInCarousel = index >= currentIndex && index < currentIndex + visibleCount;

      const shouldPlay = isIntersecting && isVisibleInCarousel && !prefersReducedMotion;

      if (shouldPlay) {
        // Enforce single-audio ownership rule
        const shouldHaveAudio = activeAudioIdRef.current === item.id;
        if (video.muted !== !shouldHaveAudio) {
          video.muted = !shouldHaveAudio;
        }

        // Only trigger play if currently paused to avoid stuttering/restarting
        if (video.paused) {
          video.play().catch(() => {
            // Autoplay rejection handled gracefully
          });
        }
      } else {
        // Video scrolled out of viewport or rotated out of active carousel slice: pause & mute
        if (!video.paused) {
          video.pause();
        }
        if (!video.muted) {
          video.muted = true;
        }

        // Release audio ownership if this video leaves the viewport
        if (activeAudioIdRef.current === item.id) {
          activeAudioIdRef.current = null;
          setActiveAudioId(null);
        }
      }
    });
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

  // Explicit Sound Toggle Handler (Single Active Audio Rule)
  const handleToggleSound = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (activeAudioIdRef.current === id) {
      // Toggle off
      const video = videoRefs.current[id];
      if (video) video.muted = true;
      activeAudioIdRef.current = null;
      setActiveAudioId(null);
    } else {
      // Transfer audio ownership exclusively to this video
      activeAudioIdRef.current = id;
      setActiveAudioId(id);

      const isMobileDevice = isMobile || (typeof window !== "undefined" && window.innerWidth <= 768);

      publishedTestimonials.forEach((item) => {
        const v = videoRefs.current[item.id];
        if (!v) return;
        if (item.id === id) {
          v.muted = false;
          if (v.paused) {
            v.play().catch(() => {});
          }
        } else {
          v.muted = true;
          if (isMobileDevice && !v.paused) {
            v.pause();
          }
        }
      });
    }
  };

  // Synchronize when user adjusts audio via native controls
  const handleNativeVolumeChange = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    const isMobileDevice = isMobile || (typeof window !== "undefined" && window.innerWidth <= 768);

    if (!video.muted && video.volume > 0) {
      if (activeAudioIdRef.current !== id) {
        activeAudioIdRef.current = id;
        setActiveAudioId(id);

        publishedTestimonials.forEach((item) => {
          if (item.id !== id) {
            const other = videoRefs.current[item.id];
            if (other) {
              other.muted = true;
              if (isMobileDevice && !other.paused) {
                other.pause();
              }
            }
          }
        });
      }
    } else if (video.muted || video.volume === 0) {
      if (activeAudioIdRef.current === id) {
        activeAudioIdRef.current = null;
        setActiveAudioId(null);
      }
    }
  };

  const handlePrev = () => {
    if (isMobile) {
      const currentItem = publishedTestimonials[currentIndex];
      if (currentItem && videoRefs.current[currentItem.id]) {
        videoRefs.current[currentItem.id]?.pause();
      }
      setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (isMobile) {
      const currentItem = publishedTestimonials[currentIndex];
      if (currentItem && videoRefs.current[currentItem.id]) {
        videoRefs.current[currentItem.id]?.pause();
      }
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
                ref={(el) => {
                  cardRefs.current[item.id] = el;
                }}
                data-testimonial-id={item.id}
                className="modern-testimonial-card"
                role="article"
                aria-label={`Review by ${item.author}`}
              >
                {/* Video Area Above Card Content */}
                <div className="testimonial-video-area">
                  <video
                    ref={(el) => {
                      videoRefs.current[item.id] = el;
                    }}
                    src={
                      item.videoUrl ||
                      "https://wlysuqlciiekbqhrmjhy.supabase.co/storage/v1/object/public/assets/testimonials/1794079229796-0f950p.MP4"
                    }
                    controls
                    playsInline
                    preload="metadata"
                    muted
                    className="testimonial-video-player"
                    onPlay={() => {
                      setIsPaused(true);
                      const isMobileDevice = isMobile || (typeof window !== "undefined" && window.innerWidth <= 768);
                      if (isMobileDevice) {
                        // Strictly enforce: on mobile at one time only one video play
                        publishedTestimonials.forEach((other) => {
                          if (other.id !== item.id) {
                            const otherVid = videoRefs.current[other.id];
                            if (otherVid) {
                              if (!otherVid.paused) {
                                otherVid.pause();
                              }
                              otherVid.muted = true;
                            }
                          }
                        });
                        const itemIdx = publishedTestimonials.findIndex((t) => t.id === item.id);
                        if (itemIdx !== -1 && itemIdx !== currentIndex) {
                          setCurrentIndex(itemIdx);
                        }
                      }
                    }}
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
