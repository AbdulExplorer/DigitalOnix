# Digitalonix — Creative & Digital Marketing Agency Website

A high-performance, production-ready website built for **Digitalonix**, a creative and digital marketing agency based in Bhopal, India.

---

## Architecture & Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React Server Components by default)
- **Styling**: Pure External CSS architecture with CSS Custom Properties design system tokens (**Zero Tailwind CSS**, no runtime styling overhead)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms & API**: Secure Next.js App Router API route (`/api/quote`) with spam protection (honeypot) and server-side validation
- **SEO & Social**: Next.js Metadata API, dynamic Open Graph tags, `sitemap.xml`, and `robots.txt`

---

## Directory Structure

```
Digital Onix/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── quote/route.ts      # Server-side quote submission handler
│   │   ├── about/page.tsx          # Dedicated About Agency & heritage page
│   │   ├── portfolio/page.tsx      # Filterable work & case studies page
│   │   ├── services/page.tsx       # In-depth 10 services breakdown page
│   │   ├── layout.tsx              # Root layout with SEO and shared nav
│   │   ├── page.tsx                # Homepage with ordered sections
│   │   ├── robots.ts               # Dynamic robots.txt generator
│   │   └── sitemap.ts              # Dynamic XML sitemap generator
│   │
│   ├── components/
│   │   ├── Header.tsx              # Accessible navbar with mobile drawer
│   │   ├── Hero.tsx                # Auto-rotating headline statement hero
│   │   ├── Statistics.tsx          # Animated number counters
│   │   ├── ClientLogos.tsx         # Seamless infinite horizontal marquee (30 logos)
│   │   ├── Testimonials.tsx        # 5-card carousel with touch/keyboard support
│   │   ├── Services.tsx            # Categorized card grid with 10 services
│   │   ├── Portfolio.tsx           # Results / Production / Designing tabs & modal
│   │   ├── Founder.tsx             # Editorial leadership & agency approach
│   │   ├── ContactForm.tsx         # Validated lead intake form
│   │   ├── Footer.tsx              # Dark agency footer with Bhopal coordinates
│   │   └── DevNoticeBanner.tsx     # Toggleable dev mode disclaimer banner
│   │
│   ├── data/
│   │   ├── config.ts               # Central agency contact info & settings
│   │   ├── stats.ts                # Client statistics (1,000+ projects, ₹10L+ ads)
│   │   ├── services.ts             # 10 services grouped into 4 categories
│   │   ├── clients.ts              # 30 brand placeholder logos
│   │   ├── testimonials.ts         # Testimonial reviews
│   │   ├── portfolio.ts            # Case studies, videos, and design items
│   │   └── founder.ts              # Founder bio, approach, and portrait details
│   │
│   └── styles/
│       ├── variables.css           # Brand tokens, colors, radii, shadows, spacing
│       ├── globals.css             # Resets, typography, utilities, reduced-motion
│       ├── animations.css          # Marquee, headline transitions, glow keyframes
│       ├── header.css              # Navigation and mobile slideout styling
│       ├── hero.css                # Hero composition and CLS-protected headline
│       ├── statistics.css          # Intro statement and counter cards
│       ├── client-logos.css        # Infinite looping marquee CSS
│       ├── testimonials.css        # Responsive carousel tracks and indicators
│       ├── services.css            # Services category filters and card grid
│       ├── portfolio.css           # Portfolio tabs, metric ribbons, and modal
│       ├── founder.css             # Editorial portrait and quote layout
│       ├── contact.css             # Conversion form, inputs, and validation states
│       ├── footer.css              # Dark footer coordinates and links
│       └── pages.css               # Subpage heroes, process timeline, value cards
```

---

## Design System Tokens

The primary palette is defined in `src/styles/variables.css`:

```css
:root {
  --brand-purple: #781DB5;
  --brand-purple-dark: #541080;
  --background: #0D0F12;
  --surface: #15131A;
  --surface-hover: #201629;
  --text-primary: #FFFFFF;
  --text-secondary: #A6A1AD;
  --border: #29252F;
  --gradient-brand: linear-gradient(135deg, #781DB5 0%, #541080 100%);
}
```

---

## Content Replacement Guide (Switching from Dev to Production)

All dynamic copy, assets, and claims are isolated within `src/data/`:

1. **Brand & Contact Info**: Edit `src/data/config.ts` to update email, phone, location, and set `isDevelopmentContent: false` when ready.
2. **Client Logos**: In `src/data/clients.ts`, replace the placeholder geometric logos with SVG files or client marks.
3. **Verified Statistics**: In `src/data/stats.ts`, adjust the values and set `statsPendingVerification: false` once audited.
4. **Testimonials**: In `src/data/testimonials.ts`, replace placeholder quotes with approved client quotes.
5. **Portfolio Projects**: In `src/data/portfolio.ts`, add verified case studies, video links, or design deliverables.
6. **Founder Information**: In `src/data/founder.ts`, insert the founder's official photograph, name, bio, and LinkedIn URL.
7. **Email Provider Setup**: In `src/app/api/quote/route.ts`, wire up your preferred provider (e.g. Resend, SendGrid, or Nodemailer) to deliver incoming inquiries directly to your inbox.

---

## Local Development & Production Build

```bash
# Run local dev server
npm run dev

# Run production build (typecheck, lint & static page generation)
npm run build

# Start production server
npm run start
```

