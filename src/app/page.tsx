import React from "react";
import { Hero } from "@/components/Hero";
import { Statistics } from "@/components/Statistics";
import { ClientLogos } from "@/components/ClientLogos";
import { Testimonials } from "@/components/Testimonials";
import { Services } from "@/components/Services";
import { Portfolio } from "@/components/Portfolio";
import { Founder } from "@/components/Founder";
import { ContactForm } from "@/components/ContactForm";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Company Introduction and Statistics */}
      <Statistics />

      {/* 3. Client Logo Showcase Marquee */}
      <ClientLogos />

      {/* 4. Testimonials Carousel */}
      <Testimonials />

      {/* 5. Services Section */}
      <Services />

      {/* 6. Portfolio Section */}
      <Portfolio />

      {/* 7. Founder Introduction */}
      <Founder />

      {/* 8. Get a Quote Section */}
      <ContactForm />
    </>
  );
}

