import { supabase } from './supabase';

/**
 * Service to handle administrative operations with security and logging.
 */
const CACHE_PREFIX = 'jivit_cache_';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Helper: Cache Management
const cacheManager = {
    get: (key) => {
        try {
            const item = sessionStorage.getItem(CACHE_PREFIX + key);
            if (!item) return null;
            const record = JSON.parse(item);
            if (Date.now() - record.timestamp > CACHE_TTL) {
                sessionStorage.removeItem(CACHE_PREFIX + key);
                return null;
            }
            return record.value;
        } catch (e) {
            console.warn('Cache read error', e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            const record = { value, timestamp: Date.now() };
            sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(record));
        } catch (e) {
            console.warn('Cache write error - likely quota exceeded', e);
        }
    },
    invalidate: (pattern) => {
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith(CACHE_PREFIX) && key.includes(pattern)) {
                sessionStorage.removeItem(key);
            }
        });
    }
};

export const adminService = {
    async logAction(action, entityType, entityId, details = {}) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        try {
            await supabase.from('activity_logs').insert({
                admin_id: user.id, action, entity_type: entityType, entity_id: entityId, details
            });
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    },

    // --- Services/Products Operations ---

    async getServices(includeDrafts = false) {
        const cacheKey = `services_${includeDrafts}`;
        const cached = cacheManager.get(cacheKey);
        if (cached) return cached;

        let query = supabase.from('services').select('*').is('deleted_at', null);
        if (!includeDrafts) query = query.eq('status', 'published');

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        cacheManager.set(cacheKey, data);
        return data;
    },

    async getServiceById(id) {
        const cacheKey = `service_${id}`;
        const cached = cacheManager.get(cacheKey);
        if (cached) return cached;

        const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
        if (error) throw error;

        cacheManager.set(cacheKey, data);
        return data;
    },

    async createService(serviceData) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('services')
            .insert([{ ...serviceData, created_by: user.id }])
            .select().single();

        if (error) throw error;
        await this.logAction('CREATE', 'services', data.id, { title: data.title });
        cacheManager.invalidate('service'); // Invalidate all service related caches
        return data;
    },

    async updateService(id, updates) {
        const { data, error } = await supabase
            .from('services')
            .update(updates).eq('id', id).select().single();

        if (error) throw error;
        await this.logAction('UPDATE', 'services', id, updates);
        cacheManager.invalidate('service');
        return data;
    },

    async softDeleteService(id) {
        const { error } = await supabase
            .from('services')
            .update({ deleted_at: new Date().toISOString() }).eq('id', id);

        if (error) throw error;
        await this.logAction('DELETE', 'services', id);
        cacheManager.invalidate('service');
    },

    // --- Job Openings Operations ---

    async getJobOpenings(includeInactive = false) {
        const cacheKey = `jobs_${includeInactive}`;
        const cached = cacheManager.get(cacheKey);
        if (cached) return cached;

        let query = supabase.from('job_openings').select('*').is('deleted_at', null);
        if (!includeInactive) query = query.eq('status', 'published');

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        cacheManager.set(cacheKey, data);
        return data;
    },

    async getJobOpeningById(id) {
        const cacheKey = `job_${id}`;
        const cached = cacheManager.get(cacheKey);
        if (cached) return cached;

        const { data, error } = await supabase.from('job_openings').select('*').eq('id', id).single();
        if (error) throw error;

        cacheManager.set(cacheKey, data);
        return data;
    },

    async createJobOpening(jobData) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('job_openings')
            .insert([{ ...jobData, created_by: user?.id }]).select().single();

        if (error) throw error;
        await this.logAction('CREATE', 'job_openings', data.id, { title: data.title });
        cacheManager.invalidate('job');
        return data;
    },

    async updateJobOpening(id, updates) {
        const { data, error } = await supabase
            .from('job_openings').update(updates).eq('id', id).select().single();

        if (error) throw error;
        await this.logAction('UPDATE', 'job_openings', id, updates);
        cacheManager.invalidate('job');
        return data;
    },

    async softDeleteJobOpening(id) {
        const { error } = await supabase
            .from('job_openings').update({ deleted_at: new Date().toISOString() }).eq('id', id);

        if (error) throw error;
        await this.logAction('DELETE', 'job_openings', id);
        cacheManager.invalidate('job');
    },

    // --- Student Programs Operations ---

    async getStudentPrograms(includeInactive = false) {
        const cacheKey = `programs_${includeInactive}`;
        const cached = cacheManager.get(cacheKey);
        if (cached) return cached;

        let query = supabase.from('student_programs').select('*').is('deleted_at', null);
        if (!includeInactive) query = query.eq('status', 'published');

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        cacheManager.set(cacheKey, data);
        return data;
    },

    async getStudentProgramById(id) {
        const cacheKey = `program_${id}`;
        const cached = cacheManager.get(cacheKey);
        if (cached) return cached;

        const { data, error } = await supabase.from('student_programs').select('*').eq('id', id).single();
        if (error) throw error;

        cacheManager.set(cacheKey, data);
        return data;
    },

    async createStudentProgram(programData) {
        const { data, error } = await supabase.from('student_programs').insert([{ ...programData }]).select().single();
        if (error) throw error;
        await this.logAction('CREATE', 'student_programs', data.id, { title: data.title });
        cacheManager.invalidate('programs_true');
        cacheManager.invalidate('programs_false');
        return data;
    },

    async updateStudentProgram(id, updates) {
        const { data, error } = await supabase.from('student_programs').update(updates).eq('id', id).select().single();
        if (error) throw error;
        await this.logAction('UPDATE', 'student_programs', id, updates);
        cacheManager.invalidate('programs_true');
        cacheManager.invalidate('programs_false');
        cacheManager.invalidate(`program_${id}`);
        return data;
    },

    async softDeleteStudentProgram(id) {
        const { error } = await supabase.from('student_programs').update({ deleted_at: new Date().toISOString() }).eq('id', id);
        if (error) throw error;
        await this.logAction('DELETE', 'student_programs', id);
        cacheManager.invalidate('programs_true');
        cacheManager.invalidate('programs_false');
        cacheManager.invalidate(`program_${id}`);
    },

    // --- Blogs Operations ---

    async getBlogs(includeDrafts = false) {
        const cacheKey = `blogs_${includeDrafts}`;
        const cached = cacheManager.get(cacheKey);
        if (cached) return cached;

        let query = supabase.from('blogs').select('*');
        if (!includeDrafts) query = query.eq('status', 'published');

        const { data, error } = await query.order('published_at', { ascending: false });
        if (error) throw error;

        cacheManager.set(cacheKey, data);
        return data;
    },

    async getBlogBySlug(slug) {
        const cacheKey = `blog_${slug}`;
        const cached = cacheManager.get(cacheKey);
        if (cached) return cached;

        const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single();
        if (error) throw error;

        cacheManager.set(cacheKey, data);
        return data;
    },

    async createBlog(blogData) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!blogData.slug) {
            blogData.slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        const { data, error } = await supabase.from('blogs').insert([{ ...blogData }]).select().single();

        if (error) throw error;
        await this.logAction('CREATE', 'blogs', data.id, { title: data.title });
        cacheManager.invalidate('blog');
        return data;
    },

    async updateBlog(id, updates) {
        const { data, error } = await supabase.from('blogs').update(updates).eq('id', id).select().single();

        if (error) throw error;
        await this.logAction('UPDATE', 'blogs', id, updates);
        cacheManager.invalidate('blog');
        return data;
    },

    async softDeleteBlog(id) {
        const { error } = await supabase.from('blogs').update({ deleted_at: new Date().toISOString() }).eq('id', id);

        if (error) throw error;
        await this.logAction('DELETE', 'blogs', id);
        cacheManager.invalidate('blog');
    },

    // --- Applications Operations ---
    // Applications change frequently and are usually admin-only, cautious caching
    async getApplications() {
        const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async submitApplication(appData) {
        const { error } = await supabase.from('applications').insert([appData]);
        if (error) throw error;
        return true;
    },

    async updateApplicationStatus(id, status) {
        const { data, error } = await supabase.from('applications').update({ status }).eq('id', id).select().single();
        if (error) throw error;
        await this.logAction('UPDATE_STATUS', 'applications', id, { status });
        return data;
    },

    async getActivityLogs(limit = 10) {
        const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(limit);
        if (error) throw error;
        return data;
    },

    // --- Settings Operations ---

    async getSettings() {
        const cacheKey = 'site_settings';
        const cached = cacheManager.get(cacheKey);
        if (cached) return cached;

        const { data, error } = await supabase.from('site_settings').select('*');
        if (error) throw error;

        const settings = data.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        cacheManager.set(cacheKey, settings);
        return settings;
    },

    async updateSetting(key, value) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase.from('site_settings').upsert({
            key, value, updated_at: new Date().toISOString(), updated_by: user?.id
        }).select().single();

        if (error) throw error;
        await this.logAction('UPDATE_SETTING', 'site_settings', null, { key, value });
        cacheManager.invalidate('site_settings');
        return data;
    }
};
