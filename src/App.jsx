import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatAssistant from './components/Assistant/ChatAssistant';
import PremiumLoader from './components/PremiumLoader';
import SmoothScroll from './components/SmoothScroll';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import { ServicesProvider } from './context/ServicesContext';
import PageTransition from './animations/PageTransition';

// Dynamically import all page components for code splitting & faster initial loads
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Students = lazy(() => import('./pages/Students'));
const Careers = lazy(() => import('./pages/Careers'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const StudentDetail = lazy(() => import('./pages/StudentDetail'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const CareerDetail = lazy(() => import('./pages/CareerDetail'));
const ApplicationPage = lazy(() => import('./pages/ApplicationPage'));
const ITSolutions = lazy(() => import('./pages/ITSolutions'));
const Wellness = lazy(() => import('./pages/Wellness'));
const PlatformEnablement = lazy(() => import('./pages/PlatformEnablement'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const Register = lazy(() => import('./pages/Register'));
const Contact = lazy(() => import('./pages/Contact'));
const Profile = lazy(() => import('./pages/Profile'));
const ServiceForm = lazy(() => import('./pages/ServiceForm'));

// Admin Routes Dynamic Loading
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ServiceManager = lazy(() => import('./pages/admin/ServiceManager'));
const HiringDesk = lazy(() => import('./pages/admin/HiringDesk'));
const StudentManager = lazy(() => import('./pages/admin/StudentManager'));
const ApplicationInbox = lazy(() => import('./pages/admin/ApplicationInbox'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs'));

function AppContent() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';
    const isAdminLoginPage = location.pathname === '/admin-login';
    const isRegisterPage = location.pathname === '/register';
    const isAdminPage = location.pathname.startsWith('/admin');
    const isPremiumDetail =
        location.pathname.startsWith('/careers/') ||
        location.pathname.startsWith('/students/') ||
        location.pathname.startsWith('/services/') ||
        location.pathname.startsWith('/service-form');

    const isLayoutHidden = isLoginPage || isAdminLoginPage || isRegisterPage || isAdminPage || isPremiumDetail;

    return (
        <SmoothScroll>
            <div className="app-container font-display antialiased text-slate-900 dark:text-slate-100 bg-white dark:bg-[#14171e]">
                {!isLayoutHidden && <Navbar />}

                <main>
                    <Suspense fallback={<PremiumLoader />}>
                        <AnimatePresence mode="wait">
                            <Routes location={location} key={location.pathname}>
                                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                                <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
                                <Route path="/careers/:id" element={<PageTransition><CareerDetail /></PageTransition>} />
                                <Route path="/careers/:id/apply" element={<PageTransition><ApplicationPage /></PageTransition>} />
                                <Route path="/students" element={<PageTransition><Students /></PageTransition>} />
                                <Route path="/students/:id" element={<PageTransition><StudentDetail /></PageTransition>} />
                                <Route path="/students/:id/apply" element={<PageTransition><ApplicationPage /></PageTransition>} />
                                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                                <Route path="/it-solutions" element={<PageTransition><ITSolutions /></PageTransition>} />
                                <Route path="/wellness" element={<PageTransition><Wellness /></PageTransition>} />
                                <Route path="/platform-enablement" element={<PageTransition><PlatformEnablement /></PageTransition>} />
                                <Route path="/services/:id" element={<PageTransition><ServiceDetail /></PageTransition>} />
                                <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
                                <Route path="/blog/:slug" element={<PageTransition><BlogDetail /></PageTransition>} />
                                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                                <Route path="/admin-login" element={<PageTransition><AdminLogin /></PageTransition>} />
                                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                                <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
                                <Route path="/service-form" element={<PageTransition><ServiceForm /></PageTransition>} />

                                {/* Admin Routes */}
                                <Route element={<ProtectedRoute />}>
                                    <Route element={<AdminLayout />}>
                                        <Route path="/admin" element={<PageTransition><Dashboard /></PageTransition>} />
                                        <Route path="/admin/services" element={<PageTransition><ServiceManager /></PageTransition>} />
                                        <Route path="/admin/hiring" element={<PageTransition><HiringDesk /></PageTransition>} />
                                        <Route path="/admin/students" element={<PageTransition><StudentManager /></PageTransition>} />
                                        <Route path="/admin/applications" element={<PageTransition><ApplicationInbox /></PageTransition>} />
                                        <Route path="/admin/settings" element={<PageTransition><Settings /></PageTransition>} />
                                        <Route path="/admin/audit-logs" element={<PageTransition><AuditLogs /></PageTransition>} />
                                    </Route>
                                </Route>
                            </Routes>
                        </AnimatePresence>
                    </Suspense>
                </main>

                {!isLayoutHidden && <Footer />}
                {!isLayoutHidden && <ChatAssistant />}
            </div>
        </SmoothScroll>
    );
}

function App() {
    return (
        <ThemeProvider>
            <ServicesProvider>
                <Router>
                    <AppContent />
                </Router>
            </ServicesProvider>
        </ThemeProvider>
    );
}

export default App;
