export type PortfolioCategory = "Results" | "Production" | "Designing";

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  subcategory: string;
  clientLabel: string;
  summary: string;
  objective?: string;
  strategy?: string;
  metrics?: { label: string; value: string }[];
  accentColor?: string;
  mediaType: "image" | "video";
  videoDuration?: string;
  aspectRatio: "16/9" | "9/16" | "4/5" | "1/1";
}

export const portfolioCategories: PortfolioCategory[] = [
  "Results",
  "Production",
  "Designing",
];

export const portfolioItems: PortfolioItem[] = [
  // --- RESULTS CATEGORY ---
  {
    id: "res-01",
    title: "Performance Meta Funnel",
    category: "Results",
    subcategory: "Paid Advertising & Leads",
    clientLabel: "Regional Healthcare Network",
    summary: "Restructured ad campaigns with dynamic creative testing and localized vernacular copy.",
    objective: "Lower cost-per-lead while scaling monthly patient bookings across Madhya Pradesh.",
    strategy: "Implemented multi-angle video testimonials and automated instant qualification funnels.",
    metrics: [
      { label: "Lead Volume", value: "+148%" },
      { label: "Cost Per Lead", value: "-38%" },
      { label: "Target ROAS", value: "4.2x" },
    ],
    accentColor: "#781DB5",
    mediaType: "image",
    aspectRatio: "16/9",
  },
  {
    id: "res-02",
    title: "Omnichannel D2C Brand Scale",
    category: "Results",
    subcategory: "E-Commerce Growth",
    clientLabel: "Apparel & Lifestyle",
    summary: "High-velocity ad creatives and optimized purchase funnels driving initial revenue surge.",
    objective: "Establish direct-to-consumer brand awareness and reach profitable first-order unit economics.",
    strategy: "High-cadence creative testing (15+ variants/week) and remarketing pixel optimization.",
    metrics: [
      { label: "Monthly Orders", value: "3,200+" },
      { label: "ROAS Achieved", value: "3.6x" },
      { label: "Conversion Rate", value: "2.85%" },
    ],
    accentColor: "#9333ea",
    mediaType: "image",
    aspectRatio: "16/9",
  },
  {
    id: "res-03",
    title: "Regional Local Search Dominance",
    category: "Results",
    subcategory: "Local SEO & Visibility",
    clientLabel: "Hospitality & Dining",
    summary: "Local 3-pack dominance across Bhopal and central regional search keywords.",
    objective: "Drive walk-in customer foot traffic and table reservations through organic Google Maps visibility.",
    strategy: "Geo-tagged photo optimizations, structured review gathering campaigns, and citation audits.",
    metrics: [
      { label: "Maps Direction Clicks", value: "+210%" },
      { label: "Phone Inquiries", value: "+175%" },
      { label: "Search Ranking", value: "Top 3" },
    ],
    accentColor: "#781DB5",
    mediaType: "image",
    aspectRatio: "16/9",
  },

  // --- PRODUCTION CATEGORY ---
  {
    id: "prod-01",
    title: "Kinetic Brand Anthem Reel",
    category: "Production",
    subcategory: "Reels & Short-Form",
    clientLabel: "Fitness & Wellness",
    summary: "High-energy vertical video shoot highlighting training, community energy, and athletic spaces.",
    accentColor: "#541080",
    mediaType: "video",
    videoDuration: "0:30",
    aspectRatio: "9/16",
  },
  {
    id: "prod-02",
    title: "Commercial Film & Product Launch",
    category: "Production",
    subcategory: "Commercial Film",
    clientLabel: "Consumer Goods",
    summary: "Studio product lighting, macro texture capture, and sound design tailored for digital spots.",
    accentColor: "#781DB5",
    mediaType: "video",
    videoDuration: "1:15",
    aspectRatio: "16/9",
  },
  {
    id: "prod-03",
    title: "Founder Vision Documentary",
    category: "Production",
    subcategory: "Brand Narrative",
    clientLabel: "Logistics Enterprise",
    summary: "Intimate interview-style visual storytelling portraying operational scale and mission.",
    accentColor: "#3b0764",
    mediaType: "video",
    videoDuration: "2:45",
    aspectRatio: "16/9",
  },
  {
    id: "prod-04",
    title: "Viral Motion Sequence",
    category: "Production",
    subcategory: "Instagram Campaign",
    clientLabel: "Jewellery & Lifestyle",
    summary: "Fast-paced montage highlighting bridal collections with synchronized audio transitions.",
    accentColor: "#6b21a8",
    mediaType: "video",
    videoDuration: "0:25",
    aspectRatio: "9/16",
  },

  // --- DESIGNING CATEGORY ---
  {
    id: "des-01",
    title: "Brand Identity System",
    category: "Designing",
    subcategory: "Identity & Typography",
    clientLabel: "FinTech Startup",
    summary: "Typography hierarchy, bespoke logo mark, color psychology, and comprehensive brand guide.",
    accentColor: "#781DB5",
    mediaType: "image",
    aspectRatio: "4/5",
  },
  {
    id: "des-02",
    title: "High-Conversion Meta Ad Deck",
    category: "Designing",
    subcategory: "Ad Creative Design",
    clientLabel: "Real Estate Developers",
    summary: "Scroll-stopping social ad banners featuring architectural 3D renders and clear value anchors.",
    accentColor: "#541080",
    mediaType: "image",
    aspectRatio: "1/1",
  },
  {
    id: "des-03",
    title: "Curated Social Grid Archetypes",
    category: "Designing",
    subcategory: "Social Media Aesthetics",
    clientLabel: "Artisan Cafe",
    summary: "Harmonious visual Instagram grid layout combining typography quotes and product spotlights.",
    accentColor: "#8b5cf6",
    mediaType: "image",
    aspectRatio: "1/1",
  },
  {
    id: "des-04",
    title: "Event Branding Collateral",
    category: "Designing",
    subcategory: "Print & Environmental",
    clientLabel: "Regional Summit",
    summary: "Stage backdrops, attendee lanyards, entrance arches, and promotional standees.",
    accentColor: "#781DB5",
    mediaType: "image",
    aspectRatio: "4/5",
  },
];
