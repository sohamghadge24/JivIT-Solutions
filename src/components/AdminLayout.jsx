import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <AdminSidebar />
            <main className="flex-1 ml-64 min-h-screen flex flex-col">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
