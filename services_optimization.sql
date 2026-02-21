-- Run these scripts in the Supabase SQL Editor

-- 1. Index on Category
-- Reason: We frequently filter services by category (`eq('category', 'it-solutions')`)
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- 2. Index on Status
-- Reason: We always query where status = 'published'
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);

-- 3. Composite Index on Category and Status
-- Reason: Provides extreme efficiency when querying specific category publications
CREATE INDEX IF NOT EXISTS idx_services_category_status ON services(category, status);

-- 4. Index on deleted_at
-- Reason: Soft delete pattern requires checking if deleted_at IS NULL
CREATE INDEX IF NOT EXISTS idx_services_deleted_at ON services(deleted_at);

-- 5. Compound covering index for the exact fetch query
-- Reason: If we want absolute maximum performance for the exact query:
-- SELECT id, title, subtitle, description, benefits, image_url, icon_name, category 
-- FROM services WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_services_published_active ON services(status, deleted_at) INCLUDE (id, title, subtitle, description, category);

-- Repeat indexes for other content tables dynamically using the same patterns if necessary
CREATE INDEX IF NOT EXISTS idx_jobs_status_deleted ON job_openings(status, deleted_at);
CREATE INDEX IF NOT EXISTS idx_programs_status_deleted ON student_programs(status, deleted_at);
CREATE INDEX IF NOT EXISTS idx_blogs_status_deleted ON blogs(status, deleted_at);
