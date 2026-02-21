-- ==========================================================
-- JivIT SOLUTIONS: MASTER DATABASE SYNCHRONIZATION
-- Unified Schema, Triggers, RLS, and Seed Data
-- ==========================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. ENUMS
do $$ begin
    create type content_status as enum ('draft', 'published', 'archived');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type user_role as enum ('admin', 'editor', 'viewer');
exception
    when duplicate_object then null;
end $$;

-- 3. TABLES

-- Profiles (extends auth.users)
create table if not exists profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    role user_role default 'viewer',
    avatar_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Services
create table if not exists services (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    subtitle text,
    description text,
    benefits text[], -- Array of strings
    category text, -- it-solutions, wellness, platform-enablement
    status content_status default 'draft',
    image_url text,
    icon_name text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    created_by uuid references auth.users(id),
    deleted_at timestamptz -- For soft-delete
);

-- Job Openings
create table if not exists job_openings (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    department text,
    location text,
    type text, -- Full-time, Part-time, Contract
    description text,
    requirements text[],
    status content_status default 'draft',
    image_url text,
    icon_name text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    created_by uuid references auth.users(id),
    deleted_at timestamptz
);

-- Student Programs
create table if not exists student_programs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    domain text, -- IT, Wellness, Research
    description text,
    duration text,
    status content_status default 'draft',
    image_url text,
    icon_name text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    created_by uuid references auth.users(id),
    deleted_at timestamptz
);

-- Applications
create table if not exists applications (
    id uuid default uuid_generate_v4() primary key,
    first_name text not null,
    last_name text not null,
    email text not null,
    phone text,
    resume_url text,
    portfolio_url text,
    message text,
    source_type text, -- job, student_program
    source_id uuid, -- ID of the job or program
    status text default 'new', -- new, reviewing, rejected, accepted
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Activity Logs
create table if not exists activity_logs (
    id uuid default uuid_generate_v4() primary key,
    admin_id uuid references auth.users(id),
    action text not null,
    entity_type text not null,
    entity_id uuid,
    details jsonb,
    created_at timestamptz default now()
);

-- Site Settings
create table if not exists site_settings (
    key text primary key,
    value jsonb,
    updated_at timestamptz default now(),
    updated_by uuid references auth.users(id)
);

-- Blogs
create table if not exists blogs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    slug text unique not null,
    excerpt text,
    content text,
    image_url text,
    category text, -- Technology, Wellness, Innovation, etc.
    author_id uuid references auth.users(id),
    status content_status default 'draft',
    published_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz
);

-- 4. ROW LEVEL SECURITY (RLS)

-- Profiles
alter table profiles enable row level security;
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Services
alter table services enable row level security;
drop policy if exists "Services are viewable by everyone if published" on services;
create policy "Services are viewable by everyone if published" on services 
    for select using (status = 'published' AND deleted_at IS NULL);
