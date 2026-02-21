import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const PremiumDetail = ({
    category,
    title,
    subtitle,
    description,
    ctaText,
    ctaAction,
    imagePrimary,
    imageSecondary,
    benefits,
    backLink = "/",
}) => {
    const navigate = useNavigate();

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        },
    };

    const staggerContainer = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    return (
        <main className="min-h-screen lg:h-[100dvh] lg:max-h-screen w-full bg-white dark:bg-[#14171e] flex flex-col lg:flex-row lg:overflow-hidden">
            {/* Text Section */}
            <div className="flex-1 w-full lg:w-1/2 p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-center relative z-10 lg:h-full order-2 lg:order-1 pt-8 lg:pt-24 lg:overflow-hidden pb-16">
                <div className="flex justify-between items-center mb-6 lg:mb-8 shrink-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                        <span>←</span> Back
                    </button>
                </div>

                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl flex flex-col justify-center lg:h-full lg:overflow-y-auto pr-0 lg:pr-4 custom-scrollbar">
                    <motion.span variants={fadeInUp} className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-2 md:mb-4 block shrink-0">
                        {category}
                    </motion.span>
                    <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-normal tracking-tight text-slate-900 dark:text-white mb-2 md:mb-4 leading-[1.05] shrink-0" style={{ fontFamily: 'var(--font-heading)' }}>
                        {title}
                    </motion.h1>

                    {subtitle && (
                        <motion.h2 variants={fadeInUp} className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light mb-4 md:mb-6 italic shrink-0" style={{ fontFamily: 'var(--font-heading)' }}>
                            {subtitle}
                        </motion.h2>
                    )}

                    <motion.p variants={fadeInUp} className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed mb-6 md:mb-8 shrink-0">
                        {description}
                    </motion.p>

                    {benefits && benefits.length > 0 && (
                        <motion.div variants={fadeInUp} className="mb-6 md:mb-8 shrink-0">
                            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-3 md:mb-4">
                                Key Capabilities
                            </h3>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {benefits.map((benefit, idx) => (
                                    <span key={idx} className="px-4 py-2 text-[10px] md:text-xs lg:text-sm md:px-5 md:py-2.5 rounded-full border border-slate-200 dark:border-slate-800 font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 shadow-sm whitespace-nowrap">
                                        {benefit}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <motion.div variants={fadeInUp} className="shrink-0 mt-4 md:mt-8 pb-4 lg:pb-0">
                        {ctaAction ? (
                            <button onClick={ctaAction} className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors hover:-translate-y-1 shadow-xl hover:shadow-2xl">
                                {ctaText || "Request Consultation"}
                            </button>
                        ) : (
                            <Link to="/contact" className="inline-flex items-center justify-center px-8 md:px-10 py-3 md:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors hover:-translate-y-1 shadow-xl hover:shadow-2xl">
                                {ctaText || "Request Consultation"}
                            </Link>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            {/* Image Section */}
            <motion.div
                className="w-full lg:flex-1 lg:w-1/2 relative h-[45vh] lg:h-screen lg:overflow-hidden order-1 lg:order-2 shrink-0 pt-16 lg:pt-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
                <img
                    src={imagePrimary}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1] saturate-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white dark:from-[#14171e] via-transparent to-transparent opacity-50 pointer-events-none"></div>
            </motion.div>
        </main>
    );
};

export default PremiumDetail;
