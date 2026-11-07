"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  layer: 0 | 1; // 0 = distant background, 1 = foreground
  alpha: number;
  baseAlpha: number;
  colorTemplate: string;
  glowTemplate: string;
  driftAngle: number;
  driftSpeed: number;
  pulsePhase: number;
  pulseSpeed: number;
}

export function AntigravityField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Respect user's motion preferences
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReducedMotion = reducedMotionQuery.matches;

    let animationFrameId: number | null = null;
    let isVisible = true;
    let isTabActive = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Smoothed mouse physics coordinates
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isHovered = false;
    let mouseInfluence = 0;

    let particles: Particle[] = [];
    let foregroundIndices: number[] = [];

    // Distinct purple and starlight palette matching Digitalonix theme
    const COLOR_PALETTES = [
      {
        color: "rgba(167, 139, 250, __A__)", // Light violet
        glow: "rgba(139, 61, 255, __A__)",
      },
      {
        color: "rgba(192, 132, 252, __A__)", // Bright purple
        glow: "rgba(168, 85, 247, __A__)",
      },
      {
        color: "rgba(224, 231, 255, __A__)", // Cool starlight
        glow: "rgba(167, 139, 250, __A__)",
      },
      {
        color: "rgba(147, 51, 234, __A__)", // Deep violet
        glow: "rgba(126, 34, 206, __A__)",
      },
    ];

    const getParticleCount = (w: number) => {
      if (w < 640) return 22; // Mobile
      if (w < 1024) return 45; // Tablet
      return 78; // Desktop (clean, ethereal density)
    };

    const initParticles = () => {
      const count = getParticleCount(width);
      particles = new Array(count);
      foregroundIndices = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const layer = Math.random() > 0.42 ? 1 : 0;
        const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];

        const baseRadius = layer === 1 ? 1.4 + Math.random() * 0.9 : 0.8 + Math.random() * 0.6;
        const baseAlpha = layer === 1 ? 0.35 + Math.random() * 0.28 : 0.16 + Math.random() * 0.18;

        particles[i] = {
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          radius: baseRadius,
          baseRadius,
          layer,
          alpha: baseAlpha,
          baseAlpha,
          colorTemplate: palette.color,
          glowTemplate: palette.glow,
          driftAngle: Math.random() * Math.PI * 2,
          driftSpeed: 0.003 + Math.random() * 0.005,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.012 + Math.random() * 0.018,
        };

        if (layer === 1) {
          foregroundIndices.push(i);
        }
      }
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      if (width <= 0 || height <= 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";

      ctx.scale(dpr, dpr);

      initParticles();

      targetMouseX = width / 2;
      targetMouseY = height / 2;
      currentMouseX = targetMouseX;
      currentMouseY = targetMouseY;
    };

    const renderStaticFrame = () => {
      ctx.clearRect(0, 0, width, height);

      const glowRadius = Math.min(width, height) * 0.58;
      const gradient = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        0,
        width / 2,
        height * 0.45,
        glowRadius
      );
      gradient.addColorStop(0, "rgba(139, 61, 255, 0.14)");
      gradient.addColorStop(0.5, "rgba(91, 33, 182, 0.04)");
      gradient.addColorStop(1, "rgba(13, 13, 15, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.originX, p.originY, p.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.colorTemplate.replace("__A__", p.baseAlpha.toFixed(2));
        ctx.fill();
      }
    };

    // Animation loop (strictly pauses when user is not viewing target sections)
    const render = () => {
      if (!isVisible || !isTabActive) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth cursor interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      const targetInfluence = isHovered ? 1 : 0;
      mouseInfluence += (targetInfluence - mouseInfluence) * 0.05;

      const centerX = width / 2;
      const centerY = height / 2;
      const normX = (currentMouseX - centerX) / (centerX || 1);
      const normY = (currentMouseY - centerY) / (centerY || 1);

      // 1. Dynamic Radial Gravitational Core Glow
      const glowRadius = Math.min(width, height) * 0.55;
      const glowX = centerX + normX * 50;
      const glowY = centerY + normY * 35;
      const gradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius);
      gradient.addColorStop(0, "rgba(139, 61, 255, 0.14)");
      gradient.addColorStop(0.44, "rgba(91, 33, 182, 0.04)");
      gradient.addColorStop(1, "rgba(13, 13, 15, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Particle Physics Simulation
      const maxDistance = 165;
      const maxDistanceSq = maxDistance * maxDistance;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cosmic ambient floating
        p.driftAngle += p.driftSpeed;
        const driftX = Math.cos(p.driftAngle) * (p.layer === 1 ? 10 : 5);
        const driftY = Math.sin(p.driftAngle * 0.85) * (p.layer === 1 ? 10 : 5);

        // Depth parallax
        const parallaxFactor = p.layer === 1 ? 24 : 9;
        const homeX = p.originX + normX * parallaxFactor + driftX;
        const homeY = p.originY + normY * parallaxFactor + driftY;

        // Antigravity cursor deflection
        if (mouseInfluence > 0.02) {
          const dx = p.x - currentMouseX;
          const dy = p.y - currentMouseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq && distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDistance) * 3.0 * (p.layer === 1 ? 1.2 : 0.65) * mouseInfluence;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Damped spring return
        const spring = p.layer === 1 ? 0.036 : 0.022;
        const friction = 0.88;

        p.vx += (homeX - p.x) * spring;
        p.vy += (homeY - p.y) * spring;

        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        // Gentle breathing pulse
        p.pulsePhase += p.pulseSpeed;
        const pulse = (Math.sin(p.pulsePhase) + 1) * 0.5;
        p.alpha = p.baseAlpha * (0.75 + pulse * 0.25);

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.colorTemplate.replace("__A__", p.alpha.toFixed(3));
        ctx.fill();

        // Foreground particle glow
        if (p.layer === 1 && p.alpha > 0.32) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.baseRadius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = p.glowTemplate.replace("__A__", (p.alpha * 0.2).toFixed(3));
          ctx.fill();
        }
      }

      // 3. Constellation Connections (Foreground only)
      for (let i = 0; i < foregroundIndices.length; i++) {
        const p1 = particles[foregroundIndices[i]];
        for (let j = i + 1; j < foregroundIndices.length; j++) {
          const p2 = particles[foregroundIndices[j]];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 7225) { // 85px threshold
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 85) * 0.12 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const startAnimation = () => {
      if (isReducedMotion) {
        renderStaticFrame();
        return;
      }
      if (!animationFrameId && isVisible && isTabActive) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const stopAnimation = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    resizeCanvas();
    startAnimation();

    const handleResize = () => {
      resizeCanvas();
      if (isReducedMotion) {
        renderStaticFrame();
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Track cursor coordinates across viewport
    const handlePointerMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      isHovered = true;
    };

    const handlePointerLeave = () => {
      isHovered = false;
      targetMouseX = width / 2;
      targetMouseY = height / 2;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", handlePointerLeave);

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Multi-Section IntersectionObserver:
    // Only runs when at least ONE of the target sections is visible in the viewport
    let sectionObserver: IntersectionObserver | null = null;
    const activeSections = new Set<Element>();

    const observeTargetSections = () => {
      const targetSections = document.querySelectorAll('[data-antigravity-visible="true"]');
      if (targetSections.length === 0) {
        isVisible = true;
        startAnimation();
        return;
      }

      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activeSections.add(entry.target);
            } else {
              activeSections.delete(entry.target);
            }
          });

          const shouldBeVisible = activeSections.size > 0;
          if (shouldBeVisible !== isVisible) {
            isVisible = shouldBeVisible;
            if (isVisible) {
              startAnimation();
            } else {
              stopAnimation();
            }
          }
        },
        { threshold: 0.01, rootMargin: "80px 0px 80px 0px" }
      );

      targetSections.forEach((sec) => sectionObserver?.observe(sec));
    };

    observeTargetSections();

    return () => {
      stopAnimation();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (sectionObserver) {
        sectionObserver.disconnect();
      }
    };
  }, []);

  return (
    <div className="antigravity-global-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="antigravity-global-canvas" />
    </div>
  );
}
