import { useState, useEffect } from 'react';
import { adminService } from '../../lib/adminService';
import { useAdmin } from '../../hooks/useAdmin';

const Dashboard = () => {
    const { profile } = useAdmin();
    const [stats, setStats] = useState({
        services: 0,
        published_services: 0,
        jobs: 0,
        published_jobs: 0,
        applications: 0,
        new_applications: 0,
        recentLogs: [],
        system_status: 'operational'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const servicesData = await adminService.getServices(true).catch(() => []);
                const jobsData = await adminService.getJobOpenings(true).catch(() => []);
                const applicationsData = await adminService.getApplications().catch(() => []);
                const logsData = await adminService.getActivityLogs(8).catch(() => []);

                setStats({
                    services: servicesData.length,
                    published_services: servicesData.filter(s => s.status === 'published').length,
                    jobs: jobsData.length,
                    published_jobs: jobsData.filter(j => j.status === 'published').length,
                    applications: applicationsData.length,
                    new_applications: applicationsData.filter(a => a.status === 'new').length,
                    recentLogs: logsData,
                    system_status: 'operational'
                });
            } catch (error) {
                console.error('Critical Dashboard Error:', error);
                setStats(prev => ({ ...prev, system_status: 'degraded' }));
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
            <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-primary">refresh</span>
            <p className="font-medium animate-pulse">Initiating Command Center...</p>
        </div>
    );

    const userName = profile?.full_name?.split(' ')[0] || 'Admin';

    return (
        <>
            <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back, {userName}</h2>
                    <p className="text-xs text-slate-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-6">
                    {/* Status Indicator */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${stats.system_status === 'operational' ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30'}`}>
                        <span className="relative flex h-2 w-2">
                            {stats.system_status === 'operational' && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            )}
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${stats.system_status === 'operational' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </span>
                        <span className={`text-xs font-bold ${stats.system_status === 'operational' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>Supabase {stats.system_status}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => window.location.href = '/admin/services'} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 transition-colors" title="Search Services">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <button onClick={() => window.location.href = '/admin/applications'} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 transition-colors relative" title="View Applications">
                            <span className="material-symbols-outlined">notifications</span>
                            {(stats.new_applications > 0) && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <div className="p-8 flex-1 grid grid-cols-12 gap-8 overflow-y-auto">
                {/* Main Workspace (8 columns) */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/services'}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <span className="material-symbols-outlined">inventory_2</span>
                                </div>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full uppercase">Operational</span>
                            </div>
                            <h3 className="text-sm font-medium text-slate-500">Business Offerings</h3>
                            <p className="text-2xl font-bold mt-1">{stats.services} Live Services</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/hiring'}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <span className="material-symbols-outlined">group_add</span>
                                </div>
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase">Active Pipeline</span>
                            </div>
                            <h3 className="text-sm font-medium text-slate-500">Hiring Pipeline</h3>
                            <p className="text-2xl font-bold mt-1">{stats.jobs} Open Roles</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/applications'}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                    <span className="material-symbols-outlined">inbox</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full uppercase">Updated Just Now</span>
                            </div>
                            <h3 className="text-sm font-medium text-slate-500">Talent Intake</h3>
                            <p className="text-2xl font-bold mt-1">{stats.new_applications} Unread Apps</p>
                        </div>
                    </div>

                    {/* Quick Workflow Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold">Quick Workflow</h3>
                            <button className="text-sm font-semibold text-primary hover:underline" onClick={() => window.location.href = '/admin/services'}>View All Actions</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Action Card 1 */}
                            <div className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                                <div className="relative flex flex-col h-full">
                                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white mb-6 shadow-lg">
                                        <span className="material-symbols-outlined text-3xl">add_business</span>
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">New Service</h4>
                                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">Launch a new enterprise offering or digital product module to the marketplace.</p>
                                    <button onClick={() => window.location.href = '/admin/services'} className="mt-auto w-fit flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                        <span>Create Now</span>
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>

                            {/* Action Card 2 */}
                            <div className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                                <div className="relative flex flex-col h-full">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white mb-6 shadow-lg">
                                        <span className="material-symbols-outlined text-3xl">work</span>
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">Post Job</h4>
                                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">Broadcast a new vacancy to our partner networks and recruitment portals.</p>
                                    <button onClick={() => window.location.href = '/admin/hiring'} className="mt-auto w-fit flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-lg">
                                        <span>Post Now</span>
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Activity / Audit Trail Sidebar (4 columns) */}
                <aside className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm sticky top-28">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold">Audit Trail</h3>
                            <button onClick={() => window.location.href = '/admin/audit-logs'} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="View Logs List">
                                <span className="material-symbols-outlined text-slate-500 text-lg">filter_list</span>
                            </button>
                        </div>
                        <div className="space-y-8 relative">
                            {/* Vertical line */}
                            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800"></div>

                            {/* Activity Items */}
                            {stats.recentLogs.slice(0, 4).map((log, index) => {
                                const getIconAndColors = (action) => {
                                    switch (action.toLowerCase()) {
                                        case 'create': return { icon: 'add_circle', bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-white dark:border-slate-900', text: 'text-green-600' };
                                        case 'update': return { icon: 'edit', bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-white dark:border-slate-900', text: 'text-blue-600' };
                                        case 'delete': return { icon: 'delete', bg: 'bg-red-50 dark:bg-red-900/30', border: 'border-white dark:border-slate-900', text: 'text-red-600' };
                                        default: return { icon: 'sync', bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-white dark:border-slate-900', text: 'text-amber-600' };
                                    }
                                };
                                const style = getIconAndColors(log.action);

                                return (
                                    <div key={log.id || index} className="relative pl-10">
                                        <div className={`absolute left-0 w-8 h-8 rounded-full ${style.bg} flex items-center justify-center border-2 ${style.border} shadow-sm z-10`}>
                                            <span className={`material-symbols-outlined ${style.text} text-base`}>{style.icon}</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{log.action} {log.entity_type}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{userName} performed {log.action} on {log.entity_type}.</p>
                                        <p className="text-[10px] text-slate-400 font-medium mt-1">{new Date(log.created_at).toLocaleString()}</p>
                                    </div>
                                );
                            })}

                            {!stats.recentLogs.length && (
                                <p className="text-sm text-slate-500 pl-10">No recent activity.</p>
                            )}

                            <div className="relative pl-10 text-center">
                                <button onClick={() => window.location.href = '/admin/audit-logs'} className="text-xs font-bold text-primary hover:underline">View Older Activity</button>
                            </div>
                        </div>

                        {/* System Health Summary Card */}
                        <div className="mt-10 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Infrastructure</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-600 dark:text-slate-400">Database</span>
                                    <span className="font-bold text-green-500">99.9%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[99.9%]"></div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-600 dark:text-slate-400">API Gateway</span>
                                    <span className="font-bold text-primary">98.4%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[98.4%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
};

export default Dashboard;
