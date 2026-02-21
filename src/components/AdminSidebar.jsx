import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminSidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));

    const navItems = [
        { name: 'Overview', path: '/admin', icon: 'dashboard' },
        { name: 'Services', path: '/admin/services', icon: 'layers' },
        { name: 'Hiring Desk', path: '/admin/hiring', icon: 'badge' },
        { name: 'Students', path: '/admin/students', icon: 'school' },
        { name: 'Applications', path: '/admin/applications', icon: 'mail' },
    ];

    const systemItems = [
        { name: 'Audit Logs', path: '/admin/audit-logs', icon: 'history' },
        { name: 'Settings', path: '/admin/settings', icon: 'settings' },
        { name: 'Help Center', path: '#', icon: 'help' }
    ];

    const handleLogout = async () => {
        localStorage.removeItem('jivit_mock_admin');
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <aside className="w-64 bg-sidebar-dark text-slate-300 flex flex-col fixed h-full z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
                    <span className="material-symbols-outlined">rocket_launch</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-white text-lg font-bold leading-tight">Command Center</h1>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">JivIT Solutions</p>
                </div>
            </div>

            <nav className="flex-1 px-4 mt-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive(item.path)
                            ? 'bg-primary text-white shadow-sm'
                            : 'hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                        <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                ))}

                <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">System</div>

                {systemItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive(item.path)
                            ? 'bg-primary text-white shadow-sm'
                            : 'hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                        <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-xl group cursor-pointer hover:bg-slate-800 transition-colors" onClick={handleLogout} title="Click to Logout">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 text-slate-300 group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors overflow-hidden">
                        <span className="material-symbols-outlined text-sm">logout</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">Sign Out</p>
                        <p className="text-[10px] text-slate-500 truncate">Administrator</p>
                    </div>
                </div>
            </div>

            <style>{`
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            `}</style>
        </aside>
    );
};

export default AdminSidebar;