drop policy if exists "Admins can do everything with services" on services;
create policy "Admins can do everything with services" on services 
    for all using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    )
    -- Allow direct SQL editor insert for admins/service role by adding a true condition for service role if needed, 
    -- but usually service_role bypasses RLS. To enable simple seeding via SQL editor for authenticated users if they are admin:
    with check (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- Job Openings
alter table job_openings enable row level security;
drop policy if exists "Jobs are viewable by everyone if published" on job_openings;
create policy "Jobs are viewable by everyone if published" on job_openings 
    for select using (status = 'published' AND deleted_at IS NULL);
drop policy if exists "Admins can do everything with job openings" on job_openings;
create policy "Admins can do everything with job openings" on job_openings 
    for all using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- Student Programs
alter table student_programs enable row level security;
drop policy if exists "Programs are viewable by everyone if published" on student_programs;
create policy "Programs are viewable by everyone if published" on student_programs 
    for select using (status = 'published' AND deleted_at IS NULL);
drop policy if exists "Admins can do everything with programs" on student_programs;
create policy "Admins can do everything with programs" on student_programs 
    for all using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- Blogs
alter table blogs enable row level security;
drop policy if exists "Blogs are viewable by everyone if published" on blogs;
create policy "Blogs are viewable by everyone if published" on blogs 
    for select using (status = 'published' AND deleted_at IS NULL);
drop policy if exists "Admins can do everything with blogs" on blogs;
create policy "Admins can do everything with blogs" on blogs 
    for all using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- Applications
alter table applications enable row level security;
drop policy if exists "Public can insert applications" on applications;
create policy "Public can insert applications" on applications for insert with check (true);
drop policy if exists "Admins can view all applications" on applications;
create policy "Admins can view all applications" on applications 
    for select using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- Activity Logs
alter table activity_logs enable row level security;
drop policy if exists "Only admins can view activity logs" on activity_logs;
create policy "Only admins can view activity logs" on activity_logs 
    for select using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- Site Settings
alter table site_settings enable row level security;
drop policy if exists "Settings viewable by everyone" on site_settings;
create policy "Settings viewable by everyone" on site_settings for select using (true);
drop policy if exists "Admins can update settings" on site_settings;
create policy "Admins can update settings" on site_settings for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 5. FUNCTIONS & TRIGGERS

-- Update timestamp function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Apply timestamp trigger to all relevant tables
drop trigger if exists update_services_updated_at on services;
create trigger update_services_updated_at before update on services for each row execute procedure update_updated_at_column();

drop trigger if exists update_job_openings_updated_at on job_openings;
create trigger update_job_openings_updated_at before update on job_openings for each row execute procedure update_updated_at_column();

drop trigger if exists update_student_programs_updated_at on student_programs;
create trigger update_student_programs_updated_at before update on student_programs for each row execute procedure update_updated_at_column();

drop trigger if exists update_applications_updated_at on applications;
create trigger update_applications_updated_at before update on applications for each row execute procedure update_updated_at_column();

drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at before update on profiles for each row execute procedure update_updated_at_column();

-- Auth Triggers
-- Automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, role, avatar_url)
    values (new.id, new.raw_user_meta_data->>'full_name', 'viewer', new.raw_user_meta_data->>'avatar_url');
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ==========================================================
-- 6. SEED DATA
-- ==========================================================

-- Clean existing data to avoid duplicates
DELETE FROM activity_logs;
DELETE FROM applications;
DELETE FROM student_programs;
DELETE FROM job_openings;
DELETE FROM services;
DELETE FROM site_settings;

-- SEED ADMIN USER (password: admin123)
-- Only for local development (safe to ignore in production if user exists)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, instance_id)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@jivit.com', crypt('admin123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"System Admin"}', now(), now(), 'authenticated', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'System Admin', 'admin')
ON CONFLICT (id) DO NOTHING;

-- SITE SETTINGS
INSERT INTO site_settings (key, value) VALUES
('site_name', '"JivIT Solutions"'),
('contact_email', '"hello@jivitsolutions.com"'),
('maintenance_mode', 'false'),
('enable_applications', 'true'),
('notification_email', '"admin@jivitsolutions.com"'),
('hero_tagline', '"Orchestrating Digital Future & Human Potential"'),
('hero_description', '"JivIT Solutions bridges the gap between enterprise-grade engineering and holistic human growth. We build resilient platforms and empower thriving organizations. Amalgamation of Inner transformation through Information Technology"'),
('service_categories', '[
    {"id": "it-solutions", "label": "IT Solutions", "tag": "Digital Excellence", "desc": "Revenue-driving, scalable technology infrastructure for modern enterprises."},
    {"id": "wellness", "label": "Wellness & Healing", "tag": "Inner Evolution", "desc": "Empowering personal growth and transformation through technology-enabled wellness experiences."},
    {"id": "platform-enablement", "label": "Platform Enablement", "tag": "Business Growth", "desc": "Empowering small businesses and independent professionals with accessible, scalable technology."}
]'),
('program_categories', '[
    {"id": "student-career", "label": "Student Programs", "tag": "Next Generation", "desc": "Rigorous programs that bridge academic theory with real-world application."},
    {"id": "research", "label": "Research & Lab", "tag": "Innovation", "desc": "Conducting ethical, open research at the intersection of technology and humans."}
]');

