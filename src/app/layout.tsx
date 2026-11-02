import type { Metadata } from "next";

import "@/styles/variables.css";
import "@/styles/themes.css";
import "@/styles/theme-switcher.css";
import "@/styles/animations.css";
import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/hero.css";
import "@/styles/statistics.css";
import "@/styles/client-logos.css";
import "@/styles/testimonials.css";
import "@/styles/services.css";
import "@/styles/portfolio.css";
import "@/styles/founder.css";
import "@/styles/contact.css";
import "@/styles/footer.css";
import "@/styles/pages.css";

import { siteConfig } from "@/data/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline} in ${siteConfig.city}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Digital Marketing Agency Bhopal",
    "Creative Agency Bhopal",
    "Paid Advertising Meta Google Ads",
    "Video Production & Reels",
    "Social Media Management",
    "Web Development Bhopal",
    "AI Automation Agency",
    "Digitalonix",
  ],
  authors: [{ name: "Digitalonix Agency" }],
  creator: "Digitalonix",
  publisher: "Digitalonix",
  metadataBase: new URL("https://digitalonix.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://digitalonix.in",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Digitalonix Creative & Digital Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="modern" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        {/* Synchronously apply saved theme before DOM paint to avoid flashes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var validThemes = ['modern', 'bold', 'editorial', 'corporate', 'futuristic'];
                  var saved = localStorage.getItem('digitalonix_theme');
                  if (saved && validThemes.indexOf(saved) !== -1) {
                    document.documentElement.setAttribute('data-theme', saved);
                  } else {
                    document.documentElement.setAttribute('data-theme', 'modern');
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'modern');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <ThemeSwitcher />
      </body>
    </html>
  );
}
