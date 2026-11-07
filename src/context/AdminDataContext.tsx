"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  AdminProject,
  AdminService,
  AdminTestimonial,
  AdminClient,
  AdminEnquiry,
  AdminSiteContent,
  EnquiryStatus,
} from "@/types/admin";
import { siteConfig } from "@/data/config";
import { servicesData } from "@/data/services";
import { supabase } from "@/lib/supabase-client";

export interface AdminDataContextType {
  // Projects
  projects: AdminProject[];
  addProject: (project: Omit<AdminProject, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateProject: (id: string, updates: Partial<AdminProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Services
  services: AdminService[];
  addService: (service: Omit<AdminService, "id">) => Promise<void>;
  updateService: (id: string, updates: Partial<AdminService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Testimonials
  testimonials: AdminTestimonial[];
  addTestimonial: (item: Omit<AdminTestimonial, "id" | "createdAt">) => Promise<void>;
  updateTestimonial: (id: string, updates: Partial<AdminTestimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  // Clients
  clients: AdminClient[];
  addClient: (client: Omit<AdminClient, "id">) => Promise<void>;
  updateClient: (id: string, updates: Partial<AdminClient>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  // Enquiries
  enquiries: AdminEnquiry[];
  addEnquiry: (enquiry: Omit<AdminEnquiry, "id" | "submittedAt">) => Promise<void>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, notes?: string) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;

  // Site Content
  content: AdminSiteContent;
  updateContent: (newContent: Partial<AdminSiteContent>) => Promise<void>;

  // Real-time Dynamic Statistics (strictly reflects Supabase data)
  stats: {
    totalProjects: number;
    publishedProjects: number;
    draftProjects: number;
    totalEnquiries: number;
    newEnquiries: number;
    contactedEnquiries: number;
    completedEnquiries: number;
    totalServices: number;
    activeServices: number;
    totalClients: number;
    totalTestimonials: number;
  };
}

const STORAGE_PREFIX = "digitalonix_admin_";
const SYNC_EVENT = "digitalonix_data_updated";

// Helper to generate a valid RFC4122 v4 UUID
function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Check and purge legacy hardcoded mock IDs so old browser caches are 100% clean
function isLegacyMockId(id: string): boolean {
  return (
    id.startsWith("client-") ||
    id.startsWith("p-") ||
    id.startsWith("test-") ||
    id.startsWith("enq-10")
  );
}

// Agency Services: Retained with all 12 core agency capabilities
const initialServices: AdminService[] = servicesData.map((svc, idx) => ({
  id: svc.id,
  title: svc.title,
  category: svc.category,
  shortDescription: svc.shortDescription,
  detailedDescription: svc.detailedDescription,
  iconName: svc.iconName,
  features: svc.features,
  deliverables: svc.deliverables,
  status: "active",
  order: idx,
}));

// Initial Collections: Projects, Testimonials, Clients, Enquiries populated strictly from Supabase
const initialProjects: AdminProject[] = [];
const initialTestimonials: AdminTestimonial[] = [];
const initialClients: AdminClient[] = [];
const initialEnquiries: AdminEnquiry[] = [];

// Base Content Template
const initialContent: AdminSiteContent = {
  hero: {
    headlinePrefix: "We Make",
    dynamicLines: ["brands stand out.", "creativity work.", "brands grow."],
    subtitle: "A forward-thinking digital marketing and creative agency in Bhopal, engineering high-impact advertising, cinematic visual productions, and bespoke brand experiences.",
    primaryCtaText: "Start a Project",
    secondaryCtaText: "Explore Work",
  },
  stats: {
    projectsDelivered: "1000+",
    clientsServed: "250+",
    metaAdSpend: "₹10Lakh+",
    experienceYears: "1000+",
    adSpendManaged: "₹10Lakh+",
    averageRoas: "4.8x",
  },
  cta: {
    heading: "Ready to accelerate your brand's digital presence?",
    subtitle: "Join 250+ ambitious brands who trust Digitalonix for measurable performance and creative distinction.",
    buttonText: "Schedule a Discovery Call",
  },
  contact: {
    email: siteConfig.contactEmail,
    phone: siteConfig.contactPhone,
    address: "Arera Colony, E-Sector",
    city: siteConfig.city,
    state: siteConfig.state,
    country: siteConfig.country,
    instagramUrl: siteConfig.instagramUrl,
    linkedinUrl: siteConfig.linkedinUrl,
  },
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<AdminProject[]>(initialProjects);
  const [services, setServices] = useState<AdminService[]>(initialServices);
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>(initialTestimonials);
  const [clients, setClients] = useState<AdminClient[]>(initialClients);
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>(initialEnquiries);
  const [content, setContent] = useState<AdminSiteContent>(initialContent);

  // Broadcast updates across browser tabs
  const broadcastSync = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(SYNC_EVENT));
    }
  };

  // 1. Immediately restore saved items from localStorage, purging any legacy mock seed data
  const restoreFromLocalStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const savedProjects = localStorage.getItem(`${STORAGE_PREFIX}projects`);
      if (savedProjects) {
        const parsed: AdminProject[] = JSON.parse(savedProjects);
        setProjects(parsed.filter((item) => !isLegacyMockId(item.id)));
      }

      const savedServices = localStorage.getItem(`${STORAGE_PREFIX}services`);
      if (savedServices) {
        try {
          const parsed: AdminService[] = JSON.parse(savedServices);
          if (parsed && parsed.length > 0) {
            setServices(parsed);
          } else {
            setServices(initialServices);
          }
        } catch {
          setServices(initialServices);
        }
      } else {
        setServices(initialServices);
      }

      const savedTestimonials = localStorage.getItem(`${STORAGE_PREFIX}testimonials`);
      if (savedTestimonials) {
        const parsed: AdminTestimonial[] = JSON.parse(savedTestimonials);
        setTestimonials(parsed.filter((item) => !isLegacyMockId(item.id)));
      }

      const savedClients = localStorage.getItem(`${STORAGE_PREFIX}clients`);
      if (savedClients) {
        const parsed: AdminClient[] = JSON.parse(savedClients);
        setClients(parsed.filter((item) => !isLegacyMockId(item.id)));
      }

      const savedEnquiries = localStorage.getItem(`${STORAGE_PREFIX}enquiries`);
      if (savedEnquiries) {
        const parsed: AdminEnquiry[] = JSON.parse(savedEnquiries);
        const filtered = parsed.filter((item) => !isLegacyMockId(item.id));
        const seen = new Set<string>();
        const uniqueEnquiries: AdminEnquiry[] = [];
        for (const item of filtered) {
          const contactKey = (item.email || item.phone || "").trim().toLowerCase();
          const nameKey = item.name.trim().toLowerCase();
          const serviceKey = item.service.trim().toLowerCase();
          const dedupeKey = `${nameKey}|${contactKey}|${serviceKey}`;
          if (!seen.has(dedupeKey)) {
            seen.add(dedupeKey);
            uniqueEnquiries.push(item);
          }
        }
        setEnquiries(uniqueEnquiries);
      }

      const savedContent = localStorage.getItem(`${STORAGE_PREFIX}content`);
      if (savedContent) setContent(JSON.parse(savedContent));
    } catch (err) {
      console.warn("Could not read local storage:", err);
    }
  }, []);

  // 2. Fetch live data strictly from Supabase
  const fetchSupabaseData = useCallback(async () => {
    if (!supabase) return;

    try {
      const [projRes, svcRes, testRes, cliRes, enqRes, contentRes] = await Promise.allSettled([
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("services").select("*").order("sort_order", { ascending: true }),
        supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
        supabase.from("clients").select("*").order("name", { ascending: true }),
        supabase.from("enquiries").select("*").order("submitted_at", { ascending: false }),
        supabase.from("site_content").select("*").eq("key", "main").maybeSingle(),
      ]);

      // 1. Projects (From Supabase Only)
      if (projRes.status === "fulfilled" && projRes.value.data) {
        const mapped: AdminProject[] = projRes.value.data.map((row: any) => ({
          id: row.id,
          title: row.title,
          category: row.category,
          subcategory: row.subcategory,
          client: row.client || row.client_label || "Client",
          clientLabel: row.client_label || row.client || "Client",
          summary: row.summary,
          description: row.description || row.summary,
          projectUrl: row.project_url || "https://digitalonix.in",
          status: row.status || "published",
          mediaType: row.media_type || "image",
          videoDuration: row.video_duration,
          aspectRatio: row.aspect_ratio || "16/9",
          thumbnailUrl: row.thumbnail_url,
          metrics: row.metrics || [],
          createdAt: row.created_at?.split("T")[0] || "2026-10-15",
          updatedAt: row.updated_at?.split("T")[0] || "2026-11-01",
        }));
        setProjects(mapped);
        try {
          localStorage.setItem(`${STORAGE_PREFIX}projects`, JSON.stringify(mapped));
        } catch {}
      }

      // 2. Services (From Supabase or fallback to all 12 agency services)
      if (svcRes.status === "fulfilled" && svcRes.value.data && svcRes.value.data.length > 0) {
        const mapped: AdminService[] = svcRes.value.data.map((row: any) => ({
          id: row.id,
          title: row.title,
          category: row.category,
          shortDescription: row.short_description,
          detailedDescription: row.detailed_description || row.short_description,
          iconName: row.icon_name || "Globe",
          features: row.features || [],
          deliverables: row.deliverables || [],
          status: row.status || "active",
          order: row.sort_order ?? 0,
        }));
        setServices(mapped);
        try {
          localStorage.setItem(`${STORAGE_PREFIX}services`, JSON.stringify(mapped));
        } catch {}
      } else if (svcRes.status === "fulfilled" && (!svcRes.value.data || svcRes.value.data.length === 0)) {
        setServices(initialServices);
        try {
          localStorage.setItem(`${STORAGE_PREFIX}services`, JSON.stringify(initialServices));
        } catch {}
        if (supabase) {
          supabase
            .from("services")
            .upsert(
              initialServices.map((svc, idx) => ({
                id: svc.id,
                title: svc.title,
                category: svc.category,
                short_description: svc.shortDescription,
                detailed_description: svc.detailedDescription,
                icon_name: svc.iconName,
                features: svc.features,
                deliverables: svc.deliverables,
                status: svc.status,
                sort_order: idx,
              }))
            )
            .then(({ error }) => {
              if (error) {
                console.warn("Could not sync services to Supabase:", error.message);
              }
            });
        }
      }

      // 3. Testimonials (From Supabase Only)
      if (testRes.status === "fulfilled" && testRes.value.data) {
        // Resilient video fallback lookup from site_content
        const videoFallbacks =
          contentRes.status === "fulfilled" && (contentRes.value.data?.content || contentRes.value.data)?.testimonialVideos
            ? (contentRes.value.data.content || contentRes.value.data).testimonialVideos
            : {};

        const mapped: AdminTestimonial[] = testRes.value.data.map((row: any) => ({
          id: row.id,
          author: row.author,
          role: row.role,
          company: row.company,
          quote: row.quote,
          rating: row.rating || 5,
          status: row.status || "published",
          videoUrl:
            row.video_url ||
            videoFallbacks[row.id] ||
            (row.id === "21058c3b-c60f-47ae-8248-77abcc8702f3"
              ? "https://wlysuqlciiekbqhrmjhy.supabase.co/storage/v1/object/public/assets/testimonials/1794079229796-0f950p.MP4"
              : undefined),
          createdAt: row.created_at?.split("T")[0] || "2026-10-20",
        }));
        setTestimonials(mapped);
        try {
          localStorage.setItem(`${STORAGE_PREFIX}testimonials`, JSON.stringify(mapped));
        } catch {}
      }

      // 4. Clients (From Supabase Only)
      if (cliRes.status === "fulfilled" && cliRes.value.data) {
        const mapped: AdminClient[] = cliRes.value.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          industry: row.industry,
          symbol: row.symbol || "hexagon",
          websiteUrl: row.website_url,
          logoUrl: row.logo_url,
          status: row.status || "active",
        }));
        setClients(mapped);
        try {
          localStorage.setItem(`${STORAGE_PREFIX}clients`, JSON.stringify(mapped));
        } catch {}
      }

      // 5. Enquiries (From Supabase Only, automatically deduplicated)
      if (enqRes.status === "fulfilled" && enqRes.value.data) {
        const mapped: AdminEnquiry[] = enqRes.value.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email || "",
          phone: row.phone || "",
          service: row.service,
          message: row.message || "",
          status: row.status || "new",
          submittedAt: row.submitted_at || new Date().toISOString(),
          notes: row.notes,
        }));

        // Deduplicate enquiries so a single person's duplicate submission is never stored or displayed twice
        const seen = new Set<string>();
        const uniqueEnquiries: AdminEnquiry[] = [];
        for (const item of mapped) {
          const contactKey = (item.email || item.phone || "").trim().toLowerCase();
          const nameKey = item.name.trim().toLowerCase();
          const serviceKey = item.service.trim().toLowerCase();
          const dedupeKey = `${nameKey}|${contactKey}|${serviceKey}`;
          if (!seen.has(dedupeKey)) {
            seen.add(dedupeKey);
            uniqueEnquiries.push(item);
          }
        }

        setEnquiries(uniqueEnquiries);
        try {
          localStorage.setItem(`${STORAGE_PREFIX}enquiries`, JSON.stringify(uniqueEnquiries));
        } catch {}
      }

      // 6. Site Content
      if (contentRes.status === "fulfilled" && contentRes.value.data) {
        const jsonContent = contentRes.value.data.content || contentRes.value.data;
        if (jsonContent) {
          const merged: AdminSiteContent = {
            hero: jsonContent.hero || initialContent.hero,
            stats: jsonContent.stats || initialContent.stats,
            cta: jsonContent.cta || initialContent.cta,
            contact: jsonContent.contact || initialContent.contact,
          };
          setContent(merged);
          try {
            localStorage.setItem(`${STORAGE_PREFIX}content`, JSON.stringify(merged));
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Supabase fetch notice:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    restoreFromLocalStorage();
    fetchSupabaseData();

    const handleSync = () => restoreFromLocalStorage();
    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [restoreFromLocalStorage, fetchSupabaseData]);

  // Sync state helpers
  const saveProjects = (items: AdminProject[]) => {
    setProjects(items);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}projects`, JSON.stringify(items));
      broadcastSync();
    } catch (err) {
      console.warn("Storage notice (projects):", err);
    }
  };

  const saveServices = (items: AdminService[]) => {
    setServices(items);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}services`, JSON.stringify(items));
      broadcastSync();
    } catch (err) {
      console.warn("Storage notice (services):", err);
    }
  };

  const saveTestimonials = (items: AdminTestimonial[]) => {
    setTestimonials(items);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}testimonials`, JSON.stringify(items));
      broadcastSync();
    } catch (err) {
      console.warn("Storage notice (testimonials):", err);
    }
  };

  const saveClients = (items: AdminClient[]) => {
    setClients(items);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}clients`, JSON.stringify(items));
      broadcastSync();
    } catch (err) {
      console.warn("Storage notice (clients):", err);
    }
  };

  const saveEnquiries = (items: AdminEnquiry[]) => {
    setEnquiries(items);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}enquiries`, JSON.stringify(items));
      broadcastSync();
    } catch (err) {
      console.warn("Storage notice (enquiries):", err);
    }
  };

  const saveContent = (c: AdminSiteContent) => {
    setContent(c);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}content`, JSON.stringify(c));
      broadcastSync();
    } catch (err) {
      console.warn("Storage notice (content):", err);
    }
  };

  // Projects CRUD (aligned with user's projects table: uuid id, exact columns)
  const addProject = async (item: Omit<AdminProject, "id" | "createdAt" | "updatedAt">) => {
    const newId = generateUUID();
    const newProject: AdminProject = {
      ...item,
      id: newId,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    saveProjects([newProject, ...projects]);

    if (supabase) {
      try {
        const { error } = await supabase.from("projects").insert({
          id: newId,
          title: item.title,
          category: item.category,
          subcategory: item.subcategory,
          client: item.client || item.clientLabel || "Client",
          client_label: item.clientLabel || item.client || "Client",
          summary: item.summary,
          description: item.description || item.summary,
          project_url: item.projectUrl || null,
          status: item.status || "published",
          media_type: item.mediaType || "image",
          video_duration: item.videoDuration || null,
          aspect_ratio: item.aspectRatio || "16/9",
          thumbnail_url: item.thumbnailUrl || null,
          metrics: item.metrics || [],
        });
        if (error) {
          console.error("Supabase insert error (projects):", error.message);
        }
      } catch (err) {
        console.warn("Could not insert project to Supabase:", err);
      }
    }
  };

  const updateProject = async (id: string, updates: Partial<AdminProject>) => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : p
    );
    saveProjects(updated);

    if (supabase) {
      try {
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.subcategory !== undefined) dbUpdates.subcategory = updates.subcategory;
        if (updates.client !== undefined) dbUpdates.client = updates.client;
        if (updates.clientLabel !== undefined) dbUpdates.client_label = updates.clientLabel;
        if (updates.summary !== undefined) dbUpdates.summary = updates.summary;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.projectUrl !== undefined) dbUpdates.project_url = updates.projectUrl;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.mediaType !== undefined) dbUpdates.media_type = updates.mediaType;
        if (updates.videoDuration !== undefined) dbUpdates.video_duration = updates.videoDuration;
        if (updates.aspectRatio !== undefined) dbUpdates.aspect_ratio = updates.aspectRatio;
        if (updates.thumbnailUrl !== undefined) dbUpdates.thumbnail_url = updates.thumbnailUrl;
        if (updates.metrics !== undefined) dbUpdates.metrics = updates.metrics;
        dbUpdates.updated_at = new Date().toISOString();

        const { error } = await supabase.from("projects").update(dbUpdates).eq("id", id);
        if (error) {
          console.error("Supabase update error (projects):", error.message);
        }
      } catch (err) {
        console.warn("Could not update project in Supabase:", err);
      }
    }
  };

  const deleteProject = async (id: string) => {
    saveProjects(projects.filter((p) => p.id !== id));
    if (supabase) {
      try {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete error (projects):", error.message);
        }
      } catch (err) {
        console.warn("Could not delete project from Supabase:", err);
      }
    }
  };

  // Services CRUD (aligned with user's services table: text id, sort_order)
  const addService = async (item: Omit<AdminService, "id">) => {
    const id = `svc-${Date.now().toString().slice(-4)}`;
    const newService: AdminService = {
      ...item,
      id,
    };
    saveServices([...services, newService]);

    if (supabase) {
      try {
        const { error } = await supabase.from("services").insert({
          id,
          title: item.title,
          category: item.category,
          short_description: item.shortDescription,
          detailed_description: item.detailedDescription || item.shortDescription,
          icon_name: item.iconName || "Globe",
          features: item.features || [],
          deliverables: item.deliverables || [],
          status: item.status || "active",
          sort_order: item.order || services.length + 1,
        });
        if (error) {
          console.error("Supabase insert error (services):", error.message);
        }
      } catch (err) {
        console.warn("Could not insert service to Supabase:", err);
      }
    }
  };

  const updateService = async (id: string, updates: Partial<AdminService>) => {
    saveServices(services.map((s) => (s.id === id ? { ...s, ...updates } : s)));

    if (supabase) {
      try {
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription;
        if (updates.detailedDescription !== undefined) dbUpdates.detailed_description = updates.detailedDescription;
        if (updates.iconName !== undefined) dbUpdates.icon_name = updates.iconName;
        if (updates.features !== undefined) dbUpdates.features = updates.features;
        if (updates.deliverables !== undefined) dbUpdates.deliverables = updates.deliverables;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.order !== undefined) dbUpdates.sort_order = updates.order;

        const { error } = await supabase.from("services").update(dbUpdates).eq("id", id);
        if (error) {
          console.error("Supabase update error (services):", error.message);
        }
      } catch (err) {
        console.warn("Could not update service in Supabase:", err);
      }
    }
  };

  const deleteService = async (id: string) => {
    saveServices(services.filter((s) => s.id !== id));

    if (supabase) {
      try {
        const { error } = await supabase.from("services").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete error (services):", error.message);
        }
      } catch (err) {
        console.warn("Could not delete service from Supabase:", err);
      }
    }
  };

  // Resilient sync for testimonial video URLs in case public.testimonials column hasn't been migrated
  const syncTestimonialVideoFallback = async (testimonialId: string, videoUrl?: string) => {
    if (!supabase) return;
    try {
      const { data } = await supabase.from("site_content").select("content").eq("key", "main").maybeSingle();
      if (data && data.content) {
        const nextContent = { ...data.content };
        nextContent.testimonialVideos = nextContent.testimonialVideos || {};
        if (videoUrl) {
          nextContent.testimonialVideos[testimonialId] = videoUrl;
        } else {
          delete nextContent.testimonialVideos[testimonialId];
        }
        await supabase
          .from("site_content")
          .update({ content: nextContent, updated_at: new Date().toISOString() })
          .eq("key", "main");
      }
    } catch (err) {
      console.warn("Could not sync testimonial video fallback:", err);
    }
  };

  // Testimonials CRUD (aligned with user's testimonials table: uuid id)
  const addTestimonial = async (item: Omit<AdminTestimonial, "id" | "createdAt">) => {
    const newId = generateUUID();
    const newTestimonial: AdminTestimonial = {
      ...item,
      id: newId,
      createdAt: new Date().toISOString().split("T")[0],
    };
    saveTestimonials([newTestimonial, ...testimonials]);

    if (supabase) {
      try {
        const payload: any = {
          id: newId,
          author: item.author,
          role: item.role,
          company: item.company || "Brand Partner",
          quote: item.quote,
          rating: item.rating || 5,
          status: item.status || "published",
        };
        if (item.videoUrl) payload.video_url = item.videoUrl;

        const { error } = await supabase.from("testimonials").insert(payload);
        if (error) {
          if (error.code === "42703" && payload.video_url) {
            delete payload.video_url;
            await supabase.from("testimonials").insert(payload);
            if (item.videoUrl) {
              await syncTestimonialVideoFallback(newId, item.videoUrl);
            }
          }
          console.error("Supabase insert notice (testimonials):", error.message);
        } else if (item.videoUrl) {
          syncTestimonialVideoFallback(newId, item.videoUrl);
        }
      } catch (err) {
        console.warn("Could not insert testimonial to Supabase:", err);
      }
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<AdminTestimonial>) => {
    saveTestimonials(testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t)));

    if (supabase) {
      try {
        const dbUpdates: any = {};
        if (updates.author !== undefined) dbUpdates.author = updates.author;
        if (updates.role !== undefined) dbUpdates.role = updates.role;
        if (updates.company !== undefined) dbUpdates.company = updates.company;
        if (updates.quote !== undefined) dbUpdates.quote = updates.quote;
        if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;

        const { error } = await supabase.from("testimonials").update(dbUpdates).eq("id", id);
        if (error) {
          if (error.code === "42703" && dbUpdates.video_url !== undefined) {
            const vid = dbUpdates.video_url;
            delete dbUpdates.video_url;
            await supabase.from("testimonials").update(dbUpdates).eq("id", id);
            await syncTestimonialVideoFallback(id, vid);
          }
          console.error("Supabase update notice (testimonials):", error.message);
        } else if (updates.videoUrl !== undefined) {
          syncTestimonialVideoFallback(id, updates.videoUrl);
        }
      } catch (err) {
        console.warn("Could not update testimonial in Supabase:", err);
      }
    }
  };

  const deleteTestimonial = async (id: string) => {
    saveTestimonials(testimonials.filter((t) => t.id !== id));

    if (supabase) {
      try {
        const { error } = await supabase.from("testimonials").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete error (testimonials):", error.message);
        }
      } catch (err) {
        console.warn("Could not delete testimonial from Supabase:", err);
      }
    }
  };

  // Clients CRUD (aligned with user's clients table: uuid id)
  const addClient = async (item: Omit<AdminClient, "id">) => {
    const newId = generateUUID();
    const newClient: AdminClient = {
      ...item,
      id: newId,
    };
    saveClients([newClient, ...clients]);

    if (supabase) {
      try {
        const { error } = await supabase.from("clients").insert({
          id: newId,
          name: item.name,
          industry: item.industry || "General",
          symbol: item.symbol || "hexagon",
          website_url: item.websiteUrl || null,
          logo_url: item.logoUrl || null,
          status: item.status || "active",
        });
        if (error) {
          console.error("Supabase insert error (clients):", error.message);
        }
      } catch (err) {
        console.warn("Could not insert client to Supabase:", err);
      }
    }
  };

  const updateClient = async (id: string, updates: Partial<AdminClient>) => {
    saveClients(clients.map((c) => (c.id === id ? { ...c, ...updates } : c)));

    if (supabase) {
      try {
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.industry !== undefined) dbUpdates.industry = updates.industry;
        if (updates.symbol !== undefined) dbUpdates.symbol = updates.symbol;
        if (updates.websiteUrl !== undefined) dbUpdates.website_url = updates.websiteUrl;
        if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
        if (updates.status !== undefined) dbUpdates.status = updates.status;

        const { error } = await supabase.from("clients").update(dbUpdates).eq("id", id);
        if (error) {
          console.error("Supabase update error (clients):", error.message);
        }
      } catch (err) {
        console.warn("Could not update client in Supabase:", err);
      }
    }
  };

  const deleteClient = async (id: string) => {
    saveClients(clients.filter((c) => c.id !== id));

    if (supabase) {
      try {
        const { error } = await supabase.from("clients").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete error (clients):", error.message);
        }
      } catch (err) {
        console.warn("Could not delete client from Supabase:", err);
      }
    }
  };

  // Enquiries CRUD (aligned with user's enquiries table: uuid id, email & message not null)
  const addEnquiry = async (item: Omit<AdminEnquiry, "id" | "submittedAt">) => {
    // Prevent duplicate enquiry if the same person already has this inquiry
    const contactKey = (item.email || item.phone || "").trim().toLowerCase();
    const nameKey = item.name.trim().toLowerCase();
    const serviceKey = (item.service || "").trim().toLowerCase();
    const isDuplicate = enquiries.some((existing) => {
      const eContact = (existing.email || existing.phone || "").trim().toLowerCase();
      const eName = existing.name.trim().toLowerCase();
      const eService = (existing.service || "").trim().toLowerCase();
      return eName === nameKey && eContact === contactKey && eService === serviceKey;
    });

    if (isDuplicate) {
      console.warn("Duplicate enquiry submission detected; suppressed duplicate entry.");
      return;
    }

    const newId = generateUUID();
    const newEnquiry: AdminEnquiry = {
      ...item,
      id: newId,
      submittedAt: new Date().toLocaleString(),
    };
    saveEnquiries([newEnquiry, ...enquiries]);

    if (supabase) {
      try {
        const { error } = await supabase.from("enquiries").insert({
          id: newId,
          name: item.name,
          email: item.email || "no-email@digitalonix.in",
          phone: item.phone || null,
          service: item.service || "General Inquiry",
          message: item.message || "New inquiry submitted via website.",
          status: item.status || "new",
        });
        if (error) {
          console.error("Supabase insert error (enquiries):", error.message);
        }
      } catch (err) {
        console.warn("Could not insert enquiry to Supabase:", err);
      }
    }
  };

  const updateEnquiryStatus = async (id: string, status: EnquiryStatus, notes?: string) => {
    saveEnquiries(
      enquiries.map((e) =>
        e.id === id ? { ...e, status, ...(notes !== undefined ? { notes } : {}) } : e
      )
    );
    if (supabase) {
      try {
        const updates: any = { status };
        if (notes !== undefined) updates.notes = notes;
        const { error } = await supabase.from("enquiries").update(updates).eq("id", id);
        if (error) {
          console.error("Supabase update error (enquiries):", error.message);
        }
      } catch (err) {
        console.warn("Could not update enquiry in Supabase:", err);
      }
    }
  };

  const deleteEnquiry = async (id: string) => {
    saveEnquiries(enquiries.filter((e) => e.id !== id));
    if (supabase) {
      try {
        const { error } = await supabase.from("enquiries").delete().eq("id", id);
        if (error) {
          console.error("Supabase delete error (enquiries):", error.message);
        }
      } catch (err) {
        console.warn("Could not delete enquiry from Supabase:", err);
      }
    }
  };

  // Content (aligned with user's site_content table: key text, content jsonb)
  const updateContent = async (newContent: Partial<AdminSiteContent>) => {
    const merged = { ...content, ...newContent };
    saveContent(merged);

    if (supabase) {
      try {
        const { error } = await supabase.from("site_content").upsert({
          key: "main",
          content: {
            hero: merged.hero,
            stats: merged.stats,
            cta: merged.cta,
            contact: merged.contact,
          },
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.error("Supabase upsert error (site_content):", error.message);
        }
      } catch (err) {
        console.warn("Could not upsert site content in Supabase:", err);
      }
    }
  };

  // Real-time Calculated Statistics: Strictly reflects current active data
  const stats = {
    totalProjects: projects.length,
    publishedProjects: projects.filter((p) => p.status === "published").length,
    draftProjects: projects.filter((p) => p.status === "draft").length,
    totalEnquiries: enquiries.length,
    newEnquiries: enquiries.filter((e) => e.status === "new").length,
    contactedEnquiries: enquiries.filter((e) => e.status === "contacted").length,
    completedEnquiries: enquiries.filter((e) => e.status === "completed").length,
    totalServices: services.length,
    activeServices: services.filter((s) => s.status === "active").length,
    totalClients: clients.length,
    totalTestimonials: testimonials.length,
  };

  return (
    <AdminDataContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        services,
        addService,
        updateService,
        deleteService,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        clients,
        addClient,
        updateClient,
        deleteClient,
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        content,
        updateContent,
        stats,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}
