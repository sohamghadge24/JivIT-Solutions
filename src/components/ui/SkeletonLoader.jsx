import { motion } from 'framer-motion';

export const ServiceCardSkeleton = () => (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 animate-pulse min-h-[400px]">
        <div className="w-16 h-16 bg-white/10 rounded-xl mb-6"></div>
        <div className="h-6 w-3/4 bg-white/10 rounded-md mb-4"></div>
        <div className="h-4 w-5/6 bg-white/10 rounded-md mb-8"></div>

        <div className="space-y-4">
            <div className="h-3 w-1/2 bg-white/10 rounded-md"></div>
            <div className="h-3 w-3/5 bg-white/10 rounded-md"></div>
            <div className="h-3 w-2/5 bg-white/10 rounded-md"></div>
        </div>
    </div>
);

export const SkeletonGrid = ({ count = 3 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: count }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
            ))}
        </div>
    );
};
