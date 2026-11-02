"use client";

import React, { useState, useEffect, useRef } from "react";
import { Palette, X, Check, RotateCcw, Type, Paintbrush, Sliders } from "lucide-react";
import {
  THEMES,
  DEFAULT_THEME_ID,
  ThemeId,
  ThemeConfig,
  HEADING_FONTS,
  BODY_FONTS,
  MONO_FONTS,
  FONT_STACKS,
  PALETTE_ROLES,
} from "@/data/themes";

const STORAGE_THEME = "digitalonix_theme";
const STORAGE_HEADING = "digitalonix_font_heading";
const STORAGE_BODY = "digitalonix_font_body";
const STORAGE_MONO = "digitalonix_font_mono";

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"themes" | "fonts" | "colors">("themes");
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME_ID);
  const [headingFont, setHeadingFont] = useState<string>("Space Grotesk");
  const [bodyFont, setBodyFont] = useState<string>("Inter");
  const [monoFont, setMonoFont] = useState<string>("IBM Plex Mono");
  const [mounted, setMounted] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Synchronize on mount safely
  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = localStorage.getItem(STORAGE_THEME) as ThemeId | null;
      const validTheme = THEMES.some((t) => t.id === storedTheme)
        ? (storedTheme as ThemeId)
        : DEFAULT_THEME_ID;
      setThemeId(validTheme);

      const preset = THEMES.find((t) => t.id === validTheme) || THEMES[0];

      const storedHeading = localStorage.getItem(STORAGE_HEADING);
      const activeHeading = storedHeading && FONT_STACKS[storedHeading]
        ? storedHeading
        : preset.headingFont;
      setHeadingFont(activeHeading);

      const storedBody = localStorage.getItem(STORAGE_BODY);
      const activeBody = storedBody && FONT_STACKS[storedBody]
        ? storedBody
        : preset.bodyFont;
      setBodyFont(activeBody);

      const storedMono = localStorage.getItem(STORAGE_MONO);
      const activeMono = storedMono && FONT_STACKS[storedMono]
        ? storedMono
        : preset.monoFont;
      setMonoFont(activeMono);

      // Apply to document
      document.documentElement.setAttribute("data-theme", validTheme);
      document.documentElement.style.setProperty("--font-heading", FONT_STACKS[activeHeading]);
      document.documentElement.style.setProperty("--font-body", FONT_STACKS[activeBody]);
      document.documentElement.style.setProperty("--font-mono", FONT_STACKS[activeMono]);
    } catch {
      // Fallback
      setThemeId(DEFAULT_THEME_ID);
    }
  }, []);

  // Keyboard and outside click handlers
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

  // Select Preset Theme (Applies colors + preset default fonts)
  const selectTheme = (id: ThemeId) => {
    setThemeId(id);
    const preset = THEMES.find((t) => t.id === id) || THEMES[0];

    setHeadingFont(preset.headingFont);
    setBodyFont(preset.bodyFont);
    setMonoFont(preset.monoFont);

    document.documentElement.setAttribute("data-theme", id);
    document.documentElement.style.setProperty("--font-heading", FONT_STACKS[preset.headingFont]);
    document.documentElement.style.setProperty("--font-body", FONT_STACKS[preset.bodyFont]);
    document.documentElement.style.setProperty("--font-mono", FONT_STACKS[preset.monoFont]);

    try {
      localStorage.setItem(STORAGE_THEME, id);
      localStorage.setItem(STORAGE_HEADING, preset.headingFont);
      localStorage.setItem(STORAGE_BODY, preset.bodyFont);
      localStorage.setItem(STORAGE_MONO, preset.monoFont);
    } catch {}
  };

  // Change Heading Font independently
  const handleHeadingFontChange = (font: string) => {
    setHeadingFont(font);
    if (FONT_STACKS[font]) {
      document.documentElement.style.setProperty("--font-heading", FONT_STACKS[font]);
      try {
        localStorage.setItem(STORAGE_HEADING, font);
      } catch {}
    }
  };

  // Change Body Font independently
  const handleBodyFontChange = (font: string) => {
    setBodyFont(font);
    if (FONT_STACKS[font]) {
      document.documentElement.style.setProperty("--font-body", FONT_STACKS[font]);
      try {
        localStorage.setItem(STORAGE_BODY, font);
      } catch {}
    }
  };

  // Change Mono Font independently
  const handleMonoFontChange = (font: string) => {
    setMonoFont(font);
    if (FONT_STACKS[font]) {
      document.documentElement.style.setProperty("--font-mono", FONT_STACKS[font]);
      try {
        localStorage.setItem(STORAGE_MONO, font);
      } catch {}
    }
  };

  // Restore preset fonts for current theme
  const restorePresetFonts = () => {
    const preset = THEMES.find((t) => t.id === themeId) || THEMES[0];
    handleHeadingFontChange(preset.headingFont);
    handleBodyFontChange(preset.bodyFont);
    handleMonoFontChange(preset.monoFont);
  };

  // Reset Theme to default Modern Premium
  const resetTheme = () => {
    selectTheme(DEFAULT_THEME_ID);
  };

  // Reset All
  const resetAll = () => {
    selectTheme(DEFAULT_THEME_ID);
  };

  const activePreset = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const isCustomFonts =
    headingFont !== activePreset.headingFont ||
    bodyFont !== activePreset.bodyFont ||
    monoFont !== activePreset.monoFont;

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        className={`theme-trigger-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Theme & Typography Settings"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span className="theme-trigger-icon">
          <Palette size={18} aria-hidden="true" />
        </span>
        <span className="theme-trigger-label">
          {mounted ? activePreset.name.split(" ")[0] : "Theme"}
        </span>
      </button>

      {/* Floating Modal Panel */}
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
            aria-label="Theme & Font Customizer"
          >
            {/* Header */}
            <div className="theme-panel-header">
              <div className="theme-panel-title-row">
                <h2 className="theme-panel-title">Theme & Fonts</h2>
                <button
                  type="button"
                  className="theme-panel-close-btn"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close settings"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="theme-tabs-nav" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "themes"}
                  className={`theme-tab-btn ${activeTab === "themes" ? "active" : ""}`}
                  onClick={() => setActiveTab("themes")}
                >
                  <Sliders size={13} aria-hidden="true" />
                  Themes
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "fonts"}
                  className={`theme-tab-btn ${activeTab === "fonts" ? "active" : ""}`}
                  onClick={() => setActiveTab("fonts")}
                >
                  <Type size={13} aria-hidden="true" />
                  Fonts {isCustomFonts && <span className="tab-pill-dot" />}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "colors"}
                  className={`theme-tab-btn ${activeTab === "colors" ? "active" : ""}`}
                  onClick={() => setActiveTab("colors")}
                >
                  <Paintbrush size={13} aria-hidden="true" />
                  Colors
                </button>
              </div>
            </div>

            {/* Panel Body Content */}
            <div className="theme-panel-body">
              {/* TAB 1: THEMES */}
              {activeTab === "themes" && (
                <div className="theme-presets-list">
                  {THEMES.map((theme) => {
                    const isSelected = theme.id === themeId;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        className={`theme-option-card ${isSelected ? "active" : ""}`}
                        onClick={() => selectTheme(theme.id)}
                        aria-pressed={isSelected}
                      >
                        <div className="theme-card-head">
                          <div className="theme-name-group">
                            <span className="theme-card-name">{theme.name}</span>
                            <span className="theme-card-type-tag">{theme.category}</span>
                          </div>
                          {isSelected && (
                            <span className="theme-check-badge" aria-label="Selected">
                              <Check size={12} strokeWidth={3} aria-hidden="true" />
                            </span>
                          )}
                        </div>

                        <div className="theme-card-fonts">
                          {theme.headingFont} + {theme.bodyFont}
                        </div>

                        <div className="theme-swatches-row">
                          {theme.swatches.map((swatch, idx) => (
                            <span
                              key={idx}
                              className="theme-swatch-circle"
                              style={{ backgroundColor: swatch }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: FONTS */}
              {activeTab === "fonts" && (
                <div className="theme-font-controls">
                  {/* Status header */}
                  <div className="font-status-bar">
                    <span className="font-status-label">
                      {isCustomFonts ? "Customized Fonts" : `Default: ${activePreset.name}`}
                    </span>
                    {isCustomFonts && (
                      <button
                        type="button"
                        className="font-restore-inline-btn"
                        onClick={restorePresetFonts}
                      >
                        Restore Defaults
                      </button>
                    )}
                  </div>

                  {/* Dropdowns */}
                  <div className="font-select-group">
                    <label htmlFor="heading-font-select" className="font-select-label">
                      Heading Font
                    </label>
                    <select
                      id="heading-font-select"
                      className="font-select-input"
                      value={headingFont}
                      onChange={(e) => handleHeadingFontChange(e.target.value)}
                    >
                      {HEADING_FONTS.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="font-select-group">
                    <label htmlFor="body-font-select" className="font-select-label">
                      Body Font
                    </label>
                    <select
                      id="body-font-select"
                      className="font-select-input"
                      value={bodyFont}
                      onChange={(e) => handleBodyFontChange(e.target.value)}
                    >
                      {BODY_FONTS.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="font-select-group">
                    <label htmlFor="mono-font-select" className="font-select-label">
                      Technical / Label Font
                    </label>
                    <select
                      id="mono-font-select"
                      className="font-select-input"
                      value={monoFont}
                      onChange={(e) => handleMonoFontChange(e.target.value)}
                    >
                      {MONO_FONTS.map((font) => (
                        <option key={font} value={font}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Live Typography Preview Area */}
                  <div className="typo-preview-card">
                    <div
                      className="typo-preview-heading"
                      style={{ fontFamily: FONT_STACKS[headingFont] }}
                    >
                      Digital Agency Heading
                    </div>
                    <p
                      className="typo-preview-body"
                      style={{ fontFamily: FONT_STACKS[bodyFont] }}
                    >
                      High-impact performance marketing, full-funnel strategy, and digital experiences.
                    </p>
                    <div className="typo-preview-row">
                      <span
                        className="typo-preview-btn"
                        style={{ fontFamily: FONT_STACKS[bodyFont] }}
                      >
                        Action Button
                      </span>
                      <span
                        className="typo-preview-mono"
                        style={{ fontFamily: FONT_STACKS[monoFont] }}
                      >
                        METRIC // 98.4%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COLORS */}
              {activeTab === "colors" && (
                <div className="theme-color-palette">
                  <div className="palette-grid">
                    {PALETTE_ROLES.map(({ key, label }) => {
                      const hex = activePreset.colors[key];
                      return (
                        <div key={key} className="palette-role-item">
                          <span
                            className="palette-role-swatch"
                            style={{ backgroundColor: hex }}
                          />
                          <div className="palette-role-info">
                            <span className="palette-role-label">{label}</span>
                            <span className="palette-role-hex">{hex}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="theme-panel-footer">
              <div className="footer-button-row">
                <button
                  type="button"
                  className="theme-footer-btn"
                  onClick={resetTheme}
                  title="Reset to default Modern Premium theme"
                >
                  <RotateCcw size={12} aria-hidden="true" />
                  Reset Theme
                </button>
                <button
                  type="button"
                  className="theme-footer-btn"
                  onClick={restorePresetFonts}
                  title="Restore active theme's preset fonts"
                >
                  Reset Fonts
                </button>
                <button
                  type="button"
                  className="theme-footer-btn highlight"
                  onClick={resetAll}
                  title="Reset both theme and typography to defaults"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
