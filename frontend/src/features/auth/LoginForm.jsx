import React from 'react'
import { authService } from '../../services/authService';
import { useState } from 'react';
import './AuthForms.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [formData, setFormData] = useState({
        'email': '',
        'password': ''
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        if (isLoading) return;
        
        setIsLoading(true);
        try {
            const response = await authService.login(formData.email, formData.password);
            console.log(response);
            toast.success('Login successful!');
            navigate('/applications');
        } catch (error) {
            console.log(error);
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Sign in to continue to your dashboard</p>
                </div>
                
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            className="form-input"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="form-input"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="auth-button primary" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p className="auth-footer-text">
                        Don't have an account?{' '}
                        <button 
                            onClick={() => navigate('/signup')} 
                            className="auth-link-button"
                            type="button"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;