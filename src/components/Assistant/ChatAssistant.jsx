import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Sparkles, ChevronRight } from 'lucide-react';
import './ChatAssistant.css';

const INITIAL_MESSAGE = {
    id: 1,
    type: 'bot',
    text: "Hello! I'm your JivIT Assistant. How can I help you today?",
    timestamp: new Date()
};

const QUICK_ACTIONS = [
    { label: 'Our Services', value: 'services', link: '/it-solutions' },
    { label: 'Careers', value: 'careers', link: '/careers' },
    { label: 'For Students', value: 'students', link: '/students' },
    { label: 'Contact Us', value: 'contact', link: '/contact' }
];

const RESPONSES = {
    'services': "We provide premium IT solutions including Web Development, App Design, and Digital Transformation. Would you like to see our full list of services?",
    'careers': "Looking for your next big move? We're always hiring talented individuals. Check out our careers page for open positions!",
    'students': "Are you a student? We have amazing internship programs and resources tailored for you. Visit our Students section to learn more.",
    'contact': "Need to talk? You can reach us via the contact form on our website or visit us at our office. How else can I assist?",
    'default': "That's interesting! I'm still learning, but I can certainly help you navigate the site or answer questions about JivIT Solutions. Try one of the quick actions below!"
};

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (text) => {
        if (!text.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            let responseText = RESPONSES.default;

            if (lowerText.includes('service')) responseText = RESPONSES.services;
            else if (lowerText.includes('job') || lowerText.includes('career') || lowerText.includes('work')) responseText = RESPONSES.careers;
            else if (lowerText.includes('student') || lowerText.includes('intern')) responseText = RESPONSES.students;
            else if (lowerText.includes('contact') || lowerText.includes('reach') || lowerText.includes('email')) responseText = RESPONSES.contact;

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const handleQuickAction = (action) => {
        handleSend(action.label);
    };

    return (
        <div className="assistant-container">
            {/* Floating Toggle Button */}
            <motion.button
                className={`assistant-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            className="toggle-icon-wrapper"
                        >
                            <MessageSquare size={24} />
                            <motion.div
                                className="pulse-ring"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="assistant-window glass-effect"
                        initial={{ opacity: 0, y: 40, scale: 0.95, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="assistant-header">
                            <div className="header-info">
                                <div className="assistant-avatar">
                                    <Sparkles size={16} className="sparkle-icon" />
                                </div>
                                <div>
                                    <h3>JivIT Assistant</h3>
                                    <span className="status-online">Online</span>
                                </div>
                            </div>
                            <button
                                className="btn-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close assistant"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="assistant-messages">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={`message-wrapper ${msg.type}`}
                                    initial={{ opacity: 0, x: msg.type === 'user' ? 10 : -10, y: 5 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                >
                                    <div className="message-bubble">
                                        {msg.text}
                                    </div>
                                    <span className="message-time">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    className="message-wrapper bot typing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="message-bubble">
                                        <div className="typing-dots">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Footer / Input Area */}
                        <div className="assistant-footer">
                            <div className="quick-actions">
                                {QUICK_ACTIONS.map((action, idx) => (
                                    <button
                                        key={idx}
                                        className="action-pill"
                                        onClick={() => handleQuickAction(action)}
                                    >
                                        {action.label} <ChevronRight size={12} />
                                    </button>
                                ))}
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Ask me something..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                                />
                                <button
                                    className={`btn-send ${inputValue.trim() ? 'active' : ''}`}
                                    onClick={() => handleSend(inputValue)}
                                    disabled={!inputValue.trim()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatAssistant;
