import React from 'react'
import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import './AuthForms.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
    const [formData, setFormData] = useState({
        'username': '',
        'email': '',
        'password': '',
        'confirmPassword': ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({});
    const navigate = useNavigate();
    
    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }
    
    async function handleRegister(e) {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await authService.register(formData.email, formData.password, formData.username);
            console.log(response);
            toast.success('Account created successfully!');
            navigate('/login');
        } catch (error) {
            console.log(error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        setError({});
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (formData.email && !emailRegex.test(formData.email)) {
            setError((prev) => ({ ...prev, email: 'Invalid email format' }));
        }
        if (formData.password && !passwordRegex.test(formData.password)) {
            setError((prev) => ({ ...prev, password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' }));
        }
        if (formData.confirmPassword && formData.confirmPassword !== formData.password) {
            setError((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        }
        if (formData.username && formData.username.length < 3) {
            setError((prev) => ({ ...prev, username: 'Username must be at least 3 characters long' }));
        }
    }, [formData]);
    
    const disabled = Object.keys(error).length > 0 || !formData.email || !formData.password || !formData.confirmPassword || !formData.username;
    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join us to start tracking your applications</p>
                </div>
                
                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            placeholder='johndoe'
                            name='username'
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`form-input ${error.username ? 'error' : ''}`}
                            disabled={isLoading}
                        />
                        {error.username && <div className="error-message">{error.username}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            placeholder='you@example.com'
                            name='email'
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`form-input ${error.email ? 'error' : ''}`}
                            disabled={isLoading}
                        />
                        {error.email && <div className="error-message">{error.email}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            placeholder='••••••••'
                            name='password'
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`form-input ${error.password ? 'error' : ''}`}
                            disabled={isLoading}
                        />
                        {error.password && <div className="error-message">{error.password}</div>}
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            placeholder='••••••••'
                            name='confirmPassword'
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`form-input ${error.confirmPassword ? 'error' : ''}`}
                            disabled={isLoading}
                        />
                        {error.confirmPassword && <div className="error-message">{error.confirmPassword}</div>}
                    </div>
                    
                    <button disabled={disabled || isLoading} type='submit' className="auth-button primary">
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p className="auth-footer-text">
                        Already have an account?{' '}
                        <button 
                            onClick={() => navigate('/login')} 
                            className="auth-link-button"
                            type="button"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupForm;