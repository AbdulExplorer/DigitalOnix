export type ProjectCategory = "Results" | "Production" | "Designing";
export type ProjectStatus = "published" | "draft";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface AdminProject {
  id: string;
  title: string;
  category: ProjectCategory;
  subcategory: string;
  client: string;
  clientLabel: string;
  summary: string;
  description?: string;
  projectUrl?: string;
  status: ProjectStatus;
  mediaType: "image" | "video";
  videoDuration?: string;
  aspectRatio: "16/9" | "9/16" | "4/5" | "1/1";
  accentColor?: string;
  thumbnailUrl?: string;
  galleryUrls?: string[];
  metrics?: ProjectMetric[];
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory =
  | "Marketing & Growth"
  | "Creative Production"
  | "Technology"
  | "Local Visibility";

export interface AdminService {
  id: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  detailedDescription: string;
  iconName: string;
  features: string[];
  deliverables: string[];
  status: "active" | "draft";
  order?: number;
}

export interface AdminTestimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  rating: number; // 1 to 5
  status: "published" | "pending";
  videoUrl?: string;
  createdAt: string;
}

export interface AdminClient {
  id: string;
  name: string;
  industry: string;
  symbol: "hexagon" | "diamond" | "circle-nodes" | "rings" | "triangle" | "cross" | "wave" | "cube";
  websiteUrl?: string;
  logoUrl?: string;
  status: "active" | "inactive";
}

export type EnquiryStatus = "new" | "contacted" | "completed";

export interface AdminEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: EnquiryStatus;
  submittedAt: string;
  notes?: string;
}

export interface AdminSiteContent {
  hero: {
    headlinePrefix: string;
    dynamicLines: string[];
    subtitle: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  stats: {
    projectsDelivered: string;
    clientsServed: string;
    metaAdSpend: string;
    experienceYears?: string;
    adSpendManaged?: string;
    averageRoas?: string;
  };
  cta: {
    heading: string;
    subtitle: string;
    buttonText: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    instagramUrl: string;
    linkedinUrl: string;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "Super Admin" | "Marketing Lead" | "Content Editor";
  avatarUrl?: string;
  lastLogin?: string;
}

