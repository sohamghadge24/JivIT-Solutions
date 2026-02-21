import React, { createContext, useContext, useRef, useCallback } from 'react';

const CacheContext = createContext(null);

export const CacheProvider = ({ children }) => {
    const cache = useRef(new Map());

    // Set items with Time To Live (Default 5 minutes)
    const setCache = useCallback((key, data, ttlMs = 5 * 60 * 1000) => {
        cache.current.set(key, {
            data,
            expiry: Date.now() + ttlMs,
        });
    }, []);

    const getCache = useCallback((key) => {
        const cached = cache.current.get(key);
        if (!cached) return null;

        if (Date.now() > cached.expiry) {
            cache.current.delete(key);
            return null;
        }

        return cached.data;
    }, []);

    const clearCache = useCallback((key) => {
        if (key) {
            cache.current.delete(key);
        } else {
            cache.current.clear();
        }
    }, []);

    return (
        <CacheContext.Provider value={{ getCache, setCache, clearCache }}>
            {children}
        </CacheContext.Provider>
    );
};

export const useCache = () => {
    const context = useContext(CacheContext);
    if (!context) {
        throw new Error('useCache must be used within a CacheProvider');
    }
    return context;
};
