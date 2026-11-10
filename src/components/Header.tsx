// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { siteConfig } from "@/data/config";
// import { ArrowRight } from "lucide-react";

// export function Header() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [isNavVisible, setIsNavVisible] = useState(true);
//   const pathname = usePathname();

//   const lastScrollY = useRef(0);
//   const isNavVisibleRef = useRef(true);
//   const mobileMenuOpenRef = useRef(false);
//   const hamburgerButtonRef = useRef<HTMLButtonElement | null>(null);
//   const wasMobileMenuOpen = useRef(false);

//   // Sync mobileMenuOpen ref and guarantee visibility when menu opens
//   useEffect(() => {
//     mobileMenuOpenRef.current = mobileMenuOpen;
//     if (mobileMenuOpen) {
//       setIsNavVisible(true);
//       isNavVisibleRef.current = true;
//     }
//   }, [mobileMenuOpen]);

//   // Return focus to the hamburger button when the mobile menu closes
//   useEffect(() => {
//     if (wasMobileMenuOpen.current && !mobileMenuOpen) {
//       hamburgerButtonRef.current?.focus();
//     }
//     wasMobileMenuOpen.current = mobileMenuOpen;
//   }, [mobileMenuOpen]);

//   // Close mobile menu when route changes
//   useEffect(() => {
//     setMobileMenuOpen(false);
//   }, [pathname]);

//   // Lock body scroll while mobile menu is open, restore on close or unmount
//   useEffect(() => {
//     if (mobileMenuOpen) {
//       const originalOverflow = document.body.style.overflow;
//       const originalTouchAction = document.body.style.touchAction;
//       document.body.style.overflow = "hidden";
//       document.body.style.touchAction = "none";

//       return () => {
//         document.body.style.overflow = originalOverflow;
//         document.body.style.touchAction = originalTouchAction;
//       };
//     }
//   }, [mobileMenuOpen]);

//   // Unconditionally unlock body scroll if component unmounts
//   useEffect(() => {
//     return () => {
//       document.body.style.overflow = "";
//       document.body.style.touchAction = "";
//     };
//   }, []);

