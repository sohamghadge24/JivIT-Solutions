import { motion } from 'framer-motion';

const PremiumLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#0A0D14] flex flex-col items-center justify-center font-display" style={{ overflow: 'hidden' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center gap-6"
            >
                {/* Minimalist spinner / ring */}
                <div className="relative w-16 h-16">
                    <motion.div
                        className="absolute inset-0 rounded-full border border-slate-800"
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-t border-r border-[#85a1da]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <div className="text-center overflow-hidden">
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    >
                        <h2 className="text-white text-xl tracking-widest uppercase font-light">Loading</h2>
                        <span className="block mt-2 text-xs font-bold tracking-[0.3em] text-[#85a1da] uppercase">JivIT Solutions</span>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default PremiumLoader;
