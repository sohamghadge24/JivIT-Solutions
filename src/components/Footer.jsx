import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { adminService } from '../lib/adminService';
import logo from '../assets/JivitLogo.png';

// Module level cache to avoid refetching on route changes/remounts
let cachedSettings = null;

const Footer = () => {
    const [settings, setSettings] = useState(
        cachedSettings || {
            site_name: 'JivIT Solutions',
            contact_email: 'hello@jivitsolutions.com'
        }
    );

    useEffect(() => {
        if (cachedSettings) return; // Don't fetch if we already have it in cache

        const fetchSettings = async () => {
            try {
                const data = await adminService.getSettings();
                if (data) {
                    cachedSettings = { ...cachedSettings, ...data };
                    setSettings(cachedSettings);
                }
            } catch (error) {
                console.error('Footer settings fetch error:', error);
            }
        };
        fetchSettings();
    }, []);

    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#0B0F17] text-slate-300 pt-20 pb-10 overflow-hidden border-t border-slate-800/80">
            {/* Subtle Gradient / Noise top border effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

            {/* Soft background radial glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10">
                {/* Top Matrix - 4 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 flex flex-col gap-8 pr-0 lg:pr-8">
                        <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                            <img
                                src={logo}
                                alt={settings.site_name}
                                className="h-[52px] lg:h-[64px] w-auto object-contain brightness-0 invert opacity-90"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400 font-light max-w-sm">
                            Enterprise-grade software engineering and holistic human enablement platforms. Designed for resilience.
                        </p>
                    </div>

                    {/* Links Columns Container */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-10">
                        {/* Column 2 */}
                        <div className="flex flex-col gap-5">
                            <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-500">Platform</h4>
                            <div className="flex flex-col gap-3.5">
                                <Link to="/it-solutions" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">IT Solutions</Link>
                                <Link to="/wellness" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Wellness Systems</Link>
                                <Link to="/platform-enablement" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Enablement</Link>
                            </div>
                        </div>

                        {/* Column 3 */}
                        <div className="flex flex-col gap-5">
                            <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-500">Company</h4>
                            <div className="flex flex-col gap-3.5">
                                <Link to="/about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About Us</Link>
                                <Link to="/students" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Student Programs</Link>
                                <Link to="/careers" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Careers</Link>
                                <Link to="/blog" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Narratives</Link>
                            </div>
                        </div>

                        {/* Column 4 */}
                        <div className="flex flex-col gap-5">
                            <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-500">Connect</h4>
                            <div className="flex flex-col gap-3.5">
                                <Link to="/contact" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Contact Sales</Link>
                                <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Client Portal</Link>
                                <a href={`mailto:${settings.contact_email}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                                    Support
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                        <span>© {currentYear} {settings.site_name}. All rights reserved.</span>
                        <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></div>
                        <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
                        <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></div>
                        <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
                    </div>

                    <div className="flex items-center gap-5">
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                            <Linkedin className="w-4 h-4" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                            className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                        <a
                            href={`mailto:${settings.contact_email}`}
                            aria-label="Email"
                            className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                            <Mail className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
