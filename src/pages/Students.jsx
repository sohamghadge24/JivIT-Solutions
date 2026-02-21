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

const Students = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const data = await adminService.getStudentPrograms();
                setPrograms(data);
            } catch (error) {
                console.error('Error fetching student programs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    return (
        <main className="inst-page">
            <header className="inst-header relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-50 dark:bg-sky-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
                <div className="inst-container relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 items-center">
                        <div className="flex-1 w-full text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <span className="tracking-[0.2em] uppercase text-xs font-bold text-slate-400 mb-6 block">Student Programs</span>
                                <h1 className="text-5xl lg:text-7xl font-normal tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.05]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Launch Your<br />Tech Career
                                </h1>
                                <p className="text-xl text-slate-500 font-light leading-relaxed max-w-2xl">
                                    We help talented students turn their academic knowledge into real-world engineering experience through hands-on training and mentorship.
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
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                                    alt="Students Collaboration"
                                    className="w-full h-full object-cover filter contrast-[1.1] saturate-[0.8]"
                                />
                                <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-2xl"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {!loading && programs.length > 0 && (
                <section className="inst-section">
                    <div className="inst-container">
                        <motion.h2 className="inst-h2" {...fadeUp}>Active Cohorts & Opportunities</motion.h2>
                        <motion.ul className="inst-list" {...fadeUp} transition={{ delay: 0.2 }}>
                            {programs.map((prog) => (
                                <li key={prog.id}>
                                    <div>
                                        <div className="inst-item-title">{prog.title}</div>
                                        <div className="inst-item-meta">{prog.type} • {prog.status === 'open' ? 'Actively Recruiting' : 'Closed'}</div>
                                    </div>
                                    <Link to={`/students/${prog.id}`} className="inst-link">
                                        View Curriculum
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </Link>
                                </li>
                            ))}
                        </motion.ul>
                    </div>
                </section>
            )}

            <section className="inst-section">
                <div className="inst-container">
                    <div className="inst-grid">
                        <motion.div className="inst-text" {...fadeUp}>
                            <h2 className="inst-h2">Real-World Experience</h2>
                            <p className="inst-body">
                                The JivIT Fellowship is more than an internship. You will work on live projects alongside our senior developers, gaining valuable skills you can't learn in a classroom.
                            </p>
                            <h3 className="inst-h3" style={{ marginTop: '40px' }}>What You Will Learn</h3>
                            <ul className="inst-list" style={{ marginTop: '20px' }}>
                                <li>
                                    <span className="inst-item-title">Cloud Deployments</span>
                                </li>
                                <li>
                                    <span className="inst-item-title">Building Websites & Apps</span>
                                </li>
                                <li>
                                    <span className="inst-item-title">Data & AI Projects</span>
                                </li>
                            </ul>
                        </motion.div>
                        <motion.div className="inst-image-wrap inst-image-tall" {...fadeUp} transition={{ delay: 0.2 }}>
                            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80" alt="Students Collaboration" />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="inst-section no-border" style={{ paddingBottom: '160px' }}>
                <div className="inst-container" style={{ textAlign: 'center' }}>
                    <motion.div {...fadeUp}>
                        <Link to="/contact" className="inst-btn">
                            Apply Now
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default Students;
