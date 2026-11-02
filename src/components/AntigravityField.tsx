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

interface AntigravityFieldProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function AntigravityField({ containerRef }: AntigravityFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReducedMotion = reducedMotionQuery.matches;

    let animationFrameId: number | null = null;
    let isVisible = true;
    let isTabActive = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse coordinates (interpolated for butter-smooth movement)
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isHovered = false;
    let mouseInfluence = 0; // 0 to 1 smooth fade

    let particles: Particle[] = [];
    let foregroundIndices: number[] = [];

    // Particle color palettes (purple & starlight agency theme)
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
      if (w < 640) return 22; // Mobile: 22 particles (ultra-lightweight)
      if (w < 1024) return 45; // Tablet: 45 particles
      return 75; // Desktop: 75 particles (refined, optimal density)
    };

    const initParticles = () => {
      const count = getParticleCount(width);
      particles = new Array(count);
      foregroundIndices = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const layer = Math.random() > 0.42 ? 1 : 0; // ~58% foreground, 42% background
        const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];

        // Foreground particles are slightly larger, brighter and have subtle halos
        const baseRadius = layer === 1 ? 1.4 + Math.random() * 1.0 : 0.8 + Math.random() * 0.7;
        const baseAlpha = layer === 1 ? 0.35 + Math.random() * 0.3 : 0.18 + Math.random() * 0.2;

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
          driftSpeed: 0.004 + Math.random() * 0.006,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.02,
        };

        if (layer === 1) {
          foregroundIndices.push(i);
        }
      }
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);

      if (width <= 0 || height <= 0) return;

      // Clamp DPR to max 2 to prevent excessive pixel fillrate on ultra-high DPI mobile screens
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Reinitialize particles distributed to new dimensions
      initParticles();

      // Set initial mouse resting point to center
      targetMouseX = width / 2;
      targetMouseY = height / 2;
      currentMouseX = targetMouseX;
      currentMouseY = targetMouseY;
    };

    // Single static render for reduced motion
    const renderStaticFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // Ambient static purple glow
      const glowRadius = Math.min(width, height) * 0.6;
      const gradient = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        0,
        width / 2,
        height * 0.45,
        glowRadius
      );
      gradient.addColorStop(0, "rgba(139, 61, 255, 0.16)");
      gradient.addColorStop(0.5, "rgba(91, 33, 182, 0.05)");
      gradient.addColorStop(1, "rgba(13, 13, 15, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw calm static particle specks
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.originX, p.originY, p.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.colorTemplate.replace("__A__", p.baseAlpha.toFixed(2));
        ctx.fill();
      }
    };

    // Interactive Animation Loop
    const render = () => {
      if (!isVisible || !isTabActive) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth cursor position interpolation (linear interpolation with 0.08 spring)
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      // Smooth mouse influence in/out transition
      const targetInfluence = isHovered ? 1 : 0;
      mouseInfluence += (targetInfluence - mouseInfluence) * 0.05;

      const centerX = width / 2;
      const centerY = height / 2;
      const normX = (currentMouseX - centerX) / (centerX || 1);
      const normY = (currentMouseY - centerY) / (centerY || 1);

      // 1. Dynamic Interactive Ambient Glow (Gravitational Core)
      const glowRadius = Math.min(width, height) * 0.58;
      const glowX = centerX + normX * 45;
      const glowY = centerY + normY * 35;
      const gradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius);
      gradient.addColorStop(0, "rgba(139, 61, 255, 0.15)");
      gradient.addColorStop(0.42, "rgba(91, 33, 182, 0.05)");
      gradient.addColorStop(1, "rgba(13, 13, 15, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Physics & Particle Updates
      const maxDistance = 165;
      const maxDistanceSq = maxDistance * maxDistance;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ambient autonomous floating drift
        p.driftAngle += p.driftSpeed;
        const driftX = Math.cos(p.driftAngle) * (p.layer === 1 ? 10 : 5);
        const driftY = Math.sin(p.driftAngle * 0.85) * (p.layer === 1 ? 10 : 5);

        // Parallax target according to depth layer
        const parallaxFactor = p.layer === 1 ? 26 : 10;
        const homeX = p.originX + normX * parallaxFactor + driftX;
        const homeY = p.originY + normY * parallaxFactor + driftY;

        // Antigravity cursor deflection
        if (mouseInfluence > 0.02) {
          const dx = p.x - currentMouseX;
          const dy = p.y - currentMouseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq && distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDistance) * 3.2 * (p.layer === 1 ? 1.25 : 0.65) * mouseInfluence;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Return spring toward home & friction damping
        const spring = p.layer === 1 ? 0.038 : 0.024;
        const friction = 0.88;

        p.vx += (homeX - p.x) * spring;
        p.vy += (homeY - p.y) * spring;

        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        // Soft breathing pulsation
        p.pulsePhase += p.pulseSpeed;
        const pulse = (Math.sin(p.pulsePhase) + 1) * 0.5;
        p.alpha = p.baseAlpha * (0.75 + pulse * 0.25);

        // Render particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.colorTemplate.replace("__A__", p.alpha.toFixed(3));
        ctx.fill();

        // Subtle soft halo on foreground particles
        if (p.layer === 1 && p.alpha > 0.32) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.baseRadius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.glowTemplate.replace("__A__", (p.alpha * 0.2).toFixed(3));
          ctx.fill();
        }
      }

      // 3. Subtle Gravitational Connections (Constellations)
      // Only between nearby foreground particles for optimal performance
      for (let i = 0; i < foregroundIndices.length; i++) {
        const p1 = particles[foregroundIndices[i]];
        for (let j = i + 1; j < foregroundIndices.length; j++) {
          const p2 = particles[foregroundIndices[j]];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 7225) { // 85px max connecting distance
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

    // Set initial size
    resizeCanvas();
    startAnimation();

    // Event listeners
    const handleResize = () => {
      resizeCanvas();
      if (isReducedMotion) {
        renderStaticFrame();
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Target tracking element: container if provided, else canvas parent
    const targetElement = (containerRef && containerRef.current) || canvas.parentElement || window;

    const handlePointerMove = (e: Event) => {
      const pe = e as MouseEvent;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = pe.clientX - rect.left;
      targetMouseY = pe.clientY - rect.top;
      isHovered = true;
    };

    const handlePointerLeave = () => {
      isHovered = false;
      targetMouseX = width / 2;
      targetMouseY = height / 2;
    };

    targetElement.addEventListener("mousemove", handlePointerMove as EventListener, { passive: true });
    targetElement.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    // Page visibility listener: pause when tab is switched
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Viewport IntersectionObserver: pause when hero is scrolled out of view
    const observerTarget = (containerRef && containerRef.current) || canvas.parentElement || canvas;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.05 }
    );

    intersectionObserver.observe(observerTarget);

    // Cleanup on unmount
    return () => {
      stopAnimation();
      window.removeEventListener("resize", handleResize);
      targetElement.removeEventListener("mousemove", handlePointerMove as EventListener);
      targetElement.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      intersectionObserver.disconnect();
    };
  }, [containerRef]);

  return (
    <div className="antigravity-field-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="antigravity-canvas" />
    </div>
  );
}

