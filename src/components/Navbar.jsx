import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import logo from "../assets/JivitLogo.png";

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Passive scroll listener for performance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  const navLinks = useMemo(() => [
    { name: "About", path: "/about" },
    { name: "IT Solutions", path: "/it-solutions" },
    { name: "Platform", path: "/platform-enablement" },
    { name: "Wellness", path: "/wellness" },
    { name: "Students", path: "/students" }
  ], []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out ${scrolled
          ? "bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          : "bg-transparent border-b border-transparent"
          }`}
      >
        <div
          className={`max-w-[1280px] mx-auto px-6 md:px-8 lg:px-10 flex items-center justify-between transition-all duration-300 ease-in-out ${scrolled ? "h-[80px] lg:h-[90px]" : "h-[88px] lg:h-[98px]"
            }`}
        >
          {/* LEFT LOGO & OPTICAL ALIGNMENT */}
          <div className="flex-1 basis-0 flex justify-start items-center pr-12">
            <Link to="/" className="flex items-center transition-all duration-300 ">
              <img
                src={logo}
                alt="JivIT Solutions"
                className={`w-auto object-contain dark:invert transition-all duration-300 ease-in-out translate-y-[2px] ${scrolled ? "h-[56px] lg:h-[78px]" : "h-[64px] lg:h-[88px]"
                  }`}
              />
            </Link>
          </div>

          {/* CENTER NAV (Desktop) */}
          <nav className="hidden lg:flex items-center justify-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative text-[15px] font-medium tracking-wide transition-colors duration-200 group ${active ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  {link.name}
                  {/* Hover / Active underline indicator */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-slate-900 dark:bg-white transition-all duration-300 ease-out ${active ? "w-full" : "w-0 group-hover:w-full opacity-50 group-hover:opacity-100"
                      }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS (Desktop) */}
          <div className="hidden lg:flex flex-1 basis-0 justify-end items-center gap-6">
            <Link
              to="/login"
              className="text-[15px] font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/contact"
              className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[14px] font-medium tracking-wide hover:shadow-lg hover:shadow-slate-900/10 dark:hover:shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out"
            >
              Book a Demo
            </Link>
          </div>

          {/* MOBILE MENU BUTTON & ALIGNMENT */}
          <div className="flex-1 basis-0 flex justify-end items-center lg:hidden">
            <button
              className="p-2 -mr-2 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors z-[110]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU SLIDE-IN PANEL */}
      <div
        className={`fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[90] lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-[400px] bg-white dark:bg-[#0B0F17] shadow-2xl z-[100] lg:hidden transform transition-transform duration-300 ease-in-out flex flex-col ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex-1 overflow-y-auto pt-24 px-8 pb-8 flex flex-col gap-6">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-2xl font-medium tracking-tight transition-colors ${active ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/10 flex flex-col gap-5">
            <Link
              to="/login"
              className="text-lg font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Login to Portal
            </Link>
            <Link
              to="/contact"
              className="inline-flex justify-center items-center px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg font-medium tracking-wide shadow-md active:scale-[0.98] transition-all"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;