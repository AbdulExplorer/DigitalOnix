"use client";

import React, { useState, useEffect, useRef } from "react";
import { agencyStats } from "@/data/stats";
import { siteConfig } from "@/data/config";
import { MapPin, FolderCheck, Users, Banknote } from "lucide-react";

export function Statistics() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayCounts, setDisplayCounts] = useState<{ [key: string]: number }>({
    projects: 0,
    clients: 0,
    adspend: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startCounters();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const startCounters = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayCounts({
        projects: 1000,
        clients: 250,
        adspend: 10,
      });
      return;
    }

    const duration = 1800;
    const startTime = performance.now();

    const targets = {
      projects: 1000,
      clients: 250,
      adspend: 10,
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setDisplayCounts({
        projects: Math.floor(targets.projects * easeOut),
        clients: Math.floor(targets.clients * easeOut),
        adspend: Math.floor(targets.adspend * easeOut),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayCounts(targets);
      }
    };

    requestAnimationFrame(animate);
  };

  const getIcon = (id: string) => {
    switch (id) {
      case "projects":
        return <FolderCheck size={22} />;
      case "clients":
        return <Users size={22} />;
      case "adspend":
        return <Banknote size={22} />;
      default:
        return <FolderCheck size={22} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="stats-section section-padding"
      aria-label="Company Introduction and Statistics"
    >
      <div className="container">
        <div className="intro-stats-grid">
          {/* Introduction Column */}
          <div className="intro-text-column">
            <span className="intro-badge">
              <MapPin size={13} />
              {siteConfig.locationDisplay}
            </span>
            <h2 className="intro-heading">
              Creative marketing crafted for brands that refuse to blend in.
            </h2>
            <p className="intro-paragraph">
              Digitalonix is an integrated growth studio blending aesthetic storytelling with performance engineering. We partner with ambitious brands to capture attention and drive measurable business results.
            </p>
          </div>

          {/* Statistics Column */}
          <div className="stats-cards-wrapper">
            {agencyStats.map((stat) => (
              <div key={stat.id} className="stat-card">
                <div className="stat-content">
                  <div className="stat-number-wrapper">
                    {stat.prefix && <span>{stat.prefix}</span>}
                    <span>{hasAnimated ? displayCounts[stat.id] : stat.value}</span>
                    <span className="stat-accent">{stat.suffix}</span>
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>

                <div className="stat-icon-emblem" aria-hidden="true">
                  {getIcon(stat.id)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
