export interface ThemeConfig {
  id: "modern" | "bold" | "editorial" | "corporate" | "futuristic";
  name: string;
  tagline: string;
  category: "dark" | "light";
  headingFont: string;
  bodyFont: string;
  accentFont?: string;
  colors: {
    bg: string;
    primary: string;
    secondary?: string;
    accent?: string;
    text: string;
    muted: string;
    border: string;
  };
  swatches: string[];
}

export const THEMES: ThemeConfig[] = [
  {
    id: "modern",
    name: "Modern Premium",
    tagline: "Premium dark agency aesthetic, bold headings, clean layouts",
    category: "dark",
    headingFont: "Space Grotesk",
    bodyFont: "Inter",
    colors: {
      bg: "#0D0D0F",
      primary: "#8B3DFF",
      secondary: "#5B21B6",
      text: "#FFFFFF",
      muted: "#A5A5B0",
      border: "#29252F",
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
    colors: {
      bg: "#111111",
      primary: "#A855F7",
      accent: "#C8FF3D",
      text: "#FAFAFA",
      muted: "#B5B5B5",
      border: "#303030",
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
    colors: {
      bg: "#F7F5F2",
      primary: "#51206F",
      secondary: "#8D4BB8",
      text: "#17151A",
      muted: "#716B75",
      border: "#E2DCE5",
    },
    swatches: ["#F7F5F2", "#51206F", "#8D4BB8", "#17151A"],
  },
  {
    id: "corporate",
    name: "Clean Corporate",
    tagline: "Clean, professional, approachable and business-focused",
    category: "light",
    headingFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    colors: {
      bg: "#FFFFFF",
      primary: "#7028B8",
      secondary: "#F4F0F8",
      text: "#17121D",
      muted: "#716B78",
      border: "#E5DFEA",
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
    accentFont: "IBM Plex Mono",
    colors: {
      bg: "#09090F",
      primary: "#5B21B6",
      secondary: "#A78BFA",
      text: "#F8F7FF",
      muted: "#A7A2B8",
      border: "#292437",
    },
    swatches: ["#09090F", "#5B21B6", "#A78BFA", "#F8F7FF"],
  },
];

export const DEFAULT_THEME_ID = "modern";

