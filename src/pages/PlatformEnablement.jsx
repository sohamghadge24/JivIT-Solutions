import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { adminService } from '../lib/adminService';
import ScrollReveal from '../animations/ScrollReveal';

const PlatformEnablement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await adminService.getServices();
                const filtered = data.filter(s => s.category === 'platform-enablement');
                setServices(filtered);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <main className="inst-page">
            <header className="inst-header relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
                <div className="inst-container relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 items-center">
                        <div className="flex-1 w-full text-left">
                            <ScrollReveal>
                                <span className="tracking-[0.2em] uppercase text-xs font-bold text-slate-400 mb-6 block">Platforms</span>
                                <h1 className="text-5xl lg:text-7xl font-normal tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.05]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    Powerful<br />Digital Platforms
                                </h1>
                                <p className="text-xl text-slate-500 font-light leading-relaxed max-w-2xl">
                                    We build modern, scalable platforms that seamlessly connect your internal teams, partners, and customers into one unified experience.
                                </p>
                            </ScrollReveal>
                        </div>
                        <div className="flex-1 w-full">
                            <ScrollReveal>
                                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
                                    <img
                                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                                        alt="Global Digital Network"
                                        className="w-full h-full object-cover filter contrast-[1.1] saturate-[0.8]"
                                    />
                                    <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-2xl"></div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </header>

            {!loading && services.length > 0 && (
                <section className="inst-section">
                    <div className="inst-container">
                        <ScrollReveal>
                            <h2 className="inst-h2">Core Platforms</h2>
                        </ScrollReveal>
                        <ScrollReveal>
                            <div className="service-cards-grid">
                                {services.map((service) => (
                                    <Link to={`/services/${service.id}`} key={service.id} className="service-card">
                                        <h3 className="service-card-title">{service.title}</h3>
                                        <p className="service-card-subtitle">{service.subtitle}</p>
                                        <div className="service-card-watermark">PLATFORM</div>
                                    </Link>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            <section className="inst-section">
                <div className="inst-container">
                    <div className="inst-grid">
                        <ScrollReveal className="inst-text">
                            <h2 className="inst-h2">Connected Ecosystems</h2>
                            <p className="inst-body">
                                Future-proof your business with API-first ecosystems that foster innovation and integrate easily with third-party tools, bringing everything you need into one place.
                            </p>
                            <h3 className="inst-h3" style={{ marginTop: '40px' }}>What We Build</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '32px' }}>
                                {[
                                    'Web Application Platforms',
                                    'CMS & E-Commerce Integration',
                                    'Custom Portals & APIs',
                                    'Software Integrations',
                                    'Data Centers & Analytics'
                                ].map((feature, idx) => (
                                    <div key={idx} className="service-card" style={{ padding: '32px', minHeight: 'auto' }}>
                                        <h3 className="service-card-title" style={{ fontSize: '1.25rem', marginBottom: 0 }}>{feature}</h3>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>
                        <ScrollReveal className="inst-image-wrap inst-image-tall">
                            <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80" alt="Data and Platforms" />
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <section className="inst-section">
                <div className="inst-container">
                    <ScrollReveal>
                        <h2 className="inst-h2">The Value We Bring</h2>
                    </ScrollReveal>
                    <div className="inst-grid-3" style={{ marginTop: '48px' }}>
                        <ScrollReveal>
                            <h3 className="inst-h3">Speed</h3>
                            <p className="inst-body">Launch new features and products faster than ever before.</p>
                        </ScrollReveal>
                        <ScrollReveal>
                            <h3 className="inst-h3">Growth</h3>
                            <p className="inst-body">Effortlessly manage increasing users and data volumes safely.</p>
                        </ScrollReveal>
                        <ScrollReveal>
                            <h3 className="inst-h3">Connection</h3>
                            <p className="inst-body">Create smooth, easy connections between all your tools.</p>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <section className="inst-section no-border" style={{ paddingBottom: '160px' }}>
                <div className="inst-container" style={{ textAlign: 'center' }}>
                    <ScrollReveal>
                        <Link to="/service-form" state={{ serviceType: 'platform' }} className="inst-btn">
                            Get Started
                        </Link>
                    </ScrollReveal>
                </div>
            </section>
        </main>
    );
};

export default PlatformEnablement;
