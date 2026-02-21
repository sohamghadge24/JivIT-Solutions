import { useState, useEffect } from 'react';
import ProgramModal from '../../components/admin/ProgramModal';
import { adminService } from '../../lib/adminService';

const StudentManager = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProgram, setCurrentProgram] = useState(null);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const data = await adminService.getStudentPrograms(true);
            setPrograms(data);
        } catch (error) {
            console.error('Error fetching programs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProgram = async (formData) => {
        try {
            if (currentProgram) {
                await adminService.updateStudentProgram(currentProgram.id, formData);
            } else {
                await adminService.createStudentProgram(formData);
            }
            fetchPrograms();
            setIsModalOpen(false);
        } catch (error) {
            throw error;
        }
    };

    const handleEdit = (program) => {
        setCurrentProgram(program);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setCurrentProgram(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this posting?')) {
            try {
                await adminService.softDeleteStudentProgram(id);
                fetchPrograms();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const toggleStatus = async (program) => {
        const newStatus = program.status === 'published' ? 'draft' : 'published';
        try {
            await adminService.updateStudentProgram(program.id, { status: newStatus });
            fetchPrograms();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredJobs = programs.filter(j =>
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = programs.filter(j => j.status === 'published').length;
    const pendingOffers = 3;
    const totalApplicants = 45;

    return (
        <>
            {/* Header Section */}
            <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-40">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Student Programs</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Manage student programs and monitor recruitment pipelines.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none w-64 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                            placeholder="Search roles..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined text-xl">add</span>
                        Create Program
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <span className="material-symbols-outlined">assignment</span>
                            </div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Openings</p>
                        <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100">{activeCount}</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <span className="material-symbols-outlined">person_search</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">+15%</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Applicants</p>
                        <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100">{totalApplicants}</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <span className="material-symbols-outlined">calendar_today</span>
                            </div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Draft/Closed Apps</p>
                        <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100">{programs.length - activeCount}</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <span className="material-symbols-outlined">handshake</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">+10%</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Offers</p>
                        <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100">{pendingOffers}</h3>
                    </div>
                </div>

                {/* Job Pipeline Table Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">Student Programs Overview</h4>
                        <div className="flex gap-2">
                            <button className="text-sm font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Filter</button>
                            <button className="text-sm font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Export CSV</button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
                            <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-primary">sync</span>
                            <p>Loading programs......</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program Title & ID</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredJobs.map((program) => {
                                        const isOp = program.status === 'published';
                                        return (
                                            <tr key={program.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-default">
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{program.title}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{program.type} • {program.location}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm text-slate-600 dark:text-slate-300">{program.department}</span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleStatus(program); }}
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${isOp
                                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-200'
                                                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 hover:bg-amber-200'
                                                            }`}
                                                    >
                                                        {isOp ? 'Active' : 'Draft / Closed'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEdit(program); }}
                                                            className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                                                            title="Edit"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(program.id); }}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredJobs.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12 text-slate-500">
                                                <p>No postings found matching your search. Start growing your team!</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Promotional UI - Optional premium extra */}
                <div className="mt-8 bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-xl border border-primary/20 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
                    <div className="relative z-10 max-w-xl">
                        <h5 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Need Specialized Talent?</h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-0 leading-relaxed">Boost your open roles with our automated sourcing tool to find 10x more qualified candidates from global tech networks.</p>
                    </div>
                    <button className="mt-4 md:mt-0 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap z-10 relative shadow-md">
                        Launch Sourcing AI
                    </button>
                    <span className="material-symbols-outlined text-[100px] absolute -right-2 -bottom-2 text-primary opacity-20 pointer-events-none">rocket_launch</span>
                </div>
            </div>

            <ProgramModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProgram}
                program={currentProgram}
            />
        </>
    );
};

export default StudentManager;
