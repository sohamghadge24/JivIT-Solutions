import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowLeft, Building2, User, Mail, UploadCloud, FileText, Send, Calendar, DollarSign, MessageSquare, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminService } from '../lib/adminService';

const ServiceForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    let defaultService = '';
    if (location.state?.serviceType) {
        defaultService = location.state.serviceType;
    } else if (location.pathname.includes('it-solutions')) {
        defaultService = 'it';
    } else if (location.pathname.includes('wellness')) {
        defaultService = 'wellness';
    } else if (location.pathname.includes('platform')) {
        defaultService = 'platform';
    }

    const specificServiceTitle = location.state?.serviceTitle || '';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        serviceType: defaultService,
        engagementType: 'consultation',
        projectScope: '',
        timeline: '',
        budget: '',
        appointmentDate: '',
        appointmentTime: '',
        meetingMode: '',
        document: null,
        documentName: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, document: file, documentName: file.name });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const nameParts = formData.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || 'N/A';

            let messageDetails = `Company: ${formData.company}\nEngagement Type: ${formData.engagementType}`;
            if (formData.engagementType === 'consultation') {
                messageDetails += `\nService Area: ${formData.serviceType || specificServiceTitle || 'N/A'}`;
                messageDetails += `\nTimeline: ${formData.timeline || 'N/A'}`;
                messageDetails += `\nBudget: ${formData.budget || 'N/A'}`;
                messageDetails += `\nScope: ${formData.projectScope}`;
            } else if (formData.engagementType === 'appointment') {
                messageDetails += `\nDate: ${formData.appointmentDate}`;
                messageDetails += `\nTime: ${formData.appointmentTime}`;
                messageDetails += `\nMeeting Mode: ${formData.meetingMode}`;
            }
            if (formData.documentName) {
                messageDetails += `\nDocument Attached: ${formData.documentName}`;
            }

            // Submitting as an application to the DB
            await adminService.submitApplication({
                first_name: firstName || 'N/A',
                last_name: lastName || 'N/A',
                email: formData.email,
                phone: null,
                message: messageDetails,
                source_type: 'service_inquiry',
                source_id: null
            });

            setIsSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Failed to submit request. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="inst-service-layout">
            <div className="inst-service-container">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div key="form-view" className="inst-form-split" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                            {/* LEFT CONTEXT */}
                            <div className="inst-form-context">
                                <button onClick={() => navigate(-1)} className="inst-back-button">
                                    <ArrowLeft size={16} /> Back to previous
                                </button>

                                <h1 className="inst-form-title">
                                    {formData.engagementType === 'appointment'
                                        ? "Schedule an Executive Appointment."
                                        : specificServiceTitle
                                            ? `Request consultation for ${specificServiceTitle}`
                                            : "Let's build something exceptional together."
                                    }
                                </h1>

                                <p className="inst-form-subtitle">
                                    Provide us with a few details about your organization and requirements.
                                    Our senior architects and consultants will review your request and
                                    get back to you within 24 hours.
                                </p>

                                <div className="inst-contact-details">
                                    <div className="contact-item">
                                        <h4>Direct Inquiries</h4>
                                        <p>enterprise@jivitsolutions.com</p>
                                    </div>
                                    <div className="contact-item">
                                        <h4>Global Headquarters</h4>
                                        <p>Pune, Maharashtra, India</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT FORM */}
                            <div className="inst-form-card">
                                <form onSubmit={handleSubmit} className="inst-single-form">

                                    <h3 className="form-section-title">Your Details</h3>

                                    <div className="inst-form-grid">
                                        <div className="inst-input-wrapper">
                                            <label>Full Name *</label>
                                            <div className="input-inner">
                                                <User size={18} className="input-icon" />
                                                <input type="text" required value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="John Doe" />
                                            </div>
                                        </div>

                                        <div className="inst-input-wrapper">
                                            <label>Corporate Email *</label>
                                            <div className="input-inner">
                                                <Mail size={18} className="input-icon" />
                                                <input type="email" required value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="email@company.com" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="inst-input-wrapper">
                                        <label>Company / Entity *</label>
                                        <div className="input-inner">
                                            <Building2 size={18} className="input-icon" />
                                            <input type="text" required value={formData.company}
                                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                placeholder="Acme Corporation" />
                                        </div>
                                    </div>

                                    {/* Engagement Type */}
                                    <h3 className="form-section-title mt-8">Engagement Type</h3>

                                    <div className="inst-input-wrapper">
                                        <label>Select Engagement *</label>
                                        <div className="input-inner">
                                            <select
                                                required
                                                value={formData.engagementType}
                                                onChange={e => setFormData({ ...formData, engagementType: e.target.value })}
                                            >
                                                <option value="consultation">Consultation Request</option>
                                                <option value="appointment">Schedule Appointment</option>
                                            </select>
                                            <div className="select-arrow">
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Appointment Fields */}
                                    {formData.engagementType === 'appointment' && (
                                        <>
                                            <div className="inst-form-grid">
                                                <div className="inst-input-wrapper">
                                                    <label>Preferred Date *</label>
                                                    <div className="input-inner">
                                                        <Calendar size={18} className="input-icon" />
                                                        <input
                                                            type="date"
                                                            required
                                                            value={formData.appointmentDate}
                                                            onChange={e => setFormData({ ...formData, appointmentDate: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="inst-input-wrapper">
                                                    <label>Preferred Time *</label>
                                                    <div className="input-inner">
                                                        <input
                                                            type="time"
                                                            required
                                                            value={formData.appointmentTime}
                                                            onChange={e => setFormData({ ...formData, appointmentTime: e.target.value })}
                                                            style={{ paddingLeft: "16px" }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="inst-input-wrapper">
                                                <label>Meeting Mode *</label>
                                                <div className="input-inner">
                                                    <select
                                                        required
                                                        value={formData.meetingMode}
                                                        onChange={e => setFormData({ ...formData, meetingMode: e.target.value })}
                                                    >
                                                        <option value="" disabled>Select mode</option>
                                                        <option value="virtual">Virtual (Video Conference)</option>
                                                        <option value="in-person">In-Person Meeting</option>
                                                    </select>
                                                    <div className="select-arrow">
                                                        <ChevronDown size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Scope Section (Only for Consultation) */}
                                    {formData.engagementType === 'consultation' && (
                                        <>
                                            <h3 className="form-section-title mt-8">Engagement Scope</h3>

                                            <div className="inst-input-wrapper">
                                                <label>Project Details & Objectives *</label>
                                                <div className="input-inner textarea-inner">
                                                    <MessageSquare size={18} className="input-icon icon-top" />
                                                    <textarea required rows="4"
                                                        value={formData.projectScope}
                                                        onChange={e => setFormData({ ...formData, projectScope: e.target.value })}
                                                        placeholder="Describe your current challenges, goals, and technical requirements...">
                                                    </textarea>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="form-submit-row">
                                        <p className="privacy-note">
                                            By submitting, you agree to our privacy policy and terms of service.
                                        </p>
                                        <button type="submit" className="inst-submit-btn" disabled={isSubmitting}>
                                            {isSubmitting ? 'Processing...' : (
                                                <>
                                                    {formData.engagementType === 'appointment'
                                                        ? "Schedule Appointment"
                                                        : "Submit Request"}
                                                    <Send size={16} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="success-view" className="inst-success-panel"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}>

                            <div className="success-icon-wrap">
                                <CheckCircle size={48} />
                            </div>

                            <h2 className="success-title">
                                {formData.engagementType === 'appointment'
                                    ? "Appointment Scheduled"
                                    : "Consultation Requested"}
                            </h2>

                            <p className="success-message">
                                Thank you for connecting with JivIT Solutions.
                                Our team will contact you shortly at <strong>{formData.email}</strong>.
                            </p>

                            <button onClick={() => navigate('/')}
                                className="inst-submit-btn"
                                style={{ margin: '0 auto', display: 'flex' }}>
                                Return to Homepage
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                /* GLOBAL PAGE BACKGROUND */
                .inst-service-layout {
                    min-height: 100dvh;
                    background: #F7F7F7;
                    padding: 80px 24px;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    justify-content: center;
                }
                .inst-service-container {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .inst-back-button {
                    background: transparent;
                    border: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                    color: #555;
                    cursor: pointer;
                    margin-bottom: 40px;
                    font-weight: 500;
                    transition: color 0.2s;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .inst-back-button:hover { color: #000; }

                /* SPLIT LAYOUT */
                .inst-form-split {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 60px;
                    align-items: flex-start;
                }

                /* LEFT CONTEXT */
                .inst-form-context {
                    padding-top: 20px;
                    position: sticky;
                    top: 120px;
                }
                .inst-form-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 3.5rem;
                    line-height: 1.1;
                    color: #000;
                    margin: 0 0 24px 0;
                    letter-spacing: -0.02em;
                }
                .inst-form-subtitle {
                    font-size: 1.1rem;
                    color: #555;
                    line-height: 1.6;
                    margin: 0 0 48px 0;
                    max-width: 480px;
                }
                .inst-contact-details {
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                    border-left: 1px solid #E5E5E5;
                    padding-left: 24px;
                }
                .contact-item h4 {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #999;
                    margin: 0 0 8px 0;
                }
                .contact-item p {
                    font-size: 1rem;
                    color: #000;
                    margin: 0;
                    font-weight: 500;
                }

                /* RIGHT FORM CARD */
                .inst-form-card {
                    background: #FFF;
                    border-radius: 12px;
                    padding: 48px;
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
                    border: 1px solid #E5E5E5;
                }

                .inst-single-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .form-section-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #111;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 0 0 8px 0;
                    border-bottom: 1px solid #E5E5E5;
                    padding-bottom: 12px;
                }
                .mt-8 { margin-top: 32px; }
                .mt-4 { margin-top: 16px; }

                .inst-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }

                .inst-input-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .inst-input-wrapper label {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #444;
                }

                .input-inner {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-icon {
                    position: absolute;
                    left: 16px;
                    color: #999;
                    pointer-events: none;
                }
                .icon-top {
                    top: 16px;
                }

                .input-inner input, .input-inner select, .input-inner textarea {
                    width: 100%;
                    background: #FAFAFA;
                    border: 1px solid #E5E5E5;
                    border-radius: 8px;
                    font-family: inherit;
                    font-size: 0.95rem;
                    color: #111;
                    padding: 14px 16px 14px 44px;
                    transition: all 0.2s;
                }
                .input-inner textarea {
                    resize: vertical;
                    min-height: 120px;
                }
                .input-inner select {
                    appearance: none;
                    cursor: pointer;
                }
                .select-arrow {
                    position: absolute;
                    right: 16px;
                    pointer-events: none;
                    color: #999;
                }

                .input-inner input:focus, .input-inner select:focus, .input-inner textarea:focus {
                    outline: none;
                    border-color: #000;
                    background: #FFF;
                    box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
                }

                .inst-service-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #F0F9F4;
                    color: #0F5132;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    border: 1px solid #BADBCC;
                }

                /* File Upload */
                .inst-file-upload input[type="file"] {
                    display: none;
                }
                .upload-box {
                    display: block;
                    border: 1px dashed #CCC;
                    background: #FAFAFA;
                    border-radius: 8px;
                    padding: 24px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .upload-box:hover {
                    border-color: #000;
                    background: #FFF;
                }
                .file-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    color: #555;
                }
                .file-placeholder span { font-weight: 500; font-size: 0.95rem; color: #111; }
                .file-placeholder small { font-size: 0.8rem; color: #999; }
                
                .file-ready {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    color: #111;
                    font-weight: 500;
                }
                .file-change {
                    font-size: 0.8rem;
                    color: #666;
                    text-decoration: underline;
                }
                .text-black { color: #000; }

                /* Submit Row */
                .form-submit-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                    margin-top: 16px;
                    padding-top: 32px;
                    border-top: 1px solid #E5E5E5;
                }
                .privacy-note {
                    font-size: 0.8rem;
                    color: #777;
                    margin: 0;
                    line-height: 1.5;
                    max-width: 300px;
                }
                .inst-submit-btn {
                    background: #000;
                    color: #FFF;
                    border: none;
                    padding: 14px 32px;
                    font-size: 0.95rem;
                    font-weight: 500;
                    border-radius: 8px;
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                .inst-submit-btn:hover:not(:disabled) {
                    background: #333;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                }
                .inst-submit-btn:disabled {
                    background: #CCC;
                    cursor: not-allowed;
                }

                /* Success State */
                .inst-success-panel {
                    background: #FFF;
                    border-radius: 12px;
                    padding: 80px 40px;
                    text-align: center;
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
                    border: 1px solid #E5E5E5;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .success-icon-wrap {
                    display: inline-flex;
                    color: #10B981;
                    margin-bottom: 24px;
                }
                .success-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.5rem;
                    color: #000;
                    margin: 0 0 16px 0;
                }
                .success-message {
                    font-size: 1.05rem;
                    color: #555;
                    line-height: 1.6;
                    margin: 0 0 40px 0;
                }

                /* RESPONSIVE */
                @media (max-width: 1024px) {
                    .inst-form-split {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }
                    .inst-form-context {
                        position: static;
                        text-align: center;
                    }
                    .inst-contact-details {
                        border-left: none;
                        padding-left: 0;
                        flex-direction: row;
                        justify-content: center;
                        gap: 48px;
                    }
                }
                @media (max-width: 768px) {
                    .inst-service-layout { padding: 40px 16px; }
                    .inst-form-title { font-size: 2.5rem; }
                    .inst-form-card { padding: 32px 24px; }
                    .inst-form-grid { grid-template-columns: 1fr; gap: 16px; }
                    .form-submit-row {
                        flex-direction: column-reverse;
                        text-align: center;
                    }
                    .inst-submit-btn { width: 100%; justify-content: center; }
                    .inst-contact-details { flex-direction: column; gap: 24px; }
                }
            `}</style>
        </main>
    );
};

export default ServiceForm;
