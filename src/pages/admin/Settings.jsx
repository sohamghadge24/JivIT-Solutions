import { useState, useEffect } from 'react';
import { adminService } from '../../lib/adminService';
import { Info, RefreshCw } from 'lucide-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        site_name: 'JivIT Solutions',
        contact_email: 'hello@jivitsolutions.com',
        maintenance_mode: false,
        enable_applications: true,
        notification_email: 'admin@jivitsolutions.com',
        social_links: {
            linkedin: '',
            twitter: '',
            instagram: ''
        }
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await adminService.getSettings();
            if (Object.keys(data).length > 0) {
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const promises = Object.entries(settings).map(([key, value]) =>
                adminService.updateSetting(key, value)
            );
            await Promise.all(promises);
            setMessage({ type: 'success', text: 'All settings saved successfully!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Error saving settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
                <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-primary">sync</span>
                <p>Loading configuration...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex justify-center py-8 px-4 sm:px-10 overflow-y-auto w-full">
            <div className="w-full max-w-[1024px] flex flex-col gap-6">
                {/* Page Header */}
                <div className="flex flex-col gap-1 relative">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">System Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base">Configure global parameters and platform preferences.</p>
                    <button
                        onClick={fetchSettings}
                        className="absolute right-0 top-0 p-2 text-slate-400 hover:text-primary bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                        title="Reload"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                {message && (
                    <div className={`flex items-center gap-3 p-4 rounded-xl border font-medium ${message.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                        }`}>
                        <Info size={20} />
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleBulkSave} className="flex flex-col gap-6">
                    {/* General Configuration Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">language</span>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">General Configuration</h3>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Site Name</label>
                                <input
                                    className="rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 text-sm py-2.5 outline-none transition-all px-4 w-full"
                                    type="text"
                                    value={settings.site_name}
                                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Primary Contact Email</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">mail</span>
                                    <input
                                        className="rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 text-sm py-2.5 outline-none transition-all pl-10 pr-4 w-full"
                                        type="email"
                                        value={settings.contact_email}
                                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* System Notifications Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">notifications</span>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">System Notifications</h3>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Admin Notification Email</label>
                                <input
                                    className="rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary/20 text-sm py-2.5 outline-none transition-all px-4 w-full"
                                    type="email"
                                    value={settings.notification_email}
                                    onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
                                />
                                <p className="text-xs text-slate-500 mt-1">Where system alerts and new application alerts are sent.</p>
                            </div>
                        </div>
                    </section>

                    {/* Security & Access Section */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">security</span>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Security & Access Controls</h3>
                                <p className="text-sm text-slate-500 mt-0.5">Manage visibility and core access features</p>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col gap-6">

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors hover:border-primary/30">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg hidden sm:block">
                                        <span className="material-symbols-outlined">construction</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Maintenance Mode</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Hides the frontend website from the public visitors.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.maintenance_mode}
                                        onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 border border-slate-300 dark:border-slate-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors hover:border-primary/30">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg hidden sm:block">
                                        <span className="material-symbols-outlined">how_to_reg</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Accept Applications</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Enable or disable the career application forms actively taking entries.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.enable_applications}
                                        onChange={(e) => setSettings({ ...settings, enable_applications: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 border border-slate-300 dark:border-slate-600"></div>
                                </label>
                            </div>

                        </div>
                    </section>

                    <div className="flex justify-end gap-3 pb-12 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-xl">{saving ? 'sync' : 'save'}</span>
                            {saving ? 'Applying...' : 'Save All Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Settings;
