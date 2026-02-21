import { useState, useEffect } from 'react';
import { adminService } from '../../lib/adminService';
import { Mail, Phone, Calendar } from 'lucide-react';

const ApplicationInbox = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const data = await adminService.getApplications();
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await adminService.updateApplicationStatus(id, newStatus);
            fetchApplications();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredApplications = applications.filter(app =>
        app.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.source_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const pendingCount = applications.filter(a => a.status === 'new' || a.status === 'reviewing').length;
    const acceptedCount = applications.filter(a => a.status === 'accepted').length;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'new': return 'bg-primary/10 text-primary';
            case 'reviewing': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400';
            case 'accepted': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
            case 'rejected': return 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
        }
    };

    const getInitials = (first, last) => {
        return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase() || '??';
    };

    return (
        <>
            <div className="flex-1 flex flex-col max-w-[1440px] w-full px-4 lg:px-8 py-8 gap-8 overflow-y-auto">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">Applications</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Manage and track your recruitment pipeline across all departments.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 text-slate-700 dark:text-slate-300 text-sm font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800">
                            <span className="material-symbols-outlined text-xl">download</span>
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Applications</p>
                        </div>
                        <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">{applications.length}</p>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Review</p>
                        </div>
                        <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">{pendingCount}</p>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Accepted/Hired</p>
                        </div>
                        <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">{acceptedCount}</p>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-sm justify-center items-center opacity-50 cursor-not-allowed hidden lg:flex">
                        <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">bar_chart</span>
                        <span className="text-xs font-medium">Analytics coming soon</span>
                    </div>
                </div>

                <div className="flex flex-col rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="flex flex-wrap gap-3 items-center flex-1">
                            <div className="relative min-w-[280px]">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                                <input
                                    className="w-full pl-10 pr-4 h-10 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm focus:ring-primary focus:border-primary text-slate-900 dark:text-white"
                                    placeholder="Search by name, role or email..."
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
                            <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-primary">sync</span>
                            <p>Loading inbox...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Candidate Profile</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Applied For</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Submission Date</th>
                                        <th className="px-4 py-4 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredApplications.map(app => (
                                        <tr key={app.id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm border border-slate-200 dark:border-slate-700 shrink-0">
                                                        {getInitials(app.first_name, app.last_name)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{app.first_name} {app.last_name}</p>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                            <Mail size={12} /> <span className="truncate max-w-[150px]">{app.email}</span>
                                                            {app.phone && <><span className="mx-1">•</span> <Phone size={12} /> {app.phone}</>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium capitalize">{app.source_type}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                                        className={`text-xs font-bold uppercase tracking-tight rounded-lg px-2.5 py-1.5 border-none outline-none cursor-pointer hover:opacity-80 transition-opacity ${getStatusStyle(app.status)}`}
                                                        style={{ WebkitAppearance: 'none', appearance: 'none' }}
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="reviewing">Reviewing</option>
                                                        <option value="accepted">Accepted</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    {new Date(app.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    {app.resume_url && (
                                                        <a href={app.resume_url} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/70 text-sm font-semibold flex items-center gap-1 transition-colors">
                                                            Resume <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredApplications.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-12 text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                                        <span className="material-symbols-outlined text-3xl">inbox</span>
                                                    </div>
                                                    <p className="text-sm font-medium">No applications found in the inbox.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ApplicationInbox;
