
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { useAdminData } from "@/context/AdminDataContext";

type StatId = "projects" | "clients" | "adspend";

type Metric = {
  prefix: string;
  value: number;
  suffix: string;
};

function parseMetric(input: unknown, fallback: string): Metric {
  const raw = String(input ?? fallback).trim() || fallback;
  const match = raw.match(/^([^\d]*)([\d,]+)(.*)$/);

  if (!match) {
    return { prefix: "", value: 0, suffix: "" };
  }

  return {
    prefix: match[1].trim(),
    value: Number(match[2].replace(/,/g, "")) || 0,
    suffix: match[3].trim(),
  };
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);

export function Statistics() {
  const { content } = useAdminData();
  const statsData = content.stats;

  const projects = parseMetric(
    statsData?.projectsDelivered,
    "1000+"
  );

  const clients = parseMetric(
    statsData?.clientsServed,
    "250+"
  );

  const adSpend = parseMetric(
    statsData?.metaAdSpend,
    "₹10 Lakh+"
  );

  const targets = useMemo<Record<StatId, number>>(
    () => ({
      projects: projects.value,
      clients: clients.value,
      adspend: adSpend.value,
    }),
    [projects.value, clients.value, adSpend.value]
  );

  const [started, setStarted] = useState(false);

  const [displayCounts, setDisplayCounts] = useState<
    Record<StatId, number>
  >({
    projects: projects.value,
    clients: clients.value,
    adspend: adSpend.value,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  const startCounters = useCallback(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplayCounts(targets);
      return;
    }

    const duration = 1600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayCounts({
        projects: Math.floor(targets.projects * eased),
        clients: Math.floor(targets.clients * eased),
        adspend: Math.floor(targets.adspend * eased),
      });

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayCounts(targets);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [targets]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const start = () => {
      if (startedRef.current) return;

      startedRef.current = true;
      setStarted(true);
      startCounters();
    };

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      startedRef.current = true;
      setStarted(true);
      setDisplayCounts(targets);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [startCounters, targets]);

  const items = [
    {
      id: "projects" as const,
      metric: projects,
      label: "Projects Delivered",
    },
    {
      id: "clients" as const,
      metric: clients,
      label: "Clients Served",
    },
    {
      id: "adspend" as const,
      metric: adSpend,
      label: "Meta Ad Spend",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="stats-section"
      aria-label="Digitalonix statistics"
    >
      <div className="container">

        <div className="stats-horizontal">

          {items.map((stat) => {
            const currentValue = started
              ? displayCounts[stat.id]
              : stat.metric.value;

            return (
              <div className="horizontal-stat" key={stat.id}>

                <div className="horizontal-stat-number">

                  {stat.metric.prefix && (
                    <span className="horizontal-stat-prefix">
                      {stat.metric.prefix}
                    </span>
                  )}

                  <span>
                    {formatNumber(currentValue)}
                  </span>

                  <span className="horizontal-stat-accent">
                    {stat.metric.suffix}
                  </span>

                </div>

                <span className="horizontal-stat-label">
                  {stat.label}
                </span>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
