// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useAdminData } from "@/context/AdminDataContext";
// import { ArrowRight } from "lucide-react";

// export function Hero() {
//   const { content } = useAdminData();
//   const heroData = content.hero;

//   const dynamicPhrases =
//     heroData.dynamicLines && heroData.dynamicLines.length > 0
//       ? heroData.dynamicLines.map((line) => {
//         const parts = line.split(" ");
//         if (parts.length > 1) {
//           return {
//             prefix: parts.slice(0, -1).join(" ") + " ",
//             highlight: parts[parts.length - 1],
//           };
//         }
//         return { prefix: "", highlight: line };
//       })
//       : [
//         { prefix: "brands ", highlight: "stand out." },
//         { prefix: "creativity ", highlight: "work." },
//         { prefix: "brands ", highlight: "grow." },
//       ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
//     if (mediaQuery.matches) {
//       return;
//     }

//     const interval = setInterval(() => {
//       setIsTransitioning(true);
//       setTimeout(() => {
//         setCurrentIndex((prev) => (prev + 1) % dynamicPhrases.length);
//         setIsTransitioning(false);
//       }, 350);
//     }, 3800);

//     return () => clearInterval(interval);
//   }, [dynamicPhrases.length]);

//   const currentStatement = dynamicPhrases[currentIndex] || dynamicPhrases[0];

//   return (
//     <section className="hero-section" data-antigravity-visible="true" aria-label="Digitalonix Agency Hero">
//       <div className="hero-glow-blob" aria-hidden="true" />

//       <div className="container hero-content">
//         {/* Stable Headline Container with Dynamic Second Line */}
//         <div className="hero-headline-wrapper">
//           <h1 className="hero-headline">
//             <span className="hero-static-prefix">{heroData.headlinePrefix || "We Make"}</span>
//             <span className="hero-dynamic-slot">
//               <span
//                 key={currentIndex}
//                 className={`hero-dynamic-phrase ${isTransitioning ? "headline-exiting" : "headline-active"
//                   }`}
//               >
//                 <span>{currentStatement.prefix}</span>
//                 <span className="hero-headline-accent">{currentStatement.highlight}</span>
//               </span>
//             </span>
//           </h1>

//           <noscript>
//             <h1 className="hero-headline noscript-headline">
//               <span className="hero-static-prefix">{heroData.headlinePrefix || "We Make"}</span>
//               <span className="hero-dynamic-slot">
//                 <span>brands </span>
//                 <span className="hero-headline-accent">stand out &amp; grow.</span>
//               </span>
//             </h1>
//           </noscript>
//         </div>

//         {/* Clean, Concise Supporting Copy */}
//         <p className="hero-description">
//           {heroData.subtitle || "Digitalonix helps businesses grow through creative marketing, digital strategy, and technology."}
//         </p>

//         {/* Primary & Secondary CTAs */}
//         <div className="hero-cta-group">
//           <Link href="/#quote" className="btn btn-primary">
//             <span>{heroData.primaryCtaText || "Get a Quote"}</span>
//             <ArrowRight size={17} />
//           </Link>

