import React, { memo } from 'react';
import * as Icons from 'lucide-react';

const ServiceCard = memo(({ service }) => {
    const IconComponent = Icons[service.icon_name] || Icons.Code;

    return (
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:shadow-2xl hover:shadow-white/10 transition-transform duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

            <div className="relative z-10">
                <div className="mb-6 inline-block p-4 rounded-xl bg-white/10 text-white/90 group-hover:text-white transition-colors duration-300">
                    <IconComponent size={28} strokeWidth={1.5} className="group-hover:rotate-3 transition-transform duration-300" />
                </div>

                <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">
                    {service.title}
                </h3>
                <p className="text-white/60 mb-6 font-light leading-relaxed">
                    {service.subtitle}
                </p>

                {service.benefits && service.benefits.length > 0 && (
                    <ul className="space-y-3 mb-6">
                        {service.benefits.slice(0, 3).map((benefit, i) => (
                            <li key={i} className="flex items-center text-sm text-white/70">
                                <Icons.CheckCircle2 className="w-4 h-4 mr-3 text-white/40" />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex items-center text-sm font-medium text-white/50 group-hover:text-white/90 transition-colors">
                    Explore Solution
                    <Icons.ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
            </div>
        </div>
    );
});

export default ServiceCard;
