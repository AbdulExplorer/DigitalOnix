"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { siteConfig } from "@/data/config";
import { useAdminData } from "@/context/AdminDataContext";
import { MapPin, FolderCheck, Users, Banknote } from "lucide-react";

export function Statistics() {
  const { content } = useAdminData();
  const statsData = content.stats;

  const projectsStr = statsData?.projectsDelivered || "1000+";
  const clientsStr = statsData?.clientsServed || "250+";
  const metaAdSpendStr = statsData?.metaAdSpend || "₹10Lakh+";

  const targetProjects = parseInt(projectsStr.replace(/[^0-9]/g, "") || "1000", 10);
  const targetClients = parseInt(clientsStr.replace(/[^0-9]/g, "") || "250", 10);
  const targetAdSpend = parseInt(metaAdSpendStr.replace(/[^0-9]/g, "") || "10", 10);

  const projectsSuffix = projectsStr.replace(/[0-9]/g, "") || "+";
  const clientsSuffix = clientsStr.replace(/[0-9]/g, "") || "+";
  const adSpendPrefix = metaAdSpendStr.includes("₹") ? "₹" : "";
  const adSpendSuffix = metaAdSpendStr.replace(/[^a-zA-Z+]/g, "") || "Lakh+";

  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayCounts, setDisplayCounts] = useState<{ [key: string]: number }>({
    projects: 0,
    clients: 0,
    adspend: 0,
  });

  const startCounters = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayCounts({
        projects: targetProjects,
        clients: targetClients,
        adspend: targetAdSpend,
      });
      return;
    }

    const duration = 1800;
    const startTime = performance.now();

    const targets = {
      projects: targetProjects,
      clients: targetClients,
      adspend: targetAdSpend,
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
  }, [targetProjects, targetClients, targetAdSpend]);

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
  }, [hasAnimated, startCounters]);

  const items = [
    {
      id: "projects",
      prefix: "",
      value: targetProjects,
      suffix: projectsSuffix,
      label: "Projects Delivered",
      icon: <FolderCheck size={22} />,
    },
    {
      id: "clients",
      prefix: "",
      value: targetClients,
      suffix: clientsSuffix,
      label: "Clients Served",
      icon: <Users size={22} />,
    },
    {
      id: "adspend",
      prefix: adSpendPrefix,
      value: targetAdSpend,
      suffix: adSpendSuffix,
      label: "Meta Ad Spend",
      icon: <Banknote size={22} />,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="stats-section section-padding"
      aria-label="Company Introduction and Statistics"
    >
      <div className="container">
        <div className="intro-stats-grid">
          {/* Introduction Column */}
          <div className="intro-text-column reveal-on-scroll">
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
            {items.map((stat, idx) => (
              <div
                key={stat.id}
                className={`stat-card reveal-on-scroll reveal-delay-${idx + 1}`}
              >
                <div className="stat-content">
                  <div className="stat-number-wrapper">
                    {stat.prefix && <span>{stat.prefix}</span>}
                    <span>{hasAnimated ? displayCounts[stat.id] : stat.value}</span>
                    <span className="stat-accent">{stat.suffix}</span>
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>

                <div className="stat-icon-emblem" aria-hidden="true">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
