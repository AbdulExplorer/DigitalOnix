import React from "react";
import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/ServicesPageContent";

export const metadata: Metadata = {
  title: "Services & Capabilities",
  description:
    "Explore Digitalonix's comprehensive disciplines across Marketing & Growth, Creative Production, Technology, and Local Visibility.",
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
