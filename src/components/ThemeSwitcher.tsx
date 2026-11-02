"use client";

import React, { useState, useEffect, useRef } from "react";
import { Palette, X, Check, RotateCcw, Sparkles } from "lucide-react";
import { THEMES, DEFAULT_THEME_ID, ThemeConfig } from "@/data/themes";

const STORAGE_KEY = "digitalonix_theme";

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>(DEFAULT_THEME_ID);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Initialize theme from document or localStorage safely on mount
  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEY);
      const docTheme = document.documentElement.getAttribute("data-theme");
      const activeTheme = storedTheme || docTheme || DEFAULT_THEME_ID;

      if (THEMES.some((t) => t.id === activeTheme)) {
        setCurrentTheme(activeTheme);
        document.documentElement.setAttribute("data-theme", activeTheme);
      } else {
        setCurrentTheme(DEFAULT_THEME_ID);
        document.documentElement.setAttribute("data-theme", DEFAULT_THEME_ID);
      }
    } catch {
      // Fallback if localStorage is inaccessible
      setCurrentTheme(DEFAULT_THEME_ID);
    }
  }, []);

  // Handle outside clicks and ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectTheme = (themeId: ThemeConfig["id"]) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
      document.documentElement.setAttribute("data-theme", themeId);
    } catch {
      // Safely handle disabled localStorage
      document.documentElement.setAttribute("data-theme", themeId);
    }
  };

  const resetToDefault = () => {
    selectTheme(DEFAULT_THEME_ID);
  };

  const activeThemeConfig = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        className={`theme-trigger-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Explore Themes"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span className="theme-trigger-icon">
          <Palette size={18} aria-hidden="true" />
        </span>
        <span className="theme-trigger-label">
          {mounted ? activeThemeConfig.name.split(" ")[0] : "Theme"}
        </span>
      </button>

      {/* Floating Theme Selection Panel */}
      {isOpen && (
        <>
          <div
            className="theme-panel-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            className="theme-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="theme-panel-title"
          >
            {/* Header */}
            <div className="theme-panel-header">
              <div className="theme-panel-title-group">
                <span className="theme-panel-badge">
                  <Sparkles size={12} aria-hidden="true" />
                  Live Preview Mode
                </span>
                <h2 id="theme-panel-title" className="theme-panel-title">
                  Explore Themes
                </h2>
                <p className="theme-panel-subtitle">
                  Select a theme to live-switch typography, colors & accents
                </p>
              </div>
              <button
                type="button"
                className="theme-panel-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close themes panel"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Theme Selection Cards */}
            <div className="theme-list-scroll">
              {THEMES.map((theme) => {
                const isSelected = theme.id === currentTheme;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    className={`theme-option-card ${isSelected ? "active" : ""}`}
                    onClick={() => selectTheme(theme.id)}
                    aria-pressed={isSelected}
                  >
                    {/* Header: Name + Badge */}
                    <div className="theme-card-head">
                      <div className="theme-name-group">
                        <span className="theme-card-name">{theme.name}</span>
                        <span className="theme-card-type-tag">
                          {theme.category}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="theme-check-badge" aria-label="Currently active theme">
                          <Check size={12} strokeWidth={3} aria-hidden="true" />
                        </span>
                      )}
                    </div>

                    {/* Typography summary */}
                    <div className="theme-card-fonts">
                      <span className="theme-card-fonts-label">Typography:</span>
                      <span>
                        {theme.headingFont} + {theme.bodyFont}
                      </span>
                    </div>

                    {/* Aesthetic tagline */}
                    <p className="theme-card-tagline">{theme.tagline}</p>

                    {/* Swatches */}
                    <div className="theme-swatches-row" aria-label="Theme color palette">
                      {theme.swatches.map((swatch, idx) => (
                        <span
                          key={idx}
                          className="theme-swatch-circle"
                          style={{ backgroundColor: swatch }}
                          title={`Color ${swatch}`}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Panel Footer */}
            <div className="theme-panel-footer">
              <div className="theme-active-indicator">
                Active: <span className="theme-active-name">{activeThemeConfig.name}</span>
              </div>
              <button
                type="button"
                className="theme-reset-btn"
                onClick={resetToDefault}
                title="Reset back to Modern Premium theme"
              >
                <RotateCcw size={13} aria-hidden="true" />
                Reset Default
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

