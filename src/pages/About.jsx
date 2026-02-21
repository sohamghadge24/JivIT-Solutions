import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const About = () => {
    return (
        <main className="inst-page">
            <header className="inst-header relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50 dark:bg-slate-800/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
                <div className="inst-container relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 items-center">
                        <div className="flex-1 w-full text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <span className="tracking-[0.2em] uppercase text-xs font-bold text-slate-400 mb-6 block">Institutional Overview</span>
                                <h1 className="text-5xl lg:text-7xl font-normal tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.05]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Architecting the next<br />era of global infrastructure.
                                </h1>
                                <p className="text-xl text-slate-500 font-light leading-relaxed max-w-2xl">
                                    JivIT Solutions is a leading technology advisory and engineering firm.
                                    We partner with visionary organizations to navigate complexity,
                                    build scalable systems, and drive enduring impact across IT, Platforms, and Wellness.
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
                                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                                    alt="Corporate Architecture"
                                    className="w-full h-full object-cover filter contrast-[1.1] saturate-[0.8]"
                                />
                                <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-2xl"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="inst-section">
                <div className="inst-container">
                    <div className="inst-grid">
                        <motion.div className="inst-text" {...fadeUp}>
                            <h2 className="inst-h2">Our Methodology</h2>
                            <p className="inst-body">
                                At the intersection of rigorous engineering and business strategy,
                                true digital transformation occurs. We do not just build software;
                                we architect resilience.
                            </p>
                            <p className="inst-body">
                                Our methodology relies on deterministic outcomes, robust data
                                modeling, and an uncompromising commitment to long-term scalability.
                                We exist to solve the hardest problems.
                            </p>
                            <Link to="/contact" className="inst-link" style={{ marginTop: '24px' }}>
                                View our capabilities
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </Link>
                        </motion.div>
                        <motion.div className="inst-image-wrap inst-image-tall" {...fadeUp} transition={{ delay: 0.2 }}>
                            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80" alt="Corporate Architecture" />
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="inst-section no-border" style={{ paddingBottom: '160px' }}>
                <div className="inst-container" style={{ textAlign: 'center' }}>
                    <motion.h2 className="inst-h2" {...fadeUp}>Engage with our leadership</motion.h2>
                    <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
                        <Link to="/contact" className="inst-btn">
                            Book a Consultation
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default About;
