export interface SemanticColors {
  bg: string;
  bgPrimary: string;
  bgSecondary: string;
  card: string;
  cardElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  secondary: string;
  accent: string;
  buttonBg: string;
  buttonText: string;
  buttonSecondaryBg: string;
  buttonSecondaryText: string;
  buttonHover: string;
  border: string;
  inputBg: string;
  inputText: string;
  inputBorder: string;
  navbar: string;
  footer: string;
  link: string;
  linkHover: string;
  badgeBg: string;
  badgeText: string;
  focusRing: string;
}

export type ThemeId = "modern" | "bold" | "editorial" | "corporate" | "futuristic";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  category: "dark" | "light";
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  colors: SemanticColors;
  swatches: string[];
}

export const HEADING_FONTS = [
  "Space Grotesk",
  "Sora",
  "Playfair Display",
  "Plus Jakarta Sans",
  "Archivo",
  "Inter",
  "DM Sans",
  "Manrope",
  "IBM Plex Sans",
] as const;

export const BODY_FONTS = [
  "Inter",
  "DM Sans",
  "Manrope",
  "Plus Jakarta Sans",
  "IBM Plex Sans",
  "Space Grotesk",
  "Sora",
  "Archivo",
] as const;

export const MONO_FONTS = [
  "IBM Plex Mono",
  "IBM Plex Sans",
  "Inter",
  "DM Sans",
] as const;

export const FONT_STACKS: Record<string, string> = {
  "Space Grotesk": "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "Sora": "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "Playfair Display": "'Playfair Display', Georgia, 'Times New Roman', serif",
  "Plus Jakarta Sans": "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "Archivo": "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "Inter": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "DM Sans": "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "Manrope": "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "IBM Plex Sans": "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "IBM Plex Mono": "'IBM Plex Mono', Menlo, Monaco, Consolas, monospace",
};

