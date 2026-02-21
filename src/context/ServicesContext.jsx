import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// CreateContext
const ServicesContext = createContext(null);

export const ServicesProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchAllServices = async () => {
            try {
                setLoading(true);
                // Smart Fetch Strategy
                // Only select required fields for the cards
                // Status = published and deleted_at is null
                const { data, error: sbError } = await supabase
                    .from('services')
                    .select('id,title,subtitle,description,benefits,image_url,icon_name,category')
                    .eq('status', 'published')
                    .is('deleted_at', null);

                if (sbError) throw sbError;
                if (isMounted) {
                    setServices(data || []);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchAllServices();

        return () => {
            isMounted = false;
        };
    }, []);

    // Memoized filter function to prevent unnecessary recalculations
    const getServicesByCategory = useCallback((category) => {
        return services.filter((s) => s.category === category);
    }, [services]);

    const value = useMemo(
        () => ({
            services,
            loading,
            error,
            getServicesByCategory,
        }),
        [services, loading, error, getServicesByCategory]
    );

    return (
        <ServicesContext.Provider value={value}>
            {children}
        </ServicesContext.Provider>
    );
};

export const useServices = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error('useServices must be used within a ServicesProvider');
    }
    return context;
};