-- SERVICES
INSERT INTO services (title, subtitle, description, benefits, category, status, image_url, icon_name) VALUES
-- IT SOLUTIONS
(
    'Bespoke Cloud Architecture', 
    'Scalable, secure infrastructure for the modern age.', 
    'We design and implement custom cloud environments that prioritize high availability, rigorous security, and cost optimization. Built with Terraform and AWS/Azure best practices.', 
    ARRAY['99.99% Infrastructure Availability', 'Automated Security Patching', 'Cloud-Native Cost Optimization', 'Global Multi-Region Deployment'],
    'it-solutions', 'published',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', 'CloudCo'
),
(
    'AI-Driven Predictive Analytics', 
    'Transforming data into foresight.', 
    'Leverage machine learning to predict market trends and user behavior. Our models integrate seamlessly into your existing data pipeline for real-time decision support.', 
    ARRAY['Real-time Pattern Recognition', 'Custom Neural Network Design', 'Fraud Detection Algorithms', 'Actionable Business Intelligence'],
    'it-solutions', 'published',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80', 'Zap'
),
(
    'Sustainable Tech Consulting', 
    'Eco-friendly digital transformation.', 
    'We help enterprises reduce their carbon footprint through green coding practices, energy-efficient cloud hosting, and circular technology procurement.', 
    ARRAY['Carbon Footprint Audits', 'Energy-Efficient Software Design', 'Green Cloud Migration', 'ESG Compliance Reporting'],
    'it-solutions', 'published',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80', 'Leaf'
),

-- WELLNESS SERVICES
(
    'Mindfulness & High-Performance Coaching', 
    'Clarity for leaders and creators.', 
    'A transformative program designed for executives to cultivate mental resilience, reduce burnout, and achieve peak performance via evidence-based mindfulness.', 
    ARRAY['1-on-1 Elite Performance Mentoring', 'Stress Management Frameworks', 'Emotional Intelligence Development', 'Focused Cognitive Training'],
    'wellness', 'published',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80', 'Heart'
),
(
    'Corporate Zen & Productivity', 
    'Harmonizing the modern workspace.', 
    'Integration of yoga, meditation, and ergonomic flow into the corporate environment to boost employee satisfaction and creativity.', 
    ARRAY['On-site Meditation Sessions', 'Ergonomic Workflow Audits', 'Mental Health Support Systems', 'Team Bonding Retreats'],
    'wellness', 'published',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80', 'Smile'
),
(
    'Bespoke Healing Retreats', 
    'Deep transformation in natural settings.', 
    'Curated 7-day immersive experiences focusing on holistic health, detoxification, and spiritual re-alignment at our sanctuary locations.', 
    ARRAY['Bio-Individual Detox Plans', 'Nature-Immersive Therapy', 'Daily Holistic Workshops', 'Lifelong Aftercare Strategy'],
    'wellness', 'published',
    'https://images.unsplash.com/photo-1528319725582-ddc096101511?auto=format&fit=crop&w=1200&q=80', 'Map'
),

-- PLATFORM ENABLEMENT
(
    'SME Accelerator Kit', 
    'Digital transformation for micro-enterprises.', 
    'We provide small business owners with a pre-configured suite of tools to manage operations, digital marketing, and customer relations.', 
    ARRAY['Omnichannel CRM Access', 'Automated Lead Capture', 'Financial Dashboard Integration', 'Simplified Inventory Management'],
    'platform-enablement', 'published',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', 'Rocket'
);

