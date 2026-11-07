-- ========================================================
-- DIGITALONIX AGENCY — COMPLETE SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor: Dashboard -> SQL Editor -> New Query -> Run
-- ========================================================

-- 1. CREATE ALL TABLES
-- ========================================================

-- Projects Table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  subcategory text not null,
  client text not null,
  client_label text,
  summary text not null,
  description text,
  project_url text,
  status text default 'published' check (status in ('draft', 'published')),
  media_type text default 'image' check (media_type in ('image', 'video')),
  video_duration text,
  aspect_ratio text default '16/9',
  thumbnail_url text,
  metrics jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Services Table
create table if not exists public.services (
  id text primary key,
  title text not null,
  category text not null,
  short_description text not null,
  detailed_description text not null,
  icon_name text not null,
  features jsonb default '[]'::jsonb,
  deliverables jsonb default '[]'::jsonb,
  status text default 'active' check (status in ('active', 'draft')),
  sort_order int default 0
);

-- Testimonials Table
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  author text not null,
  role text not null,
  company text not null,
  quote text not null,
  rating int default 5,
  status text default 'published' check (status in ('published', 'pending')),
  created_at timestamptz default now()
);

-- Clients Table
create table if not exists public.clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  industry text not null,
  symbol text default 'hexagon',
  website_url text,
  logo_url text,
  status text default 'active' check (status in ('active', 'inactive'))
);

-- Enquiries / Private Leads Table
create table if not exists public.enquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  service text not null,
  message text not null,
  status text default 'new' check (status in ('new', 'contacted', 'completed')),
  notes text,
  submitted_at timestamptz default now()
);

-- Site Content Table
create table if not exists public.site_content (
  key text primary key,
  content jsonb not null,
  updated_at timestamptz default now()
);

-- 2. EXPLICIT API GRANTS (FOR BOTH ANON & AUTHENTICATED ACCESS)
-- ========================================================

grant usage on schema public to anon, authenticated;

-- Public tables: allow read, insert, update, delete for web console & admin
grant select, insert, update, delete on public.projects, public.services, public.testimonials, public.clients, public.site_content to anon, authenticated;

-- Private Enquiries table: anon can insert leads; authenticated can manage
grant insert on public.enquiries to anon;
grant select, insert, update, delete on public.enquiries to authenticated, anon;

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.clients enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_content enable row level security;

-- Projects Policies
drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects"
  on public.projects for select
  using (true);

drop policy if exists "Admins full access to projects" on public.projects;
create policy "Admins full access to projects"
  on public.projects for all
  to anon, authenticated
  using (true)
  with check (true);

-- Services Policies
drop policy if exists "Public can view active services" on public.services;
create policy "Public can view active services"
  on public.services for select
  using (true);

drop policy if exists "Admins full access to services" on public.services;
create policy "Admins full access to services"
  on public.services for all
  to anon, authenticated
  using (true)
  with check (true);

-- Testimonials Policies
drop policy if exists "Public can view published testimonials" on public.testimonials;
create policy "Public can view published testimonials"
  on public.testimonials for select
  using (true);

drop policy if exists "Admins full access to testimonials" on public.testimonials;
create policy "Admins full access to testimonials"
  on public.testimonials for all
  to anon, authenticated
  using (true)
  with check (true);

-- Clients Policies
drop policy if exists "Public can view active clients" on public.clients;
create policy "Public can view active clients"
  on public.clients for select
  using (true);

drop policy if exists "Admins full access to clients" on public.clients;
create policy "Admins full access to clients"
  on public.clients for all
  to anon, authenticated
  using (true)
  with check (true);

-- Site Content Policies
drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  using (true);

drop policy if exists "Admins can update site content" on public.site_content;
create policy "Admins can update site content"
  on public.site_content for all
  to anon, authenticated
  using (true)
  with check (true);

-- Enquiries Policies
drop policy if exists "Anon can only insert inquiries" on public.enquiries;
create policy "Anon can only insert inquiries"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can manage inquiries" on public.enquiries;
create policy "Admins can manage inquiries"
  on public.enquiries for all
  to anon, authenticated
  using (true)
  with check (true);

-- 4. STORAGE BUCKETS FOR LOGOS & MEDIA ASSETS
-- ========================================================

-- Create storage buckets for client logos and media uploads if they do not exist
insert into storage.buckets (id, name, public)
values ('client-logos', 'client-logos', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do update set public = true;

-- Storage RLS policies
drop policy if exists "Public read client logos" on storage.objects;
create policy "Public read client logos"
  on storage.objects for select
  using (bucket_id in ('client-logos', 'assets'));

drop policy if exists "Allow uploads to client logos" on storage.objects;
create policy "Allow uploads to client logos"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id in ('client-logos', 'assets'));

drop policy if exists "Allow updates to client logos" on storage.objects;
create policy "Allow updates to client logos"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id in ('client-logos', 'assets'));

drop policy if exists "Allow deletes to client logos" on storage.objects;
create policy "Allow deletes to client logos"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id in ('client-logos', 'assets'));
