import { useState, useEffect } from 'react';
import ServiceModal from '../../components/admin/ServiceModal';
import { adminService } from '../../lib/adminService';

const ServiceManager = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const data = await adminService.getServices(true);
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveService = async (formData) => {
        try {
            if (currentService) {
                await adminService.updateService(currentService.id, formData);
            } else {
                await adminService.createService(formData);
            }
            fetchServices();
            setIsModalOpen(false);
        } catch (error) {
            throw error;
        }
    };

    const handleEdit = (service) => {
        setCurrentService(service);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentService(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this service? This can be undone by an admin.')) {
            try {
                await adminService.softDeleteService(id);
                fetchServices();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const toggleStatus = async (service) => {
        const newStatus = service.status === 'published' ? 'draft' : 'published';
        try {
            await adminService.updateService(service.id, { status: newStatus });
            fetchServices();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredServices = services.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = services.filter(s => s.status === 'published').length;
    const maintenanceCount = services.filter(s => s.status === 'draft').length;
    const uptime = "99.98%";

    return (
        <>
            <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Services Management</h2>
                </div>
                <div className="flex-1 max-w-xl mx-8">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-slate-100"
                            placeholder="Search services, categories, or status..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="material-symbols-outlined p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">notifications</button>
                    <button
                        onClick={handleAddNew}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add New Service
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                {/* Metrics Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500">Total Services</span>
                            <span className="material-symbols-outlined text-primary">hub</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold">{services.length}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500">Operational</span>
                            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold">{activeCount}</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500">Maintenance/Draft</span>
                            <span className="material-symbols-outlined text-amber-500">settings_backup_restore</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold">{maintenanceCount}</h3>
                            <span className="text-xs font-semibold text-amber-500">Active</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500">Avg. Uptime</span>
                            <span className="material-symbols-outlined text-indigo-500">bolt</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold">{uptime}</h3>
                            <span className="text-xs font-semibold text-slate-400">Past 30d</span>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">Active Service Inventory</h4>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900">Export CSV</button>
                            <button className="px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900">Filter List</button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-primary">sync</span>
                            <p>Loading inventory...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Service Name</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {filteredServices.map(service => {
                                        const isOp = service.status === 'published';
                                        return (
                                            <tr key={service.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                            <span className="material-symbols-outlined text-lg">cloud</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold">{service.title}</span>
                                                            <span className="text-[10px] text-slate-500 truncate max-w-[250px]" title={service.subtitle}>{service.subtitle}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {service.category || 'Uncategorized'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleStatus(service)}
                                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${isOp
                                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                                                            }`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isOp ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                        {isOp ? 'Operational' : 'Draft / Maint'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleEdit(service)} className="material-symbols-outlined p-1.5 text-slate-400 hover:text-primary transition-colors text-lg" title="Edit">edit</button>
                                                        <button className="material-symbols-outlined p-1.5 text-slate-400 hover:text-primary transition-colors text-lg" title="Analytics">monitoring</button>
                                                        <button onClick={() => handleDelete(service.id)} className="material-symbols-outlined p-1.5 text-slate-400 hover:text-rose-500 transition-colors text-lg" title="Delete">delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredServices.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-8 text-slate-500">
                                                No services found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer Banner placeholder (optional extra premium feel) */}
                <div className="mt-8 p-5 bg-primary/10 border border-primary/20 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                            <span className="material-symbols-outlined">auto_fix_high</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-tight">System Optimization Available</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Regularly review your drafted services to keep your public portfolio clean.</p>
                        </div>
                    </div>
                </div>
            </div>

            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveService}
                service={currentService}
            />
        </>
    );
};

export default ServiceManager;
