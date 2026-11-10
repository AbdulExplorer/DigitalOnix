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
import { PublicShell } from "@/components/PublicShell";
import { AdminDataProvider } from "@/context/AdminDataContext";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Synchronously restore saved theme & typography before DOM paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var validThemes = ['modern', 'bold', 'editorial', 'corporate', 'futuristic'];
                  var saved = localStorage.getItem('digitalonix_theme');
                  var theme = (saved && validThemes.indexOf(saved) !== -1) ? saved : 'modern';
                  document.documentElement.setAttribute('data-theme', theme);

                  var fontStacks = {
                    'Space Grotesk': "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    'Sora': "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    'Playfair Display': "'Playfair Display', Georgia, 'Times New Roman', serif",
                    'Plus Jakarta Sans': "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    'Archivo': "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    'Inter': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    'DM Sans': "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    'Manrope': "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    'IBM Plex Sans': "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    'IBM Plex Mono': "'IBM Plex Mono', Menlo, Monaco, Consolas, monospace"
                  };

                  var hFont = localStorage.getItem('digitalonix_font_heading');
                  var bFont = localStorage.getItem('digitalonix_font_body');
                  var mFont = localStorage.getItem('digitalonix_font_mono');

                  if (hFont && fontStacks[hFont]) {
                    document.documentElement.style.setProperty('--font-heading', fontStacks[hFont]);
                  }
                  if (bFont && fontStacks[bFont]) {
                    document.documentElement.style.setProperty('--font-body', fontStacks[bFont]);
                  }
                  if (mFont && fontStacks[mFont]) {
                    document.documentElement.style.setProperty('--font-mono', fontStacks[mFont]);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <AdminDataProvider>
          <PublicShell>{children}</PublicShell>
        </AdminDataProvider>
      </body>
    </html>
  );
}