//   // Escape key handler to close mobile menu
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && mobileMenuOpen) {
//         setMobileMenuOpen(false);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [mobileMenuOpen]);

//   // Direction-aware scroll listener with passive event listener & ref-based throttling
//   useEffect(() => {
//     const SCROLL_THRESHOLD = 10;
//     const TOP_THRESHOLD = 30;

//     // Initialize lastScrollY to current position
//     lastScrollY.current = window.scrollY || document.documentElement.scrollTop;

//     const handleScroll = () => {
//       // Do not hide navbar while mobile menu is open
//       if (mobileMenuOpenRef.current) return;

//       const currentScrollY = window.scrollY || document.documentElement.scrollTop;

//       // Always show navbar at the top of the page
//       if (currentScrollY <= TOP_THRESHOLD) {
//         if (!isNavVisibleRef.current) {
//           isNavVisibleRef.current = true;
//           setIsNavVisible(true);
//         }
//         lastScrollY.current = currentScrollY;
//         return;
//       }

//       const diff = currentScrollY - lastScrollY.current;

//       // Skip micro-movements to eliminate jitter/flicker
//       if (Math.abs(diff) < SCROLL_THRESHOLD) {
//         return;
//       }

//       if (diff > 0 && currentScrollY > TOP_THRESHOLD) {
//         // Scrolling down -> hide navbar upwards
//         if (isNavVisibleRef.current) {
//           isNavVisibleRef.current = false;
//           setIsNavVisible(false);
//         }
//       } else if (diff < 0) {
//         // Scrolling up -> reveal navbar downwards
//         if (!isNavVisibleRef.current) {
//           isNavVisibleRef.current = true;
//           setIsNavVisible(true);
//         }
//       }

//       lastScrollY.current = currentScrollY;
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const navLinks = [
//     { href: "/", label: "Home" },
//     { href: "/services", label: "Services" },
//     { href: "/about", label: "About Us" },
//     { href: "/portfolio", label: "Portfolio" },
//   ];

//   return (
//     <header
//       className={`site-header site-header-wrapper ${
//         isNavVisible ? "nav-visible" : "nav-hidden"
//       } ${mobileMenuOpen ? "menu-open" : ""}`}
//     >
//       {/* Floating Capsule Container */}
//       <div className="navbar-capsule">
//         {/* Brand Logo */}
//         <Link href="/" className="brand-link" aria-label="Digitalonix Home">
//           <Image
//             src="/logo.png"
//             alt="Digitalonix Logo"
//             width={34}
//             height={34}
//             className="brand-logo-img"
//             priority
//           />
//           <span className="brand-name">
//             Digital<span className="brand-name-accent">onix</span>
//           </span>
//         </Link>

//         {/* Desktop Navigation Links */}
//         <nav className="desktop-nav" aria-label="Main Navigation">
//           <ul className="nav-links-list">
//             {navLinks.map((link) => {
//               const isActive =
//                 pathname === link.href ||
//                 (link.href !== "/" && pathname.startsWith(link.href));
//               return (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     className={`nav-link ${isActive ? "active" : ""}`}
//                     aria-current={isActive ? "page" : undefined}
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* Desktop CTA Button */}
//         <div className="desktop-cta-wrapper">
//           <Link href="/#quote" className="navbar-cta-btn">
//             <span>Get a Quote</span>
//             <ArrowRight size={15} />
//           </Link>
//         </div>

//         {/* Mobile Toggle Button with Animated Hamburger */}
//         <button
//           ref={hamburgerButtonRef}
//           type="button"
//           className={`mobile-toggle-btn ${mobileMenuOpen ? "is-open" : ""}`}
//           onClick={() => setMobileMenuOpen((prev) => !prev)}
//           aria-expanded={mobileMenuOpen}
//           aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
//           aria-controls="mobile-navigation-panel"
//         >
//           <span className="hamburger-box" aria-hidden="true">
//             <span className="hamburger-line line-top" />
//             <span className="hamburger-line line-middle" />
//             <span className="hamburger-line line-bottom" />
//           </span>
//         </button>
//       </div>

//       {/* Mobile Backdrop Overlay */}
//       <div
//         className={`mobile-menu-backdrop ${mobileMenuOpen ? "is-open" : ""}`}
//         onClick={() => setMobileMenuOpen(false)}
//         aria-hidden="true"
//       />

//       {/* Mobile Menu Slide-Down Panel */}
//       <div
//         id="mobile-navigation-panel"
//         className={`mobile-menu-panel ${mobileMenuOpen ? "is-open" : ""}`}
//         role="dialog"
//         aria-modal="true"
//         aria-label="Mobile Navigation"
//       >
//         <div className="mobile-menu-inner">
//           <nav className="mobile-nav" aria-label="Mobile Main Navigation">
//             <ul className="mobile-nav-list">
//               {navLinks.map((link, index) => {
//                 const isActive =
//                   pathname === link.href ||
//                   (link.href !== "/" && pathname.startsWith(link.href));
//                 return (
//                   <li
//                     key={link.href}
//                     className="mobile-nav-item"
//                     style={{ "--item-index": index } as React.CSSProperties}
//                   >
//                     <Link
//                       href={link.href}
//                       className={`mobile-nav-link ${isActive ? "active" : ""}`}
//                       onClick={() => setMobileMenuOpen(false)}
//                       aria-current={isActive ? "page" : undefined}
//                     >
//                       <span>{link.label}</span>
//                       <span className="mobile-nav-indicator" aria-hidden="true">
//                         →
//                       </span>
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           <div className="mobile-menu-footer">
//             <Link
//               href="/#quote"
//               className="mobile-cta-btn"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               <span>Get a Quote</span>
//               <ArrowRight size={16} />
//             </Link>
//             <div className="mobile-menu-info">
//               <p className="mobile-info-location">Based in {siteConfig.locationDisplay}</p>
//               <p className="mobile-info-tagline">
//                 Creative marketing & performance engineering
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";

import { siteConfig } from "@/data/config";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
];

