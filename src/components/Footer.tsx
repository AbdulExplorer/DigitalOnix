import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/config";
import { Instagram, Linkedin, MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Column */}
          <div className="footer-brand-column">
            <Link href="/" className="footer-logo" aria-label="Digitalonix Home">
              <Image
                src="/logo.png"
                alt="Digitalonix Logo"
                width={50}
                height={50}
                className="brand-logo-img"
              />
              <span>
                Digital<span className="brand-name-accent">onix</span>
              </span>
            </Link>

            <p className="footer-tagline">
              {siteConfig.description}
            </p>

            <div className="footer-social-row">
              {siteConfig.instagramUrl && (
                <Link
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Follow Digitalonix on Instagram"
                >
                  <Instagram size={18} />
                </Link>
              )}

              {siteConfig.linkedinUrl && (
                <Link
                  href={siteConfig.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Connect with Digitalonix on LinkedIn"
                >
                  <Linkedin size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="footer-column-heading">Navigation</h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link href="/services" className="footer-link">Services</Link>
              </li>
              <li>
                <Link href="/about" className="footer-link">About Us</Link>
              </li>
              <li>
                <Link href="/portfolio" className="footer-link">Portfolio</Link>
              </li>
              <li>
                <Link href="/#quote" className="footer-link">Get a Quote</Link>
              </li>
            </ul>
          </div>

          {/* Capabilities */}
          <div>
            <h4 className="footer-column-heading">Capabilities</h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/services" className="footer-link">Paid Advertising</Link>
              </li>
              <li>
                <Link href="/services" className="footer-link">Video Production</Link>
              </li>
              <li>
                <Link href="/services" className="footer-link">Social Media</Link>
              </li>
              <li>
                <Link href="/services" className="footer-link">Web &amp; Software</Link>
              </li>
              <li>
                <Link href="/services" className="footer-link">Google Business Profile</Link>
              </li>
            </ul>
          </div>

          {/* Bhopal Headquarters */}
          <div>
            <h4 className="footer-column-heading">Headquarters</h4>
            <div className="footer-contact-details">
              <div className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span>{siteConfig.locationDisplay}</span>
              </div>
              <div className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <span>{siteConfig.contactEmail}</span>
              </div>
              <div className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span>{siteConfig.contactPhone}</span>
              </div>
            </div>

            <Link href="/#quote" className="btn btn-primary" style={{ width: "100%", padding: "0.65rem 1rem", fontSize: "var(--text-xs)" }}>
              <span>Start Your Project</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            <span>&copy; {currentYear} {siteConfig.name}. All rights reserved. Bhopal, India.</span>
          </div>

          <div className="footer-legal-links">
            <span style={{ color: "var(--text-muted)" }}>Privacy Policy</span>
            <span style={{ color: "var(--text-muted)" }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
