import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const ServiceModal = ({ isOpen, onClose, onSave, service = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        category: 'it-solutions',
        benefits: '',
        status: 'draft'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (service) {
            setFormData({
                ...service,
                benefits: Array.isArray(service.benefits) ? service.benefits.join('\n') : ''
            });
        } else {
            setFormData({
                title: '',
                subtitle: '',
                description: '',
                category: 'it-solutions',
                benefits: '',
                status: 'draft'
            });
        }
    }, [service, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            benefits: formData.benefits.split('\n').filter(b => b.trim() !== '')
        };

        try {
            await onSave(payload);
            onClose();
        } catch (error) {
            alert('Error saving service: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-[650px] max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto border border-slate-200 dark:border-slate-800 animate-[modalSlideUp_0.3s_ease-out]">
                <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {service ? 'Edit Service Details' : 'Deploy New Service'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., Strategic IT Consulting"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subtitle / Summary</label>
                            <input
                                type="text"
                                placeholder="e.g., Aligning technology with business velocity"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="it-solutions">IT Solutions</option>
                                <option value="wellness">Wellness & Healing</option>
                                <option value="platform-enablement">Platform Enablement</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Publishing Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="draft">Draft (Hidden)</option>
                                <option value="published">Published (Live)</option>
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detailed Description</label>
                            <textarea
                                rows="4"
                                placeholder="Describe the service in detail..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none placeholder:text-slate-400"
                            ></textarea>
                        </div>

                        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Benefits (One per line)</label>
                            <textarea
                                rows="5"
                                placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                                value={formData.benefits}
                                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none placeholder:text-slate-400"
                            ></textarea>
                            <span className="text-xs text-slate-400">List 4-6 key advantages your clients will get.</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl font-bold text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white flex items-center gap-2 hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20 disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            <Save size={18} />
                            <span>{loading ? 'Committing...' : 'Commit Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes modalSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ServiceModal;
