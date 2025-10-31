import React from 'react'
import { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Applications.css';

function Applications() {
    const [isLoading, setIsLoading] = useState(false);
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplication();

        async function fetchApplication() {
            try {
                setIsLoading(true);
                const response = await applicationService.getApplications()
                console.log(response.applications)
                setApplications(response.applications)
            } catch (error) {
                console.log(error);
                toast.error('Failed to load applications');
            }
            finally {
                setIsLoading(false);
            }
        }

    }, [])

    async function handleLogout() {
        try {
            await authService.logout();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    }

    function getStatusColor(status) {
        const colors = {
            'applied': '#3b82f6',
            'phone_screen': '#8b5cf6',
            'phone_screen_completed': '#a855f7',
            'technical_interview_scheduled': '#ec4899',
            'technical_interview_completed': '#f59e0b',
            'final_round': '#eab308',
            'offer_received': '#10b981',
            'rejected': '#ef4444',
            'accepted': '#22c55e',
            'withdrawn': '#6b7280'
        };
        return colors[status] || '#6b7280';
    }

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading applications...</p>
            </div>
        );
    }

    return (
        <div className="applications-page">
            <nav className="navbar">
                <div className="navbar-content">
                    <h1 className="navbar-title">Job Tracker</h1>
                    <div className="navbar-actions">
                        <button onClick={() => navigate('/applications/form')} className="btn-new">
                            + New Application
                        </button>
                        <button onClick={handleLogout} className="btn-logout">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="applications-container">
                <div className="applications-header">
                    <h2>My Applications</h2>
                    <p className="applications-count">{applications.length} total applications</p>
                </div>

                {applications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>No applications yet</h3>
                        <p>Start tracking your job applications by creating your first one</p>
                        <button onClick={() => navigate('/applications/form')} className="btn-primary">
                            Create First Application
                        </button>
                    </div>
                ) : (
                    <div className="applications-grid">
                        {applications.map((app) => (
                            <div 
                                key={app.id} 
                                className="application-card"
                                onClick={() => navigate(`/applications/${app.id}`)}
                            >
                                <div className="card-header">
                                    <h3 className="job-title">{app.job_title}</h3>
                                    <span 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(app.current_status) }}
                                    >
                                        {app.current_status?.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                
                                <div className="card-body">
                                    <div className="company-info">
                                        <span className="company-name">🏢 {app.company_name}</span>
                                        <span className="location">📍 {app.location}</span>
                                    </div>
                                    
                                    <div className="card-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Applied</span>
                                            <span className="detail-value">{new Date(app.date_applied).toLocaleDateString()}</span>
                                        </div>
                                        {app.posted_salary && (
                                            <div className="detail-item">
                                                <span className="detail-label">Salary</span>
                                                <span className="detail-value">{app.posted_salary}</span>
                                            </div>
                                        )}
                                        {app.predicted_salary && (
                                            <div className="detail-item">
                                                <span className="detail-label">Predicted</span>
                                                <span className="detail-value">${app.predicted_salary}</span>
                                            </div>
                                        )}
                                    </div>

                                    {app.notes && (
                                        <div className="notes-preview">
                                            📝 {app.notes.substring(0, 100)}{app.notes.length > 100 ? '...' : ''}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Applications