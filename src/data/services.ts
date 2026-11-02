export interface ServiceItem {
  id: string;
  title: string;
  category: "Marketing & Growth" | "Creative Production" | "Technology" | "Local Visibility";
  shortDescription: string;
  detailedDescription: string;
  iconName: string;
  features: string[];
  deliverables: string[];
}

export const serviceCategories = [
  "Marketing & Growth",
  "Creative Production",
  "Technology",
  "Local Visibility",
] as const;

export const servicesData: ServiceItem[] = [
  // Marketing & Growth
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    category: "Marketing & Growth",
    shortDescription: "End-to-end multi-channel strategies engineered for organic reach and brand equity.",
    detailedDescription: "Comprehensive growth systems combining market research, inbound funnel architecture, SEO, and omnichannel execution tailored to your specific market segment.",
    iconName: "Megaphone",
    features: ["Market Segmentation", "SEO Architecture", "Conversion Funnels"],
    deliverables: ["Quarterly Growth Playbook", "Monthly ROI Dashboards", "Organic Traffic Optimization"],
  },
  {
    id: "social-media-management",
    title: "Social Media Management",
    category: "Marketing & Growth",
    shortDescription: "High-impact social narratives, daily community engagement, and brand positioning.",
    detailedDescription: "From visual grid curation to high-retention reel scripts and active community moderation, we transform passive followers into loyal brand advocates.",
    iconName: "Share2",
    features: ["Grid & Story Design", "Trend Capitalization", "Audience Engagement"],
    deliverables: ["Monthly Content Calendars", "Active Community Care", "Engagement Analytics"],
  },
  {
    id: "paid-advertising",
    title: "Paid Advertising",
    category: "Marketing & Growth",
    shortDescription: "Data-driven performance campaigns across Meta, Google Ads, and emerging channels.",
    detailedDescription: "High-conversion ad copy, creative A/B testing, pixel optimization, and surgical audience targeting focused strictly on lowering CAC and driving verifiable ROAS.",
    iconName: "Target",
    features: ["Meta & Google Ads", "Audience Retargeting", "Creative Split Testing"],
    deliverables: ["Custom Ad Creatives", "Live Budget Tracking", "CPA/ROAS Reporting"],
  },
  {
    id: "influencer-marketing",
    title: "Influencer Marketing",
    category: "Marketing & Growth",
    shortDescription: "Strategic creator partnerships, micro-influencer seeding, and brand ambassador campaigns.",
    detailedDescription: "Connect with audiences through creators they trust. We handle talent vetting, contract negotiation, creative brief coordination, and performance tracking to maximize engagement and authentic conversions.",
    iconName: "Users",
    features: ["Creator Discovery & Vetting", "Campaign Briefs & Management", "Performance & ROAS Attribution"],
    deliverables: ["Curated Creator Rosters", "High-Converting UGC Assets", "Campaign Reach & ROI Reporting"],
  },
  {
    id: "seo-optimization",
    title: "Search Engine Optimization (SEO)",
    category: "Marketing & Growth",
    shortDescription: "Organic rank dominance, high-intent keyword acquisition, and technical search authority.",
    detailedDescription: "Sustainable organic visibility that brings continuous, high-intent traffic to your brand. From comprehensive technical audits and on-page semantic architecture to high-authority backlink acquisition and content strategy.",
    iconName: "Search",
    features: ["Technical SEO Audits", "Keyword Architecture & Mapping", "Authority Link Building"],
    deliverables: ["Full Technical Audit Roadmap", "Keyword Ranking Dashboards", "Monthly Organic Traffic Growth"],
  },

  // Creative Production
  {
    id: "content-creation",
    title: "Content Creation",
    category: "Creative Production",
    shortDescription: "Bespoke copywriting, visual assets, and brand storytelling that captivate attention.",
    detailedDescription: "Words and graphics that stop the scroll. We craft authentic narratives that embody your brand identity while speaking directly to customer aspirations.",
    iconName: "PenTool",
    features: ["Brand Voice Strategy", "High-Converting Copy", "Graphic Asset Kits"],
    deliverables: ["Visual Asset Library", "Brand Copy Deck", "Content Templates"],
  },
  {
    id: "video-production",
    title: "Video Production",
    category: "Creative Production",
    shortDescription: "Cinematic commercial films, viral Reels, and high-retention brand video content.",
    detailedDescription: "Concept development, scripting, on-location shooting, and high-end post-production tailored for both vertical mobile screens and cinematic widescreen formats.",
    iconName: "Video",
    features: ["Script & Storyboarding", "4K Video Shooting", "Color Grading & Motion Graphics"],
    deliverables: ["Instagram Reels / YouTube Shorts", "Brand Commercials", "Product Showcase Videos"],
  },
  {
    id: "public-relations",
    title: "Public Relations",
    category: "Creative Production",
    shortDescription: "Strategic press distribution, digital media mentions, and executive thought leadership.",
    detailedDescription: "Securing authoritative features in top regional and national publications to bolster executive credibility and establish undeniable brand authority.",
    iconName: "Newspaper",
    features: ["Media Outlets Outreach", "Press Release Drafting", "Crisis Communications"],
    deliverables: ["Press Coverage Placements", "Thought Leadership Articles", "Media Kits"],
  },

  // Technology
  {
    id: "ai-automation",
    title: "AI Automation",
    category: "Technology",
    shortDescription: "Smart workflows, conversational AI agents, and lead nurturing automations.",
    detailedDescription: "Automate repetitive operational bottlenecks. We deploy intelligent conversational bots, CRM synching, automated appointment booking, and custom AI pipeline integrations.",
    iconName: "Bot",
    features: ["WhatsApp / Web AI Chatbots", "CRM Workflow Sync", "Lead Qualification Bots"],
    deliverables: ["Trained Custom AI Models", "Zapier/Make Automation Setup", "Automated Nurture Sequences"],
  },
  {
    id: "web-development",
    title: "Web Development",
    category: "Technology",
    shortDescription: "Ultra-fast, high-converting digital storefronts and bespoke web applications.",
    detailedDescription: "Engineered with modern frameworks like Next.js, external CSS architecture, lightning performance, and obsessive attention to mobile responsiveness and conversion UI.",
    iconName: "Globe",
    features: ["Next.js & React Core", "Core Web Vitals Optimization", "Conversion UI/UX"],
    deliverables: ["Production-Ready Website", "CMS Integration", "Technical SEO Foundations"],
  },
  {
    id: "software-development",
    title: "Software Development",
    category: "Technology",
    shortDescription: "Scalable SaaS platforms, custom portals, and secure enterprise web solutions.",
    detailedDescription: "Robust backend architectures, custom dashboard builds, API integrations, and tailored business software built to scale alongside your organization.",
    iconName: "Code2",
    features: ["Modern API Architecture", "Database Modeling", "Role-Based Portals"],
    deliverables: ["Custom Web Application", "API Documentation", "Source Code & Deployment"],
  },

  // Local Visibility
  {
    id: "google-business-profile",
    title: "Google Business Profile",
    category: "Local Visibility",
    shortDescription: "Local 3-Pack ranking dominance, review generation, and geographic search visibility.",
    detailedDescription: "Dominate local search in your immediate city and region. Full optimization of Google Business Profile, local citations, weekly geo-tagged posts, and review workflows.",
    iconName: "MapPin",
    features: ["Google 3-Pack Optimization", "Local Citation Building", "Review Strategy & Responses"],
    deliverables: ["Optimized GBP Listing", "Geo-Rank Grid Reports", "Automated Review Collection Kit"],
  },
];