-- JOB OPENINGS
INSERT INTO job_openings (title, department, location, type, description, requirements, status) VALUES
(
    'Senior DevOps Architect', 
    'Engineering', 'Remote / Pune', 'Full-time', 
    'Lead our infrastructure evolution. We are looking for a Terraform and Kubernetes expert who values security and efficiency.', 
    ARRAY['8+ years experience in Cloud Infrastructure', 'Strong knowledge of CI/CD pipelines', 'Experience with Zero-Trust security', 'AWS Solutions Architect Professional certification'],
    'published'
),
(
    'Lead UI/UX Designer', 
    'Product', 'Remote', 'Full-time', 
    'Define the visual language of the JivIT universe. You will lead design systems for both our IT platforms and wellness apps.', 
    ARRAY['Portfolio showcasing premium/enterprise design', 'Expertise in Figma and Prototyping', 'Deep understanding of accessibility', 'Experience with motion design'],
    'published'
),
(
    'Holistic Health Specialist', 
    'Wellness', 'Hybrid (Mumbai)', 'Contract', 
    'Partner with us to deliver 1-on-1 coaching and design transformative retreat curriculum.', 
    ARRAY['Certification in Holistic Nutrition or Psychology', '5+ years coaching experience', 'Excellent public speaking skills', 'Passion for tech-enabled healing'],
    'published'
),
(
    'Strategic Growth Lead', 
    'Business', 'Bangalore', 'Full-time', 
    'Drive the adoption of our SME platform kit across the Indian market.', 
    ARRAY['Proven track record in SaaS growth', 'Strong network in the MSME sector', 'Analytical mindset with ROI focus'],
    'published'
);

-- STUDENT PROGRAMS
INSERT INTO student_programs (title, domain, description, duration, status) VALUES
(
    'Emerging Tech Fellowship', 
    'IT', 
    'A 6-month immersive experience where students work alongside senior engineers on real-world IT infrastructure projects.', 
    '6 Months', 'published'
),
(
    'Mental Health Tech Lab', 
    'Research', 
    'Focused on investigating the impact of digital wellness tools on urban mental health environments.', 
    '1 Year', 'published'
),
(
    'Cyber Defense Academy', 
    'IT', 
    'Intensive training program focused on offensive and defensive security strategies in modern cloud environments.', 
    '3 Months', 'published'
);

-- MOCK APPLICATIONS
INSERT INTO applications (first_name, last_name, email, phone, message, source_type, status) VALUES
('Aarav', 'Sharma', 'aarav@example.com', '+91 98765 43210', 'Very excited about the DevOps role!', 'job', 'new'),
('Priya', 'Patel', 'priya@example.com', '+91 98765 43211', 'I have 5 years of yoga teaching experience.', 'job', 'reviewing'),
('Dev', 'Mehta', 'dev@example.com', '+91 98765 43212', 'Interested in the Tech Fellowship.', 'student_program', 'new');

-- RLS BYPASS Policies (Development Helper)
-- Dropping ensures we don't have duplicates if running multiple times
DROP POLICY IF EXISTS "Admins can do everything with services" ON services;
CREATE POLICY "Admins can do everything with services" ON services FOR ALL USING (true);
DROP POLICY IF EXISTS "Admins can do everything with job openings" ON job_openings;
CREATE POLICY "Admins can do everything with job openings" ON job_openings FOR ALL USING (true);
DROP POLICY IF EXISTS "Admins can do everything with programs" ON student_programs;
CREATE POLICY "Admins can do everything with programs" ON student_programs FOR ALL USING (true);
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
CREATE POLICY "Admins can view all applications" ON applications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Only admins can view activity logs" ON activity_logs;
CREATE POLICY "Only admins can view activity logs" ON activity_logs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Settings viewable by everyone" ON site_settings;
CREATE POLICY "Settings viewable by everyone" ON site_settings FOR SELECT USING (true);
