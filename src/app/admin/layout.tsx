"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import "@/styles/admin.css";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { AdminToastProvider } from "@/context/AdminToastContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Public auth routes (unprotected)
  const isPublicAuthRoute =
    pathname === "/admin/login" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/reset-password";

  // Route protection for all other /admin/* routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicAuthRoute) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, isPublicAuthRoute, router]);

  if (isPublicAuthRoute) {
    return (
      <main className="admin-shell" style={{ justifyContent: "center", alignItems: "center" }}>
        {children}
      </main>
    );
  }

  if (isLoading) {
    return (
      <div className="admin-shell" style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ color: "var(--adm-text-secondary)", fontSize: "0.875rem" }}>
          Verifying administrator session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <div className="admin-main-wrap">
        <AdminTopbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="admin-page-container">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminToastProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </AdminToastProvider>
    </AdminAuthProvider>
  );
}
