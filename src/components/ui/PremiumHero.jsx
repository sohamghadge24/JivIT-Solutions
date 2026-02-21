import React from 'react';
import { motion } from 'framer-motion';
import { heroVariants } from '../../animations/revealVariants';

const PremiumHero = ({ title, subtitle, tagline, backgroundImage }) => {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background with blur up loading trick */}
            <div className="absolute inset-0 z-0">
                {backgroundImage && (
                    <img
                        src={backgroundImage}
                        alt="Hero Background"
                        loading="eager"
                        fetchPriority="high"
                        className="w-full h-full object-cover opacity-30 select-none"
                    />
                )}
                {/* Soft gradient shift, no moving particles, no parallax */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#09090b]/95 via-[#09090b]/80 to-[#18181b]/95 mix-blend-multiply"></div>
            </div>

            <div className="container relative z-10 px-6 mx-auto">
                <div className="max-w-4xl mx-auto text-center">
                    {tagline && (
                        <motion.p
                            variants={heroVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-emerald-400 font-mono text-sm tracking-[0.2em] uppercase mb-8"
                        >
                            {tagline}
                        </motion.p>
                    )}

                    <motion.h1
                        variants={heroVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-8 leading-[1.05]"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        variants={heroVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>
                </div>
            </div>

            {/* Cinematic Fog Line */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#09090b] to-transparent z-10"></div>
        </section>
    );
};

export default PremiumHero;
