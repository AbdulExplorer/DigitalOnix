export interface TestimonialItem {
  id: string;
  clientIdentifier: string;
  rolePlaceholder: string;
  placeholderQuote: string;
  serviceCategory: string;
}

export const testimonialsData: TestimonialItem[] = [
  {
    id: "testimonial-01",
    clientIdentifier: "Retail Brand Partner",
    rolePlaceholder: "Managing Director",
    placeholderQuote:
      "Digitalonix revamped our complete social presence and advertising funnel. Campaign response rates improved noticeably within the initial 90 days.",
    serviceCategory: "Paid Advertising & Social Media",
  },
  {
    id: "testimonial-02",
    clientIdentifier: "Healthcare & Diagnostics",
    rolePlaceholder: "Director of Operations",
    placeholderQuote:
      "The local visibility program and Google Business Profile management brought steady appointment inquiries consistently month-over-month.",
    serviceCategory: "Local Visibility & GBP",
  },
  {
    id: "testimonial-03",
    clientIdentifier: "Education Institute",
    rolePlaceholder: "Head of Marketing",
    placeholderQuote:
      "Their creative team produced high-energy video content and Reels that resonated with our core audience and elevated our brand perception.",
    serviceCategory: "Video Production & Content",
  },
  {
    id: "testimonial-04",
    clientIdentifier: "Real Estate Developers",
    rolePlaceholder: "Principal Partner",
    placeholderQuote:
      "From bespoke brand collateral to disciplined Meta lead generation, Digitalonix demonstrated strong execution speed and clear reporting metrics.",
    serviceCategory: "Digital Marketing & Creatives",
  },
  {
    id: "testimonial-05",
    clientIdentifier: "Lifestyle & Apparel",
    rolePlaceholder: "Co-Founder",
    placeholderQuote:
      "The performance ad creatives and website overhaul significantly lowered our customer acquisition cost while preserving premium brand positioning.",
    serviceCategory: "Web Development & Paid Media",
  },
];