export function Header() {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef<string>("");

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Detect scroll position
  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock body scroll and handle keyboard controls
  useEffect(() => {
    if (!menuOpen) return;

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }

      if (event.key === "Tab") {
        const menu = document.querySelector<HTMLElement>(
          ".dx-mobile-menu"
        );

        if (!menu) return;

        const focusable = menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow.current;
      window.removeEventListener("keydown", handleKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  // Close menu after navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = (): void => {
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`dx-header-wrapper ${isScrolled ? "is-scrolled" : ""
          }`}
      >
        <div className="dx-header-bar">

          {/* BRAND */}
          <Link
            href="/"
            className="dx-brand"
            aria-label="Digitalonix homepage"
          >
            <Image
              // src="/logo.png"
              // src="/logo2.png"
              src="/logo3.png"
              alt="Digitalonix"
              width={64}
              height={64}
              priority
              className="dx-brand-logo"
            />

            <span className="dx-brand-name">
              Digital<span>onix</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            className="dx-desktop-nav"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`dx-desktop-link ${isActive(link.href) ? "active" : ""
                  }`}
                aria-current={
                  isActive(link.href) ? "page" : undefined
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP CTA */}
          <Link
            href="/#quote"
            className="dx-desktop-cta"
          >
            <span>Get a Quote</span>
            <ArrowUpRight size={17} />
          </Link>

          {/* MOBILE HAMBURGER */}
          <button
            ref={menuButtonRef}
            type="button"
            className={`dx-mobile-toggle ${menuOpen ? "is-open" : ""
              }`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="dx-mobile-menu"
          >
            <span className="dx-hamburger-box">
              <span className="dx-hamburger-line" />
              <span className="dx-hamburger-line" />
            </span>
          </button>
        </div>
      </header>

      {/* MOBILE BACKDROP */}
      <div
        className={`dx-mobile-backdrop ${menuOpen ? "is-open" : ""
          }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* MOBILE SLIDE-DOWN MENU */}
      <div
        id="dx-mobile-menu"
        className={`dx-mobile-menu ${menuOpen ? "is-open" : ""
          }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="dx-mobile-menu-inner">

          {/* MENU HEADER */}
          <div className="dx-mobile-menu-header">
            <span className="dx-mobile-menu-label">
              MENU / EXPLORE
            </span>

            <button
              ref={closeButtonRef}
              type="button"
              className="dx-mobile-close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={21} />
            </button>
          </div>

          {/* MOBILE LINKS */}
          <nav
            className="dx-mobile-nav"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`dx-mobile-nav-link ${isActive(link.href) ? "active" : ""
                  }`}
                aria-current={
                  isActive(link.href) ? "page" : undefined
                }
              >
                <span className="dx-mobile-nav-number">
                  0{index + 1}
                </span>

                <span className="dx-mobile-nav-title">
                  {link.label}
                </span>

                <ArrowRight
                  className="dx-mobile-nav-arrow"
                  size={19}
                />
              </Link>
            ))}
          </nav>

          {/* MOBILE CTA */}
          <Link
            href="/#quote"
            className="dx-mobile-cta"
            onClick={closeMenu}
          >
            <span>
              Get a Quote
              <small>Let's discuss your next project</small>
            </span>

            <ArrowUpRight size={22} />
          </Link>

          {/* FOOTER */}
          <div className="dx-mobile-menu-footer">
            <span>{siteConfig.locationDisplay}</span>
            <span>
              © {new Date().getFullYear()} Digitalonix
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

