"use client";

import React, { useState } from "react";
import Link from "next/link";
import { servicesData, serviceCategories } from "@/data/services";
import {
  Megaphone,
  Share2,
  Target,
  PenTool,
  Video,
  Newspaper,
  Bot,
  Globe,
  Code2,
  MapPin,
  Users,
  Search,
  Check,
  ArrowRight,
} from "lucide-react";

export function Services() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");

  const filteredServices =
    selectedCategory === "All Categories"
      ? servicesData
      : servicesData.filter((item) => item.category === selectedCategory);

  const renderIcon = (name: string) => {
    switch (name) {
      case "Megaphone":
        return <Megaphone size={22} />;
      case "Share2":
        return <Share2 size={22} />;
      case "Target":
        return <Target size={22} />;
      case "PenTool":
        return <PenTool size={22} />;
      case "Video":
        return <Video size={22} />;
      case "Newspaper":
        return <Newspaper size={22} />;
      case "Bot":
        return <Bot size={22} />;
      case "Globe":
        return <Globe size={22} />;
      case "Code2":
        return <Code2 size={22} />;
      case "MapPin":
        return <MapPin size={22} />;
      case "Users":
        return <Users size={22} />;
      case "Search":
        return <Search size={22} />;
      default:
        return <Globe size={22} />;
    }
  };

  return (
    <section id="services" className="services-section section-padding" aria-label="Our Agency Services">
      <div className="container">
        <div className="section-header reveal-on-scroll">
          <span className="section-tag">Agency Capabilities</span>
          <h2 className="section-title">
            Integrated services engineered for market leadership.
          </h2>
          <p className="section-subtitle">
            Comprehensive practices spanning growth marketing, cinematic production, bespoke software, and local visibility.
          </p>
        </div>

        {/* Category Filter Navigation */}
        <div className="category-filter-nav reveal-on-scroll reveal-delay-1" role="tablist" aria-label="Services categories filter">
          <button
            className={`category-tab-btn ${selectedCategory === "All Categories" ? "active" : ""}`}
            onClick={() => setSelectedCategory("All Categories")}
            role="tab"
            aria-selected={selectedCategory === "All Categories"}
          >
            All Services ({servicesData.length})
          </button>
          {serviceCategories.map((category) => (
            <button
              key={category}
              className={`category-tab-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
              role="tab"
              aria-selected={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Card Grid with key for smooth tab transition (never hides cards) */}
        <div key={selectedCategory} className="services-grid services-grid-fade">
          {filteredServices.map((service) => (
            <article key={service.id} className="service-card">
              <div className="service-card-top">
                <div className="service-icon-wrap" aria-hidden="true">
                  {renderIcon(service.iconName)}
                </div>
                <span className="service-category-pill">{service.category}</span>
              </div>

              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.shortDescription}</p>

              <ul className="service-features-list">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="service-feature-item">
                    <Check className="service-feature-check" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="service-card-footer">
                <Link
                  href={`/#quote?service=${encodeURIComponent(service.title)}`}
                  className="service-inquire-link"
                >
                  <span>Request Scope</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

