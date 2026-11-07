"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AntigravityField } from "@/components/AntigravityField";

interface PublicShellProps {
  children: React.ReactNode;
}

/**
 * PublicShell conditionally renders the public website's header, footer,
 * theme switcher, and antigravity background animation.
 * 
 * When a user is in the `/admin` area, all public chrome is excluded,
 * ensuring total isolation and zero conflict with the admin dashboard.
 */
export function PublicShell({ children }: PublicShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Render admin routes directly in clean isolation
    return <>{children}</>;
  }

  // Render public website shell with existing components
  return (
    <>
      <AntigravityField />
      <ScrollReveal />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <ThemeSwitcher />
    </>
  );
}

