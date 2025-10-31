import React from 'react'
import { useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Applications.css';

function ApplicationForm() {
    const [formData, setFormData] = useState({
        job_title: '',
        company_name: '',
        location: '',
        required_skills: '',
        job_description: '',
        years_of_experience: 0,
        posted_salary: '',
        date_applied: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function handleSubmitForm(e) {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await applicationService.createApplication(formData);
            console.log(response);
            toast.success('Application created successfully!');
            navigate('/applications');
        } catch (error) {
            console.log(error);
            toast.error('Failed to create application');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="applications-page">
            <nav className="navbar">
                <div className="navbar-content">
                    <h1 className="navbar-title">Job Tracker</h1>
                    <button onClick={() => navigate('/applications')} className="btn-back">
                        ← Back to Applications
                    </button>
                </div>
            </nav>

            <div className="form-container">
                <div className="form-card">
                    <div className="form-header">
                        <h2>New Job Application</h2>
                        <p>Track your next opportunity</p>
                    </div>

                    <form onSubmit={handleSubmitForm} className="application-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Job Title *</label>
                                <input 
                                    placeholder='Senior Software Engineer' 
                                    type='text' 
                                    value={formData.job_title} 
                                    name='job_title' 
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Company Name *</label>
                                <input 
                                    placeholder='Google' 
                                    type='text' 
                                    value={formData.company_name} 
                                    name='company_name' 
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Location *</label>
                                <input 
                                    placeholder='San Francisco, CA' 
                                    type='text' 
                                    value={formData.location} 
                                    name='location' 
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date Applied *</label>
                                <input 
                                    type='date' 
                                    value={formData.date_applied} 
                                    name='date_applied' 
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Years of Experience</label>
                                <input 
                                    placeholder='5' 
                                    type='number' 
                                    value={formData.years_of_experience} 
                                    name='years_of_experience' 
                                    onChange={handleInputChange}
                                    className="form-input"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Posted Salary</label>
                                <input 
                                    placeholder='$120,000 - $150,000' 
                                    type='text' 
                                    value={formData.posted_salary} 
                                    name='posted_salary' 
                                    onChange={handleInputChange}
                                    className="form-input"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Required Skills</label>
                            <input 
                                placeholder='React, Node.js, Python, AWS' 
                                type='text' 
                                value={formData.required_skills} 
                                name='required_skills' 
                                onChange={handleInputChange}
                                className="form-input"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Job Description</label>
                            <textarea 
                                placeholder='Brief description of the role and responsibilities...' 
                                value={formData.job_description} 
                                name='job_description' 
                                onChange={handleInputChange}
                                className="form-textarea"
                                rows="4"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                onClick={() => navigate('/applications')} 
                                className="btn-secondary"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button type='submit' className="btn-primary" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ApplicationForm;