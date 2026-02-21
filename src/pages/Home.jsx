import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { adminService } from '../lib/adminService';
import heroEarth from "../assets/hero_earth_editorial.png";
import ScrollReveal from '../animations/ScrollReveal';

const Home = () => {
    const [missionData, setMissionData] = useState({
        it: null,
        wellness: null
    });
    const [latestBlogs, setLatestBlogs] = useState([]);
    const [settings, setSettings] = useState({
        hero_tagline: 'Orchestrating Digital Future & Human Potential',
        hero_description: 'JivIT Solutions bridges the gap between enterprise-grade engineering and holistic human growth. We build resilient platforms and empower thriving organizations. Amalgamation of Inner transformation through Information Technology',
        mission_it_label: 'IT Solutions',
        mission_wellness_label: 'Wellness'
    });

    useEffect(() => {
        const fetchHomeData = async () => {
            // Fail-safe: loading ends after 8 seconds to show default content
            const timer = setTimeout(() => {
                setMissionData({ it: null, wellness: null });
            }, 8000);

            try {
                const settingsData = await adminService.getSettings();
                if (settingsData) setSettings(prev => ({ ...prev, ...settingsData }));

                const services = await adminService.getServices();
                if (services && Array.isArray(services)) {
                    const itService = services.find(s => s.category === 'it-solutions');
                    const wellnessService = services.find(s => s.category === 'wellness');
                    const platformService = services.find(s => s.category === 'platform-enablement');

                    setMissionData({
                        it: itService,
                        wellness: wellnessService,
                        platform: platformService
                    });
                }

                const blogs = await adminService.getBlogs();
                if (blogs && Array.isArray(blogs)) {
                    setLatestBlogs(blogs.slice(0, 3));
                }
                clearTimeout(timer);
            } catch (error) {
                console.error('Home Data Load Error:', error);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <div className="home-wrapper">
            {/* ================= HERO SECTION ================= */}
            <section className="hero-premium relative overflow-hidden flex items-center bg-[var(--bg-main)] min-h-[800px] h-screen pt-20">
                <div className="container relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6">
                    <div className="flex flex-col items-start text-left">
                        <ScrollReveal>
                            <div className="font-body text-xs tracking-[0.3em] uppercase text-[var(--text-tertiary)] mb-6">
                                Elevating Human & Digital Realms
                            </div>
                            <h1 className="font-heading text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)] mb-10">
                                {settings.hero_tagline.replace('Orchestrating', 'Mastery in')}
                            </h1>
                            <p className="font-body text-xl md:text-2xl text-[var(--text-secondary)] font-light leading-[1.8] max-w-2xl mb-12">
                                {settings.hero_description}
                            </p>
                        </ScrollReveal>

                        <ScrollReveal>
                            <div className="flex flex-wrap gap-5">
                                <Link to="/wellness" className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-white)] rounded-full text-sm tracking-[0.05em] transition-all hover:bg-transparent hover:text-[var(--text-primary)] border border-[var(--text-primary)]">
                                    Astro Wellness
                                </Link>
                                <Link to="/it-solutions" className="px-8 py-4 bg-transparent text-[var(--text-primary)] rounded-full text-sm tracking-[0.05em] transition-all hover:border-[var(--text-primary)] border border-black/10">
                                    IT Solutions
                                </Link>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal>
                            <div className="flex gap-16 mt-20 pt-10 border-t border-black/5 w-full">
                                {[{ val: 'Tier-1', lbl: 'Enterprise Standards' }, { val: 'Global', lbl: 'Scalable Reach' }].map((stat, i) => (
                                    <div key={i}>
                                        <div className="font-heading text-xl text-[var(--text-primary)] mb-1">{stat.val}</div>
                                        <div className="font-body text-xs uppercase tracking-[0.15em] text-[var(--text-tertiary)]">{stat.lbl}</div>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal className="relative w-full flex justify-center">
                        <div className="relative w-full max-w-[600px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src={heroEarth}
                                alt="Global Enterprise Systems"
                                className="w-full h-full object-cover filter contrast-[1.05] brightness-95 saturate-[0.8]"
                            />
                            <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none" />
                        </div>
                    </ScrollReveal>
                </div>

                {/* Subtle Background Shifts */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-main)] pointer-events-none z-[2]" />
            </section>

            {/* ================= CORE PILLARS SECTION ================= */}
            <section className="about-values py-32 bg-[var(--bg-main)]">
                <div className="container">
                    <ScrollReveal className="text-center mb-20">
                        <span className="block mb-4 text-sm uppercase tracking-[0.15em] text-[var(--text-secondary)]">Our Core Ecosystem</span>
                        <h2 className="text-5xl font-medium text-[var(--text-primary)] mb-6 tracking-tight">Engineering Digital & Human Potential</h2>
                        <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
                            We bridge the gap between scalable enterprise infrastructure, personal well-being, and business enablement. A holistic approach to modern growth.
                        </p>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <ScrollReveal className="p-10 bg-[var(--bg-white)] rounded-2xl border border-black/5 shadow-sm">
                            <h3 className="text-2xl font-medium mb-4 text-[var(--text-primary)]">{settings.mission_it_label}</h3>
                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">{missionData.it?.blogs || 'Enterprise-grade cloud architecture, custom software development, and scalable technical infrastructure.'}</p>
                            <Link to="/it-solutions" className="text-sm uppercase tracking-wide text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-1">Explore IT &rarr;</Link>
                        </ScrollReveal>

                        <ScrollReveal className="p-10 bg-[var(--bg-white)] rounded-2xl border border-black/5 shadow-sm">
                            <h3 className="text-2xl font-medium mb-4 text-[var(--text-primary)]">{settings.mission_wellness_label}</h3>
                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">{missionData.wellness?.blogs || 'Transformative mindfulness, coaching, and holistic wellness platforms dedicated to human growth.'}</p>
                            <Link to="/wellness" className="text-sm uppercase tracking-wide text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-1">Explore Wellness &rarr;</Link>
                        </ScrollReveal>

                        <ScrollReveal className="p-10 bg-[var(--bg-white)] rounded-2xl border border-black/5 shadow-sm">
                            <h3 className="text-2xl font-medium mb-4 text-[var(--text-primary)]">Platform Enablement</h3>
                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">{missionData.platform?.blogs || 'Digital empowerment for independent professionals and small businesses. We provide the tools you need to scale.'}</p>
                            <Link to="/platform-enablement" className="text-sm uppercase tracking-wide text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-1">Explore Platform &rarr;</Link>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ================= CAPABILITIES / SERVICES ================= */}
            <section className="services-features py-32 bg-[var(--bg-alt)]">
                <div className="container">
                    <ScrollReveal className="mb-20">
                        <span className="block mb-4 text-sm uppercase tracking-[0.15em] text-[var(--text-secondary)]">Capabilities</span>
                        <h2 className="text-5xl font-medium text-[var(--text-primary)] max-w-2xl tracking-tight m-0">Structured for impact across all verticals</h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { category: 'IT Solutions', title: 'Cloud Infrastructure', benefit: 'Reduce latency by 40% with globally distributed edge networks.' },
                            { category: 'IT Solutions', title: 'Data Intelligence', benefit: 'Turn raw data into actionable insights with real-time analytics.' },
                            { category: 'Wellness', title: 'Life Coaching', benefit: 'Personalized programs to align professional ambition with inner peace.' },
                            { category: 'Platform', title: 'Business Visibility', benefit: 'End-to-end digital enablement ensuring your services reach the right audience.' }
                        ].map((service, idx) => (
                            <ScrollReveal key={idx} className="p-10 bg-[var(--bg-white)] border-t-2 border-[var(--text-primary)] flex flex-col">
                                <span className="text-xs uppercase text-[var(--text-secondary)] tracking-widest mb-4">{service.category}</span>
                                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                                <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{service.benefit}</p>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= PROCESS ================= */}
            <section className="process-horizontal py-32 bg-[var(--bg-main)]">
                <div className="container">
                    <ScrollReveal className="mb-20">
                        <span className="block mb-4 text-sm uppercase tracking-[0.15em] text-[var(--text-secondary)]">Methodology</span>
                        <h2 className="text-5xl font-medium text-[var(--text-primary)] tracking-tight m-0">How we deliver excellence</h2>
                    </ScrollReveal>

                    <ScrollReveal>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                            {[
                                { num: '01', title: 'Audit & Align', desc: 'Thorough analysis of existing infrastructure and alignment with core personal or business objectives.' },
                                { num: '02', title: 'Strategic Design', desc: 'Drafting scalable, secure systems or personalized wellness blueprints tailored to specific requirements.' },
                                { num: '03', title: 'Execution', desc: 'Agile development and guided implementation with rigorous standards at every stage.' },
                                { num: '04', title: 'Sustain & Scale', desc: 'Continuous monitoring, integration, and optimization for long-term growth.' }
                            ].map((step, idx) => (
                                <div key={idx} className="pl-8 border-l border-black/10">
                                    <div className="text-2xl font-heading text-[var(--text-secondary)] mb-6">{step.num}</div>
                                    <h3 className="text-2xl font-medium mb-4 text-[var(--text-primary)]">{step.title}</h3>
                                    <p className="text-[var(--text-secondary)] text-base leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ================= CASE STUDIES / IMPACT ================= */}
            <section className="case-studies py-32 bg-[#111215] text-white">
                <div className="container">
                    <ScrollReveal className="mb-20">
                        <span className="block mb-4 text-sm uppercase tracking-[0.15em] text-white/60">Impact</span>
                        <h2 className="text-5xl font-medium tracking-tight m-0">Proven results at scale</h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { category: 'IT Solutions', client: 'Global FinTech', metric: '99.999%', metricDesc: 'Uptime Achieved', desc: 'Re-architected core transaction ledger to handle 10x throughput with zero data loss.' },
                            { category: 'Wellness', client: 'Executive Coaching', metric: '40%', metricDesc: 'Productivity Increase', desc: 'Structured mindfulness programs delivered dramatic improvements in corporate leadership focus.' },
                            { category: 'Platform Enablement', client: 'Independent Practitioners', metric: '3x', metricDesc: 'Client Acquisition', desc: 'Empowered individual healers with enterprise-level booking and visibility platforms.' }
                        ].map((study, idx) => (
                            <ScrollReveal key={idx} className="p-12 bg-[#1C1D21] rounded-2xl relative">
                                <div className="text-xs uppercase tracking-widest text-emerald-400 mb-4">{study.category}</div>
                                <div className="text-sm uppercase tracking-widest text-white/50 mb-10">{study.client}</div>
                                <div className="text-6xl font-light text-white mb-2 leading-none">{study.metric}</div>
                                <div className="text-base text-[#637081] font-medium mb-8">{study.metricDesc}</div>
                                <p className="text-lg text-white/70 leading-relaxed">{study.desc}</p>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= TESTIMONIALS ================= */}
            <section className="testimonials py-32 bg-[var(--bg-alt)]">
                <div className="container max-w-4xl text-center">
                    <ScrollReveal>
                        <div className="text-5xl text-[var(--text-secondary)] mb-4 leading-none">"</div>
                        <h3 className="text-3xl font-normal text-[var(--text-primary)] leading-snug mb-10">
                            JivIT Solutions brought an unmatched level of engineering rigor to our organization. They didn't just write code; they transformed our entire digital operating model.
                        </h3>
                        <div className="flex flex-col items-center">
                            <div className="font-semibold text-lg text-[var(--text-primary)]">Sarah Jenkins</div>
                            <div className="text-base text-[var(--text-secondary)]">CTO, Enterprise Logistics Plus</div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* ================= CAREERS / STUDENTS ================= */}
            <section className="careers-section py-32 bg-[var(--bg-main)]">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <ScrollReveal>
                            <span className="block mb-4 text-sm uppercase tracking-[0.15em] text-[var(--text-secondary)]">Careers</span>
                            <h2 className="text-5xl font-medium text-[var(--text-primary)] mb-6 tracking-tight">Join the ecosystem</h2>
                            <p className="text-xl text-[var(--text-secondary)] mb-10 leading-relaxed max-w-lg">
                                We are always looking for exceptional engineers, product thinkers, and researchers to push the boundaries of enterprise technology.
                            </p>
                            <Link to="/students" className="inline-block px-8 py-4 bg-[var(--text-primary)] text-white rounded shadow-md hover:shadow-lg transition">View Open Roles</Link>
                        </ScrollReveal>
                        <ScrollReveal className="flex flex-col gap-6">
                            <div className="p-8 bg-[var(--bg-white)] border border-black/5 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition">
                                <div>
                                    <h4 className="text-xl font-medium mb-2 text-[var(--text-primary)]">Senior Cloud Architect</h4>
                                    <p className="text-[var(--text-secondary)] m-0">Remote / Global</p>
                                </div>
                                <Link to="/students" className="px-6 py-3 border border-[var(--text-primary)] text-[var(--text-primary)] rounded font-medium hover:bg-[var(--text-primary)] hover:text-white transition">Apply</Link>
                            </div>
                            <div className="p-8 bg-[var(--bg-white)] border border-black/5 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition">
                                <div>
                                    <h4 className="text-xl font-medium mb-2 text-[var(--text-primary)]">Systems Engineering Intern</h4>
                                    <p className="text-[var(--text-secondary)] m-0">Hybrid / Headquarters</p>
                                </div>
                                <Link to="/students" className="px-6 py-3 border border-[var(--text-primary)] text-[var(--text-primary)] rounded font-medium hover:bg-[var(--text-primary)] hover:text-white transition">Apply</Link>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ================= CONTACT / CTA ================= */}
            <section className="cta-final py-40 bg-[#9d8b8b] text-white text-center">
                <div className="container max-w-3xl">
                    <ScrollReveal>
                        <h2 className="text-6xl font-medium mb-8 tracking-tight text-black">Ready to elevate your infrastructure?</h2>
                        <p className="text-2xl text-black/70 mb-14 leading-relaxed">
                            Schedule a technical consultation to discuss your specific requirements with our engineering leaders.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Work email address" className="flex-1 py-4 px-6 rounded border-none text-base outline-none bg-[#1C1D21] text-white" />
                            <button type="submit" className="py-4 px-8 bg-white text-black border-none rounded text-base font-semibold hover:bg-gray-100 transition whitespace-nowrap">Get Started</button>
                        </form>
                        <div className="mt-6 text-sm text-black/50">No commitment required.</div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
};

export default Home;
