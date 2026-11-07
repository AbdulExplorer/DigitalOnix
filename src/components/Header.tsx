"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/config";
import { ArrowRight } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const pathname = usePathname();

  const lastScrollY = useRef(0);
  const isNavVisibleRef = useRef(true);
  const mobileMenuOpenRef = useRef(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement | null>(null);
  const wasMobileMenuOpen = useRef(false);

  // Sync mobileMenuOpen ref and guarantee visibility when menu opens
  useEffect(() => {
    mobileMenuOpenRef.current = mobileMenuOpen;
    if (mobileMenuOpen) {
      setIsNavVisible(true);
      isNavVisibleRef.current = true;
    }
  }, [mobileMenuOpen]);

  // Return focus to the hamburger button when the mobile menu closes
  useEffect(() => {
    if (wasMobileMenuOpen.current && !mobileMenuOpen) {
      hamburgerButtonRef.current?.focus();
    }
    wasMobileMenuOpen.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile menu is open, restore on close or unmount
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [mobileMenuOpen]);

  // Unconditionally unlock body scroll if component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, []);

  // Escape key handler to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Direction-aware scroll listener with passive event listener & ref-based throttling
  useEffect(() => {
    const SCROLL_THRESHOLD = 10;
    const TOP_THRESHOLD = 30;

    // Initialize lastScrollY to current position
    lastScrollY.current = window.scrollY || document.documentElement.scrollTop;

    const handleScroll = () => {
      // Do not hide navbar while mobile menu is open
      if (mobileMenuOpenRef.current) return;

      const currentScrollY = window.scrollY || document.documentElement.scrollTop;

      // Always show navbar at the top of the page
      if (currentScrollY <= TOP_THRESHOLD) {
        if (!isNavVisibleRef.current) {
          isNavVisibleRef.current = true;
          setIsNavVisible(true);
        }
        lastScrollY.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY.current;

      // Skip micro-movements to eliminate jitter/flicker
      if (Math.abs(diff) < SCROLL_THRESHOLD) {
        return;
      }

      if (diff > 0 && currentScrollY > TOP_THRESHOLD) {
        // Scrolling down -> hide navbar upwards
        if (isNavVisibleRef.current) {
          isNavVisibleRef.current = false;
          setIsNavVisible(false);
        }
      } else if (diff < 0) {
        // Scrolling up -> reveal navbar downwards
        if (!isNavVisibleRef.current) {
          isNavVisibleRef.current = true;
          setIsNavVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About Us" },
    { href: "/portfolio", label: "Portfolio" },
  ];

  return (
    <header
      className={`site-header site-header-wrapper ${
        isNavVisible ? "nav-visible" : "nav-hidden"
      } ${mobileMenuOpen ? "menu-open" : ""}`}
    >
      {/* Floating Capsule Container */}
      <div className="navbar-capsule">
        {/* Brand Logo */}
        <Link href="/" className="brand-link" aria-label="Digitalonix Home">
          <Image
            src="/logo.png"
            alt="Digitalonix Logo"
            width={34}
            height={34}
            className="brand-logo-img"
            priority
          />
          <span className="brand-name">
            Digital<span className="brand-name-accent">onix</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links-list">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop CTA Button */}
        <div className="desktop-cta-wrapper">
          <Link href="/#quote" className="navbar-cta-btn">
            <span>Get a Quote</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile Toggle Button with Animated Hamburger */}
        <button
          ref={hamburgerButtonRef}
          type="button"
          className={`mobile-toggle-btn ${mobileMenuOpen ? "is-open" : ""}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-navigation-panel"
        >
          <span className="hamburger-box" aria-hidden="true">
            <span className="hamburger-line line-top" />
            <span className="hamburger-line line-middle" />
            <span className="hamburger-line line-bottom" />
          </span>
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`mobile-menu-backdrop ${mobileMenuOpen ? "is-open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Slide-Down Panel */}
      <div
        id="mobile-navigation-panel"
        className={`mobile-menu-panel ${mobileMenuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mobile-menu-inner">
          <nav className="mobile-nav" aria-label="Mobile Main Navigation">
            <ul className="mobile-nav-list">
              {navLinks.map((link, index) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <li
                    key={link.href}
                    className="mobile-nav-item"
                    style={{ "--item-index": index } as React.CSSProperties}
                  >
                    <Link
                      href={link.href}
                      className={`mobile-nav-link ${isActive ? "active" : ""}`}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{link.label}</span>
                      <span className="mobile-nav-indicator" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mobile-menu-footer">
            <Link
              href="/#quote"
              className="mobile-cta-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Get a Quote</span>
              <ArrowRight size={16} />
            </Link>
            <div className="mobile-menu-info">
              <p className="mobile-info-location">Based in {siteConfig.locationDisplay}</p>
              <p className="mobile-info-tagline">
                Creative marketing & performance engineering
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
