import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { adminService } from '../lib/adminService';

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const Careers = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await adminService.getJobOpenings();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <main className="inst-page">
            <header className="inst-header relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-50 dark:bg-amber-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
                <div className="inst-container relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 items-center">
                        <div className="flex-1 w-full text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <span className="tracking-[0.2em] uppercase text-xs font-bold text-slate-400 mb-6 block">Join The Firm</span>
                                <h1 className="text-5xl lg:text-7xl font-normal tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.05]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Deploy your talent<br />where it matters most.
                                </h1>
                                <p className="text-xl text-slate-500 font-light leading-relaxed max-w-2xl">
                                    We are continuously seeking extraordinary computational talent, systems thinkers, and clinical wellness experts. If you demand rigor and intellectual density from your environment, your search ends here.
                                </p>
                            </motion.div>
                        </div>
                        <div className="flex-1 w-full">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
                                    alt="Professional Engineering Talent"
                                    className="w-full h-full object-cover filter contrast-[1.1] saturate-[0.8]"
                                />
                                <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-2xl"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {!loading && (
                <section className="inst-section">
                    <div className="inst-container">
                        <motion.h2 className="inst-h2" {...fadeUp}>Open Requisitions</motion.h2>

                        {jobs.length > 0 ? (
                            <motion.div className="service-cards-grid" {...fadeUp} transition={{ delay: 0.2 }}>
                                {jobs.map((job) => (
                                    <Link to={`/careers/${job.id}`} key={job.id} className="service-card">
                                        <h3 className="service-card-title">{job.title}</h3>
                                        <p className="service-card-subtitle">{job.department} • {job.location} • {job.type}</p>
                                        <div className="service-card-watermark">CAREER</div>
                                    </Link>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div {...fadeUp} transition={{ delay: 0.2 }} style={{ padding: '60px 0', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>We currently have no open requisitions published in our Database.</p>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '12px' }}>Please submit a general profile below for future consideration.</p>
                            </motion.div>
                        )}
                    </div>
                </section>
            )}

            <section className="inst-section">
                <div className="inst-container">
                    <div className="inst-grid">
                        <motion.div className="inst-image-wrap inst-image-tall" {...fadeUp}>
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Office Culture" />
                        </motion.div>
                        <motion.div className="inst-text" {...fadeUp} transition={{ delay: 0.2 }}>
                            <h2 className="inst-h2">Culture & Expectations</h2>
                            <p className="inst-body">
                                Our environment is flat, highly autonomous, and relentlessly focused on execution. We value deep conceptual understanding over memorization, and pragmatic shipping over endless deliberation.
                            </p>
                            <h3 className="inst-h3" style={{ marginTop: '40px' }}>What We Demand</h3>
                            <ul className="inst-list" style={{ marginTop: '20px' }}>
                                <li><span className="inst-item-title">Exacting Standards</span></li>
                                <li><span className="inst-item-title">Absolute Ownership</span></li>
                                <li><span className="inst-item-title">Radical Transparency</span></li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="inst-section no-border" style={{ paddingBottom: '160px' }}>
                <div className="inst-container" style={{ textAlign: 'center' }}>
                    <motion.div {...fadeUp}>
                        <Link to="/careers/general/apply" className="inst-btn">
                            Submit General Profile
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default Careers;