//           <Link href="/portfolio" className="btn btn-secondary">
//             <span>{heroData.secondaryCtaText || "Explore Our Work"}</span>
//             <ArrowRight size={15} />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminData } from "@/context/AdminDataContext";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const { content } = useAdminData();
  const heroData = content.hero;

  // EXISTING DYNAMIC TEXT LOGIC — PRESERVED
  const dynamicPhrases =
    heroData.dynamicLines && heroData.dynamicLines.length > 0
      ? heroData.dynamicLines.map((line) => {
        const parts = line.split(" ");
        if (parts.length > 1) {
          return {
            prefix: parts.slice(0, -1).join(" ") + " ",
            highlight: parts[parts.length - 1],
          };
        }
        return { prefix: "", highlight: line };
      })
      : [
        { prefix: "brands ", highlight: "stand out." },
        { prefix: "creativity ", highlight: "work." },
        { prefix: "brands ", highlight: "grow." },
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // EXISTING TEXT CHANGING MECHANISM — PRESERVED
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (mediaQuery.matches) {
      return;
    }

    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex(
          (prev) => (prev + 1) % dynamicPhrases.length
        );
        setIsTransitioning(false);
      }, 350);
    }, 3800);

    return () => clearInterval(interval);
  }, [dynamicPhrases.length]);

  const currentStatement =
    dynamicPhrases[currentIndex] || dynamicPhrases[0];

  return (
    <section
      className="hero-section"
      data-antigravity-visible="true"
      aria-label="Digitalonix Agency Hero"
    >
      <div className="container hero-content">

        {/* LEFT SIDE: EXISTING HERO CONTENT */}
        <div className="hero-copy">

          <div className="hero-headline-wrapper">
            <h1 className="hero-headline">

              <span className="hero-static-prefix">
                {heroData.headlinePrefix || "We Make"}
              </span>

              <span className="hero-dynamic-slot">
                <span
                  key={currentIndex}
                  className={`hero-dynamic-phrase ${isTransitioning
                    ? "headline-exiting"
                    : "headline-active"
                    }`}
                >
                  <span>{currentStatement.prefix}</span>

                  <span className="hero-headline-accent">
                    {currentStatement.highlight}
                  </span>
                </span>
              </span>

            </h1>

            <noscript>
              <h1 className="hero-headline noscript-headline">
                <span className="hero-static-prefix">
                  {heroData.headlinePrefix || "We Make"}
                </span>

                <span className="hero-dynamic-slot">
                  <span>brands </span>
                  <span className="hero-headline-accent">
                    stand out &amp; grow.
                  </span>
                </span>
              </h1>
            </noscript>
          </div>

          {/* EXISTING DESCRIPTION — UNCHANGED */}
          <p className="hero-description">
            {heroData.subtitle ||
              "Digitalonix helps businesses grow through creative marketing, digital strategy, and technology."}
          </p>

          {/* EXISTING CTA LINKS — UNCHANGED */}
          <div className="hero-cta-group">

            <Link href="/#quote" className="btn btn-primary">
              <span>
                {heroData.primaryCtaText || "Get a Quote"}
              </span>
              <ArrowRight size={17} />
            </Link>

            <Link href="/portfolio" className="btn btn-secondary">
              <span>
                {heroData.secondaryCtaText || "Explore Our Work"}
              </span>
              <ArrowRight size={15} />
            </Link>

          </div>
        </div>

        {/* RIGHT SIDE: FUTURE IMAGE / VIDEO COMPOSITION */}


        {/* RIGHT SIDE — THREE IMAGE COLLAGE */}
        <div className="hero-visual" aria-hidden="true">

          {/* PURPLE ORBIT */}
          <div className="hero-visual-orbit" />

          {/* LEFT IMAGE */}
          <div className="hero-visual-card hero-visual-card--left">
            <div className="hero-visual-card-inner">
              <img
                src="/images/1.webp"
                alt=""
              />
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hero-visual-card hero-visual-card--right">
            <div className="hero-visual-card-inner">
              <img
                src="/images/3.webp"
                alt=""
              />
            </div>
          </div>

          {/* CENTRE IMAGE — FRONT LAYER */}
          <div className="hero-visual-card hero-visual-card--main">
            <div className="hero-visual-card-inner">
              <img
                src="/images/2.webp"
                alt=""
              />
            </div>
          </div>

          {/* FLOATING SERVICE LABEL
          <div className="hero-visual-caption">
            <span className="hero-visual-caption-mark" />
            <span>Branding</span>
            <span className="hero-visual-dot">•</span>
            <span>Digital</span>
            <span className="hero-visual-dot">•</span>
            <span>Film</span>
          </div> */}

        </div>




      </div>
    </section>
  );
}
