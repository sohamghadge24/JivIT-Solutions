import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, ArrowRight, ArrowLeft, Briefcase, MapPin, Building2, Sparkles, AlertCircle, FileText, CheckSquare, Square } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { adminService } from '../lib/adminService';

const ApplicationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            if (id === 'general') {
                setJob({
                    title: 'General Profile Application',
                    department: 'Any Department',
                    location: 'Remote / Global',
                    type: 'Full-Time / Contract'
                });
                setLoading(false);
                return;
            }
            try {
                let data;
                if (location.pathname.includes('/students/')) {
                    const program = await adminService.getStudentProgramById(id);
                    data = {
                        title: program.title,
                        department: 'Student Program',
                        location: program.category === 'research' ? 'Research Initiative' : 'Career Program',
                        type: program.subtitle
                    };
                } else {
                    data = await adminService.getJobOpeningById(id);
                }
                setJob(data);
            } catch (error) {
                console.error('Error fetching job:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        resume: null,
        resumeName: '',
        expertise: '',
        experience: '',
        linkedin: '',
        portfolio: '',
        workAuthorization: '',
        consentGiven: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const totalSteps = 4;

    const isStepValid = () => {
        if (step === 1) {
            return formData.name.trim() !== '' && formData.email.trim() !== '' && formData.resumeName !== '';
        }
        if (step === 2) {
            return formData.expertise.trim() !== '' && formData.experience !== '';
        }
        if (step === 3) {
            return formData.workAuthorization !== '' && formData.consentGiven;
        }
        return true;
    };

    const handleNext = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(prev => Math.min(prev + 1, totalSteps));
    };

    const handlePrev = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, resume: file, resumeName: file.name });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const nameParts = formData.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || 'N/A';

            let message = `Expertise: ${formData.expertise}\nExperience: ${formData.experience}\nWork Auth: ${formData.workAuthorization}`;
            if (formData.linkedin) message += `\nLinkedIn: ${formData.linkedin}`;
            if (formData.portfolio) message += `\nPortfolio: ${formData.portfolio}`;
            if (formData.resumeName) message += `\nResume attached: ${formData.resumeName}`;

            await adminService.submitApplication({
                first_name: firstName || 'N/A',
                last_name: lastName || 'N/A',
                email: formData.email,
                phone: formData.phone || null,
                message: message,
                source_type: id === 'general' ? 'general_application' : (location.pathname.includes('/students/') ? 'student_program' : 'job'),
                source_id: id === 'general' ? null : id
            });

            setIsSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Error submitting application", error);
            alert("Failed to submit application. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="app-layout loading-state">
                <div className="premium-spinner"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="app-layout error-state">
                <AlertCircle size={48} color="#94a3b8" style={{ marginBottom: '24px' }} />
                <h2 className="error-title">Position Not Found</h2>
                <p className="error-desc">The job you are looking for is no longer available or the link is invalid.</p>
                <button onClick={() => navigate('/careers')} className="btn-solid">Return to Careers</button>
            </div>
        );
    }

    return (
        <main className="app-layout">
            <div className="application-form-container">

                {/* Header Section */}
                <div className="app-header">
                    <button onClick={() => navigate(-1)} className="app-back-nav">
                        <ArrowLeft size={16} /> Back to Job Description
                    </button>
                    <h1 className="app-job-title">{job.title}</h1>
                    <div className="app-job-meta">
                        <span className="meta-tag"><Building2 size={14} /> {job.department}</span>
                        <span className="meta-tag"><MapPin size={14} /> {job.location}</span>
                        <span className="meta-tag"><Briefcase size={14} /> {job.type}</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="app-card">
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                                {/* Top Progress Indicator */}
                                <div className="app-progress-section">
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} />
                                    </div>
                                    <div className="progress-labels">
                                        <span className={step >= 1 ? 'active' : ''}>1. Basics</span>
                                        <span className={step >= 2 ? 'active' : ''}>2. Experience</span>
                                        <span className={step >= 3 ? 'active' : ''}>3. Compliance</span>
                                        <span className={step >= 4 ? 'active' : ''}>4. Review</span>
                                    </div>
                                </div>

                                {/* Form Body */}
                                <form id="enterprise-app-form" onSubmit={handleSubmit} className="app-form-body">
                                    <AnimatePresence mode="wait">

                                        {/* STEP 1: BASICS & RESUME */}
                                        {step === 1 && (
                                            <motion.div key="step1" variants={formFade} initial="hidden" animate="visible" exit="exit" className="form-step">
                                                <div className="step-header">
                                                    <h2>Basic Information</h2>
                                                    <p>Upload your resume and provide your contact details.</p>
                                                </div>

                                                <div className="form-section">
                                                    <label className="form-label">Resume / CV <span className="required">*</span></label>
                                                    <div className="resume-upload-box">
                                                        <input type="file" id="resume-upload" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} style={{ display: 'none' }} />
                                                        <label htmlFor="resume-upload" className="upload-label">
                                                            {formData.resumeName ? (
                                                                <div className="uploaded-file">
                                                                    <FileText size={32} color="#0f172a" />
                                                                    <div className="file-info">
                                                                        <span className="file-name">{formData.resumeName}</span>
                                                                        <span className="file-status">Ready for extraction</span>
                                                                    </div>
                                                                    <div className="change-file">Change File</div>
                                                                </div>
                                                            ) : (
                                                                <div className="upload-prompt">
                                                                    <div className="upload-icon-wrapper"><UploadCloud size={28} color="#475569" /></div>
                                                                    <span className="primary-text">Click to upload or drag & drop</span>
                                                                    <span className="secondary-text">PDF, DOC, DOCX up to 10MB</span>
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>

                                                    {!formData.resumeName && (
                                                        <div className="smart-tip">
                                                            <Sparkles size={16} color="#d97706" />
                                                            <span><strong>Smart Apply:</strong> We will securely parse your resume to auto-fill your profile.</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="form-grid">
                                                    <div className="form-group">
                                                        <label className="form-label">Full Name <span className="required">*</span></label>
                                                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="e.g. Jane Doe" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Email Address <span className="required">*</span></label>
                                                        <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" placeholder="e.g. jane@example.com" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Phone Number</label>
                                                        <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" placeholder="e.g. +1 (555) 000-0000" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* STEP 2: EXPERIENCE */}
                                        {step === 2 && (
                                            <motion.div key="step2" variants={formFade} initial="hidden" animate="visible" exit="exit" className="form-step">
                                                <div className="step-header">
                                                    <h2>Professional Experience</h2>
                                                    <p>Help us understand your background and expertise.</p>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Primary Expertise / Top Skills <span className="required">*</span></label>
                                                    <input type="text" required value={formData.expertise} onChange={e => setFormData({ ...formData, expertise: e.target.value })} className="form-input" placeholder="e.g. Solution Architecture, React, Cloud Infrastructure" />
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Total Years of Experience <span className="required">*</span></label>
                                                    <div className="select-wrapper">
                                                        <select required value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} className="form-input form-select">
                                                            <option value="" disabled>Select your experience bracket</option>
                                                            <option value="0-2">0 - 2 years (Entry Level)</option>
                                                            <option value="3-5">3 - 5 years (Mid Level)</option>
                                                            <option value="6-9">6 - 9 years (Senior Level)</option>
                                                            <option value="10+">10+ years (Expert / Lead)</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="form-grid">
                                                    <div className="form-group">
                                                        <label className="form-label">LinkedIn Profile URL</label>
                                                        <input type="url" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="form-input" placeholder="https://linkedin.com/in/..." />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Portfolio / GitHub URL</label>
                                                        <input type="url" value={formData.portfolio} onChange={e => setFormData({ ...formData, portfolio: e.target.value })} className="form-input" placeholder="https://..." />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* STEP 3: COMPLIANCE */}
                                        {step === 3 && (
                                            <motion.div key="step3" variants={formFade} initial="hidden" animate="visible" exit="exit" className="form-step">
                                                <div className="step-header">
                                                    <h2>Compliance & Consent</h2>
                                                    <p>Please complete these mandatory regulatory fields.</p>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Work Authorization <span className="required">*</span></label>
                                                    <div className="select-wrapper">
                                                        <select required value={formData.workAuthorization} onChange={e => setFormData({ ...formData, workAuthorization: e.target.value })} className="form-input form-select">
                                                            <option value="" disabled>Select authorization status</option>
                                                            <option value="authorized">I am authorized to work in this location</option>
                                                            <option value="sponsorship_now">I require sponsorship to work now</option>
                                                            <option value="sponsorship_future">I will require sponsorship in the future</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="consent-box">
                                                    <h3 className="consent-title">Data Privacy Consent</h3>
                                                    <p className="consent-text">
                                                        By checking the box below, you consent to JivIT Solutions collecting, processing, and storing your personal data for the purpose of recruitment and potential employment evaluation, in accordance with global data protection regulations (including GDPR and CCPA).
                                                    </p>
                                                    <div className="checkbox-row" onClick={() => setFormData({ ...formData, consentGiven: !formData.consentGiven })}>
                                                        <div className={`checkbox-custom ${formData.consentGiven ? 'checked' : ''}`}>
                                                            {formData.consentGiven ? <CheckSquare size={20} color="#0f172a" /> : <Square size={20} color="#94a3b8" />}
                                                        </div>
                                                        <span className="checkbox-label">I acknowledge and consent to the data privacy policy. <span className="required">*</span></span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* STEP 4: REVIEW */}
                                        {step === 4 && (
                                            <motion.div key="step4" variants={formFade} initial="hidden" animate="visible" exit="exit" className="form-step">
                                                <div className="step-header">
                                                    <h2>Review Application</h2>
                                                    <p>Please verify your information before submitting.</p>
                                                </div>

                                                <div className="review-section">
                                                    <div className="review-block">
                                                        <h3>Contact Information</h3>
                                                        <div className="review-row"><span>Name</span><p>{formData.name}</p></div>
                                                        <div className="review-row"><span>Email</span><p>{formData.email}</p></div>
                                                        <div className="review-row"><span>Phone</span><p>{formData.phone || 'Not provided'}</p></div>
                                                    </div>

                                                    <div className="review-block">
                                                        <h3>Professional Details</h3>
                                                        <div className="review-row"><span>Resume</span><p className="highlight">{formData.resumeName || 'Not uploaded'}</p></div>
                                                        <div className="review-row"><span>Expertise</span><p>{formData.expertise}</p></div>
                                                        <div className="review-row"><span>Experience</span><p>{formData.experience} years</p></div>
                                                        <div className="review-row"><span>LinkedIn</span><p className="link">{formData.linkedin || 'Not provided'}</p></div>
                                                        <div className="review-row"><span>Portfolio</span><p className="link">{formData.portfolio || 'Not provided'}</p></div>
                                                    </div>

                                                    <div className="review-block" style={{ borderBottom: 'none' }}>
                                                        <h3>Compliance</h3>
                                                        <div className="review-row"><span>Work Auth</span><p>{formData.workAuthorization ? formData.workAuthorization.replace('_', ' ') : 'Not selected'}</p></div>
                                                        <div className="review-row"><span>Consent</span><p>{formData.consentGiven ? 'Granted' : 'Pending'}</p></div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>

                                {/* Bottom Navigation */}
                                <div className="app-footer-nav">
                                    <div className="nav-left">
                                        {step > 1 && (
                                            <button type="button" onClick={handlePrev} className="btn-ghost">
                                                <ArrowLeft size={16} /> Previous
                                            </button>
                                        )}
                                    </div>
                                    <div className="nav-right">
                                        {step < totalSteps ? (
                                            <button type="button" onClick={handleNext} className="btn-solid" disabled={!isStepValid()}>
                                                Continue <ArrowRight size={16} />
                                            </button>
                                        ) : (
                                            <button type="submit" form="enterprise-app-form" disabled={isSubmitting || !formData.consentGiven} className="btn-solid submit-btn">
                                                {isSubmitting ? (
                                                    <span className="flex-center gap-2">Processing <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><CheckCircle size={16} /></motion.div></span>
                                                ) : (
                                                    <span className="flex-center gap-2">Submit Application <CheckCircle size={16} /></span>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </motion.div>
                        ) : (
                            /* Success Confirmation Screen */
                            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="success-container">
                                <div className="success-icon-wrapper">
                                    <CheckCircle size={48} color="#10b981" strokeWidth={1.5} />
                                </div>
                                <h2 className="success-title">Application Submitted!</h2>
                                <p className="success-desc">
                                    Thank you for applying for the <strong>{job.title}</strong> role at JivIT Solutions.
                                    A confirmation email has been sent to <strong>{formData.email}</strong>. Our talent team will review your profile and reach out regarding next steps.
                                </p>
                                <div className="success-actions">
                                    <button onClick={() => navigate('/careers')} className="btn-ghost">Return to Job Board</button>
                                    <button onClick={() => navigate('/')} className="btn-solid">Go to Homepage</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                /* CORE LAYOUT */
                .app-layout {
                    min-height: 100vh;
                    background: var(--bg-main);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 80px 20px 60px;
                    font-family: var(--font-body);
                    color: var(--text-primary);
                }
                .application-form-container {
                    width: 100%;
                    max-width: 800px;
                    display: flex;
                    flex-direction: column;
                }

                /* HEADER */
                .app-header {
                    margin-bottom: 30px;
                    text-align: center;
                }
               .app-back-nav {
                    position: fixed;
                    top: 24px;
                    left: 24px;
                    z-index: 9999;
                    background: rgba(255, 255, 255, 0.4);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    color: #4b5563;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    font-weight: 700;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    padding: 10px 18px;
                    border-radius: 100px;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
                }

                .app-back-nav:hover {
                    color: #000;
                    background: rgba(255, 255, 255, 0.9);
                    transform: translateX(-4px);
                    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.05);
                    border-color: rgba(0, 0, 0, 0.1);
                }
                .app-job-title {
                    font-family: var(--font-heading);
                    font-size: clamp(2rem, 5vw, 3.5rem);
                    font-weight: 400;
                    color: var(--text-primary);
                    margin: 0 0 16px 0;
                    letter-spacing: -0.02em;
                    line-height: 1.1;
                }
                .app-job-meta {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .meta-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: transparent;
                    color: var(--text-secondary);
                    padding: 4px 14px;
                    border-radius: 100px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    border: 1px solid rgba(0,0,0,0.1);
                }

                /* CARD CONTAINER */
                .app-card {
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
                    border: 1px solid rgba(0,0,0,0.06);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                /* PROGRESS BAR */
                .app-progress-section {
                    padding: 20px 30px 0;
                    flex-shrink: 0;
                }
                .progress-bar-bg {
                    height: 3px;
                    background: #f1f5f9;
                    border-radius: 2px;
                    margin-bottom: 12px;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: #2563eb;
                    border-radius: 2px;
                    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .progress-labels {
                    display: flex;
                    justify-content: space-between;
                }
                .progress-labels span {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .progress-labels span.active { color: #0f172a; }

                /* FORM STYLES */
                .app-form-body {
                    padding: 30px 40px;
                }
                .form-step {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .step-header h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0 0 6px 0;
                }
                .step-header p {
                    color: #64748b;
                    margin: 0;
                    font-size: 0.85rem;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                @media (max-width: 768px) {
                    .form-grid { grid-template-columns: 1fr; }
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .form-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #334155;
                }
                .required { color: #ef4444; }

                .form-input {
                    padding: 10px 12px;
                    border-radius: 6px;
                    border: 1px solid #cbd5e1;
                    background: #f8fafc;
                    font-size: 0.85rem;
                    color: #0f172a;
                    font-family: inherit;
                    transition: border-color 0.2s, background 0.2s;
                }
                .form-input:focus {
                    outline: none;
                    border-color: #2563eb;
                    background: #ffffff;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }
                .form-input::placeholder { color: #94a3b8; }

                /* CUSTOM SELECT */
                .select-wrapper { position: relative; }
                .form-select { width: 100%; appearance: none; cursor: pointer; }
                .select-wrapper::after {
                    content: '▾';
                    position: absolute;
                    top: 50%; right: 16px;
                    transform: translateY(-50%);
                    pointer-events: none;
                    color: #64748b;
                }

                /* RESUME UPLOAD */
                .resume-upload-box {
                    border: 2px dashed #cbd5e1;
                    border-radius: 12px;
                    background: #fafafa;
                    transition: all 0.2s;
                }
                .resume-upload-box:hover {
                    border-color: #94a3b8;
                    background: #f8fafc;
                }
                .upload-label {
                    display: block;
                    padding: 20px;
                    cursor: pointer;
                    text-align: center;
                }
                .upload-icon-wrapper {
                    width: 40px; height: 40px;
                    background: #ffffff;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    border: 1px solid #e2e8f0;
                }
                .upload-icon-wrapper svg { width: 20px; height: 20px; }
                .upload-prompt { display: flex; flex-direction: column; gap: 4px; }
                .primary-text { font-weight: 600; color: #0f172a; font-size: 0.85rem; }
                .secondary-text { color: #64748b; font-size: 0.75rem; }

                .uploaded-file {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    text-align: left;
                    padding: 0 10px;
                }
                .file-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
                .file-name { font-weight: 600; color: #0f172a; word-break: break-all; }
                .file-status { color: #10b981; font-size: 0.8rem; font-weight: 500; }
                .change-file { font-size: 0.8rem; font-weight: 600; color: #64748b; text-decoration: underline; }

                .smart-tip {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 12px;
                    font-size: 0.85rem;
                    color: #475569;
                    background: #fef3c7;
                    padding: 10px 14px;
                    border-radius: 8px;
                }

                /* COMPLIANCE BOX */
                .consent-box {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 24px;
                }
                .consent-title { font-size: 1rem; font-weight: 600; margin: 0 0 12px 0; }
                .consent-text { font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0 0 20px 0; }
                
                .checkbox-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    cursor: pointer;
                }
                .checkbox-custom { display: flex; transform: translateY(2px); transition: transform 0.1s; }
                .checkbox-custom:active { transform: scale(0.9) translateY(2px); }
                .checkbox-label { font-size: 0.9rem; font-weight: 500; color: #0f172a; line-height: 1.4; }

                /* REVIEW STYLES */
                .review-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    background: #f8fafc;
                }
                .review-block {
                    padding: 24px;
                    border-bottom: 1px solid #e2e8f0;
                }
                .review-block h3 {
                    font-size: 1rem;
                    color: #0f172a;
                    margin: 0 0 16px 0;
                    font-weight: 600;
                }
                .review-row {
                    display: flex;
                    padding: 10px 0;
                    border-bottom: 1px dashed #cbd5e1;
                }
                .review-row:last-child { border-bottom: none; padding-bottom: 0; }
                .review-row span {
                    flex: 1;
                    font-size: 0.85rem;
                    color: #64748b;
                    font-weight: 500;
                }
                .review-row p {
                    flex: 2;
                    margin: 0;
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: #0f172a;
                }
                .review-row p.highlight { color: #2563eb; }
                .review-row p.link { word-break: break-all; }

                /* FOOTER NAVIGATION */
                .app-footer-nav {
                    padding: 16px 30px;
                    background: #fafafa;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                }
                
                .btn-solid, .btn-ghost {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px 24px;
                    border-radius: 999px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    border: 1px solid transparent;
                }
                .btn-solid {
                    background: #0f172a;
                    color: #ffffff;
                    box-shadow: 0 4px 14px 0 rgba(15, 23, 42, 0.39);
                }
                .btn-solid:hover:not(:disabled) { 
                    background: #1e293b; 
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(15, 23, 42, 0.23); 
                }
                .btn-solid:disabled { background: #94a3b8; box-shadow: none; cursor: not-allowed; opacity: 0.7; }
                
                .btn-ghost {
                    background: transparent;
                    color: #475569;
                    border: 1px solid #cbd5e1;
                }
                .btn-ghost:hover { 
                    background: #f1f5f9; 
                    color: #0f172a; 
                    border-color: #94a3b8;
                    transform: translateY(-2px);
                }

                .flex-center { display: flex; items-center; justify-content: center; }
                .gap-2 { gap: 8px; }

                /* SUCCESS SCREEN */
                .success-container {
                    padding: 40px 30px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }
                .success-icon-wrapper {
                    width: 72px; height: 72px;
                    background: #ecfdf5;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 20px;
                }
                .success-icon-wrapper svg { width: 36px; height: 36px; }
                .success-title { font-size: 1.75rem; color: #0f172a; margin: 0 0 12px 0; font-weight: 700; letter-spacing: -0.02em; }
                .success-desc { font-size: 0.95rem; color: #475569; line-height: 1.6; max-width: 480px; margin: 0 0 30px 0; }
                .success-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

                /* HELPERS */
                .loading-state, .error-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; text-align: center; }
                .error-title { font-size: 1.5rem; color: #0f172a; margin-bottom: 8px; }
                .error-desc { color: #64748b; margin-bottom: 24px; }
                
                @media (max-width: 768px) {
                    .app-layout { padding: 40px 10px; min-height: 100vh; }
                    .app-form-body, .app-progress-section, .app-footer-nav { padding-left: 20px; padding-right: 20px; }
                    .progress-labels span { display: none; }
                    .progress-labels span.active { display: block; width: 100%; text-align: center; }
                }
            `}</style>
        </main>
    );
};

const formFade = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } }
};

export default ApplicationPage;
