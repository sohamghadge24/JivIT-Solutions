import { useState, useEffect } from 'react';
import { adminService } from '../../lib/adminService';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const logsData = await adminService.getActivityLogs(50).catch(() => []);
                setLogs(logsData);
            } catch (error) {
                console.error('Error fetching audit logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
            <span className="material-symbols-outlined animate-spin text-4xl mb-4 text-primary">refresh</span>
            <p className="font-medium animate-pulse">Loading Audit Trail...</p>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto w-full">
            <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audit Trail</h2>
                    <p className="text-xs text-slate-500 font-medium">System wide activity logs</p>
                </div>
            </header>

            <div className="p-8 max-w-5xl mx-auto space-y-8">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity Logs</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {logs.length > 0 ? (
                            logs.map((log, index) => {
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
                                    <div key={log.id || index} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                        <div className={`w-10 h-10 rounded-full flex-shrink-0 ${style.bg} flex items-center justify-center border-2 ${style.border}`}>
                                            <span className={`material-symbols-outlined ${style.text} text-xl`}>{style.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{log.action} {log.entity_type}</p>
                                                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Admin performed {log.action} operation on a {log.entity_type} record.
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-8">No activity logs found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
