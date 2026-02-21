import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { adminService } from '../lib/adminService';

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const Contact = () => {
    const [settings, setSettings] = useState({
        site_name: 'JivIT Solutions',
        contact_email: 'hello@jivitsolutions.com'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await adminService.getSettings();
                if (data) setSettings(prev => ({ ...prev, ...data }));
            } catch (error) { }
        };
        fetchSettings();
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        sector: '',
        message: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your inquiry. A partner will be in touch shortly.');
        setFormData({ name: '', email: '', sector: '', message: '' });
    };

    return (
        <main className="inst-page">
            <header className="inst-header">
                <div className="inst-container">
                    <motion.div {...fadeUp}>
                        <span className="inst-super-title">Contact</span>
                        <h1 className="inst-title">Engage the Firm.</h1>
                        <p className="inst-lead">
                            Direct communication for enterprise transformation, clinical wellness platforms, and strategic talent acquisition.
                        </p>
                    </motion.div>
                </div>
            </header>

            <section className="inst-section">
                <div className="inst-container">
                    <div className="inst-grid" style={{ gridTemplateColumns: '1fr 1.5fr' }}>

                        <motion.div className="inst-text" {...fadeUp}>
                            <h2 className="inst-h2" style={{ fontSize: '2rem' }}>Global Directory</h2>
                            <ul className="inst-list" style={{ marginTop: '40px' }}>
                                <li>
                                    <div>
                                        <div className="inst-item-title">Primary Contact</div>
                                        <div className="inst-item-meta">{settings.contact_email}</div>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <div className="inst-item-title">Headquarters</div>
                                        <div className="inst-item-meta">123 Innovation Drive<br />Tech Valley, CA 94043</div>
                                    </div>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
                            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '60px', borderRadius: '4px', border: '1px solid #EAEAEA' }}>
                                <h3 className="inst-h3" style={{ marginBottom: '32px' }}>Inquiry Details</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }} htmlFor="name">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #CCC', fontSize: '1rem', outline: 'none', background: 'transparent' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }} htmlFor="email">Corporate Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #CCC', fontSize: '1rem', outline: 'none', background: 'transparent' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }} htmlFor="sector">Topic</label>
                                    <select
                                        id="sector"
                                        value={formData.sector}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #CCC', fontSize: '1rem', outline: 'none', background: 'transparent', appearance: 'none' }}
                                    >
                                        <option value="" disabled>Select inquiry type</option>
                                        <option value="it">IT Systems</option>
                                        <option value="wellness">Wellness Practice</option>
                                        <option value="careers">Careers & Research</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '40px' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }} htmlFor="message">Context</label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #CCC', fontSize: '1rem', outline: 'none', background: 'transparent', resize: 'vertical' }}
                                    ></textarea>
                                </div>

                                <button type="submit" className="inst-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                    Submit Request
                                </button>
                            </form>
                        </motion.div>

                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;