export const THEMES: ThemeConfig[] = [
  {
    id: "modern",
    name: "Modern Premium",
    tagline: "Dark agency aesthetic, bold headings, clean layouts",
    category: "dark",
    headingFont: "Space Grotesk",
    bodyFont: "Inter",
    monoFont: "IBM Plex Mono",
    colors: {
      bg: "#0D0D0F",
      bgPrimary: "#0D0D0F",
      bgSecondary: "#15131A",
      card: "#141219",
      cardElevated: "#1B1822",
      text: "#FFFFFF",
      textSecondary: "#A5A5B0",
      textMuted: "#72707D",
      primary: "#8B3DFF",
      secondary: "#5B21B6",
      accent: "#A364FF",
      buttonBg: "#8B3DFF",
      buttonText: "#FFFFFF",
      buttonSecondaryBg: "#1B1822",
      buttonSecondaryText: "#FFFFFF",
      buttonHover: "#7A28F5",
      border: "#29252F",
      inputBg: "#141219",
      inputText: "#FFFFFF",
      inputBorder: "#29252F",
      navbar: "rgba(13, 13, 15, 0.88)",
      footer: "#0A0A0C",
      link: "#A5A5B0",
      linkHover: "#FFFFFF",
      badgeBg: "#1B1822",
      badgeText: "#A364FF",
      focusRing: "#8B3DFF",
    },
    swatches: ["#0D0D0F", "#8B3DFF", "#5B21B6", "#FFFFFF"],
  },
  {
    id: "bold",
    name: "Bold Creative",
    tagline: "Oversized typography, energetic layouts & lime accents",
    category: "dark",
    headingFont: "Sora",
    bodyFont: "DM Sans",
    monoFont: "IBM Plex Mono",
    colors: {
      bg: "#111111",
      bgPrimary: "#111111",
      bgSecondary: "#191919",
      card: "#171717",
      cardElevated: "#222222",
      text: "#FAFAFA",
      textSecondary: "#B5B5B5",
      textMuted: "#7A7A7A",
      primary: "#A855F7",
      secondary: "#7E22CE",
      accent: "#C8FF3D",
      buttonBg: "#A855F7",
      buttonText: "#FAFAFA",
      buttonSecondaryBg: "#1F1F1F",
      buttonSecondaryText: "#FAFAFA",
      buttonHover: "#9333EA",
      border: "#303030",
      inputBg: "#181818",
      inputText: "#FAFAFA",
      inputBorder: "#303030",
      navbar: "rgba(17, 17, 17, 0.90)",
      footer: "#0B0B0B",
      link: "#B5B5B5",
      linkHover: "#C8FF3D",
      badgeBg: "rgba(200, 255, 61, 0.12)",
      badgeText: "#C8FF3D",
      focusRing: "#C8FF3D",
    },
    swatches: ["#111111", "#A855F7", "#C8FF3D", "#FAFAFA"],
  },
  {
    id: "editorial",
    name: "Editorial & Sophisticated",
    tagline: "Elegant serif headings, generous whitespace & refined layouts",
    category: "light",
    headingFont: "Playfair Display",
    bodyFont: "Manrope",
    monoFont: "IBM Plex Mono",
    colors: {
      bg: "#F7F5F2",
      bgPrimary: "#F7F5F2",
      bgSecondary: "#EFECE6",
      card: "#FFFFFF",
      cardElevated: "#FAF8F5",
      text: "#17151A",
      textSecondary: "#716B75",
      textMuted: "#958E9B",
      primary: "#51206F",
      secondary: "#8D4BB8",
      accent: "#8D4BB8",
      buttonBg: "#51206F",
      buttonText: "#FFFFFF",
      buttonSecondaryBg: "#EFECE6",
      buttonSecondaryText: "#17151A",
      buttonHover: "#3E1557",
      border: "#E2DCE5",
      inputBg: "#FFFFFF",
      inputText: "#17151A",
      inputBorder: "#E2DCE5",
      navbar: "rgba(247, 245, 242, 0.92)",
      footer: "#EAE6DF",
      link: "#716B75",
      linkHover: "#51206F",
      badgeBg: "#EFECE6",
      badgeText: "#51206F",
      focusRing: "#51206F",
    },
    swatches: ["#F7F5F2", "#51206F", "#8D4BB8", "#17151A"],
  },
  {
    id: "corporate",
    name: "Clean Corporate",
    tagline: "Clean, professional, approachable & business-focused",
    category: "light",
    headingFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    monoFont: "IBM Plex Mono",
    colors: {
      bg: "#FFFFFF",
      bgPrimary: "#FFFFFF",
      bgSecondary: "#F4F0F8",
      card: "#FFFFFF",
      cardElevated: "#F9F7FC",
      text: "#17121D",
      textSecondary: "#716B78",
      textMuted: "#928C99",
      primary: "#7028B8",
      secondary: "#521A88",
      accent: "#8E3CE0",
      buttonBg: "#7028B8",
      buttonText: "#FFFFFF",
      buttonSecondaryBg: "#F4F0F8",
      buttonSecondaryText: "#17121D",
      buttonHover: "#5E1D9E",
      border: "#E5DFEA",
      inputBg: "#FFFFFF",
      inputText: "#17121D",
      inputBorder: "#E5DFEA",
      navbar: "rgba(255, 255, 255, 0.94)",
      footer: "#F4EFF9",
      link: "#716B78",
      linkHover: "#7028B8",
      badgeBg: "#F4F0F8",
      badgeText: "#7028B8",
      focusRing: "#7028B8",
    },
    swatches: ["#FFFFFF", "#7028B8", "#F4F0F8", "#17121D"],
  },
  {
    id: "futuristic",
    name: "Futuristic Tech",
    tagline: "Dark violet surfaces, restrained gradients & tech typography",
    category: "dark",
    headingFont: "Space Grotesk",
    bodyFont: "IBM Plex Sans",
    monoFont: "IBM Plex Mono",
    colors: {
      bg: "#09090F",
      bgPrimary: "#09090F",
      bgSecondary: "#13121E",
      card: "#100F1A",
      cardElevated: "#171524",
      text: "#F8F7FF",
      textSecondary: "#A7A2B8",
      textMuted: "#6E6982",
      primary: "#5B21B6",
      secondary: "#43148F",
      accent: "#A78BFA",
      buttonBg: "#5B21B6",
      buttonText: "#F8F7FF",
      buttonSecondaryBg: "#171524",
      buttonSecondaryText: "#F8F7FF",
      buttonHover: "#6D28D9",
      border: "#292437",
      inputBg: "#100F1A",
      inputText: "#F8F7FF",
      inputBorder: "#292437",
      navbar: "rgba(9, 9, 15, 0.92)",
      footer: "#07070B",
      link: "#A7A2B8",
      linkHover: "#A78BFA",
      badgeBg: "#171524",
      badgeText: "#A78BFA",
      focusRing: "#A78BFA",
    },
    swatches: ["#09090F", "#5B21B6", "#A78BFA", "#F8F7FF"],
  },
];

export const PALETTE_ROLES: { key: keyof SemanticColors; label: string }[] = [
  { key: "bg", label: "Page background" },
  { key: "bgSecondary", label: "Section background" },
  { key: "card", label: "Card background" },
  { key: "text", label: "Primary text" },
  { key: "textSecondary", label: "Secondary text" },
  { key: "primary", label: "Primary brand" },
  { key: "secondary", label: "Secondary brand" },
  { key: "accent", label: "Accent color" },
  { key: "border", label: "Border color" },
  { key: "buttonBg", label: "Primary button" },
];

export const DEFAULT_THEME_ID: ThemeId = "modern";
