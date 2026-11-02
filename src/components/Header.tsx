"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/config";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll only when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileMenuOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About Us" },
    { href: "/portfolio", label: "Portfolio" },
  ];

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        {/* Brand Logo */}
        <Link href="/" className="brand-link" aria-label="Digitalonix Home">
          <div className="brand-emblem" aria-hidden="true">
            <Sparkles size={18} />
          </div>
          <span className="brand-name">
            Digital<span className="brand-name-accent">onix</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links-list">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
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

          <div className="header-cta-group">
            <Link href="/#quote" className="btn btn-primary" style={{ padding: "0.6rem 1.25rem" }}>
              <span>Get a Quote</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-navigation-drawer"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay - Only mounted when opened to eliminate off-screen horizontal scrolling */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-nav-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div
            id="mobile-navigation-drawer"
            className="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="mobile-nav-header">
              <div className="brand-link">
                <div className="brand-emblem" aria-hidden="true">
                  <Sparkles size={16} />
                </div>
                <span>
                  Digital<span className="brand-name-accent">onix</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{ color: "var(--text-secondary)", padding: "4px" }}
              >
                <X size={20} />
              </button>
            </div>

            <ul className="mobile-nav-list">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`mobile-nav-link ${isActive ? "active" : ""}`}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mobile-nav-footer">
              <Link
                href="/#quote"
                className="btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
                style={{ width: "100%" }}
              >
                <span>Get a Quote</span>
                <ArrowRight size={16} />
              </Link>
              <div className="mobile-nav-info">
                <p>Based in {siteConfig.locationDisplay}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
