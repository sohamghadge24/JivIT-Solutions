import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { supabase } from '../lib/supabase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Placeholder login logic with Supabase
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            alert('Login successful!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-split">
            {/* Left Side: Visual */}
            <div className="login-visual">
                <div className="visual-overlay"></div>
                <div className="visual-content">
                    <h2>The Convergence of<br />Tech & Soul.</h2>
                    <p>Access your dashboard to manage IT infrastructure or your wellness practice.</p>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="Minimalist Architecture"
                    className="bg-image"
                />
            </div>

            {/* Right Side: Form */}
            <div className="login-form-container">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="back-button"
                    aria-label="Go back"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                </button>

                <div className="form-wrapper">
                    <h3>Welcome Back</h3>
                    <p className="form-subtext">Please enter your details to sign in.</p>

                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="error-text" style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

                        <div className="form-actions">
                            <div className="check-group">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="#" className="forgot-link">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>

                        <div className="form-footer">
                            <p>Don't have an account? <a href="#">Request Access</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
