export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  city: string;
  state: string;
  country: string;
  locationDisplay: string;
  contactEmail: string;
  contactPhone: string;
  instagramUrl: string;
  linkedinUrl: string;
  statsPendingVerification: boolean;
  isDevelopmentContent: boolean;
}

export const siteConfig: SiteConfig = {
  name: "Digitalonix",
  tagline: "Creative & Digital Marketing Agency",
  description: "Digitalonix helps ambitious brands scale through creative marketing, digital strategy, and technology.",
  city: "Bhopal",
  state: "Madhya Pradesh",
  country: "India",
  locationDisplay: "Bhopal, Madhya Pradesh, India",
  contactEmail: "contact@digitalonix.in",
  contactPhone: "+91 98765 43210",
  instagramUrl: "https://www.instagram.com/digitalonix.in?mdxt=MXN4ZHN0NTJoM2kyeA%3D%3D",
  linkedinUrl: "https://linkedin.com/company/digitalonix",
  statsPendingVerification: false,
  isDevelopmentContent: false,
};
