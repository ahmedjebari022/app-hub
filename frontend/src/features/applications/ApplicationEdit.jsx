import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { applicationService } from '../../services/applicationService';
import { toast } from 'react-toastify';
import './Applications.css';

function Application() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    company_name: '',
    job_title: '',
    location: '',
    date_applied: '',
    current_status: '',
    job_description: '',
    required_skills: '',
    years_of_experience: 0,
    posted_salary: '',
    predicted_salary: '',
    actual_offer: '',
    priority_level: '',
    recruiter_name: '',
    recruiter_email: '',
    notes: ''
  });

  useEffect(() => {
    async function fetchApplication(id) {
      try {
        setIsLoading(true);
        const response = await applicationService.getApplicationById(id);
        const applications = response.application;
        setFormData(prev => ({ ...prev, ...applications }));
        console.log(response);
      } catch (error) {
        console.log(error);
        toast.error('Failed to load application');
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplication(id);
  }, [id]);

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      setIsSaving(true);
      const data = {
        notes: formData.notes,
        priority_level: formData.priority_level,
        recruiter_email: formData.recruiter_email,
        recruiter_name: formData.recruiter_name,
        actual_offer: formData.actual_offer,
        current_status: formData.current_status
      };
      const response = await applicationService.updateApplicationById(id, data);
      console.log(response);
      toast.success('Application updated successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to update application');
    } finally {
      setIsSaving(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading application...</p>
      </div>
    );
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
            <h2>Edit Application</h2>
            <p>Update your application details</p>
          </div>

          <div className="info-section">
            <h3>Job Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Company</span>
                <span className="info-value">{formData.company_name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Job Title</span>
                <span className="info-value">{formData.job_title}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">{formData.location}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date Applied</span>
                <span className="info-value">{new Date(formData.date_applied).toLocaleDateString()}</span>
              </div>
            </div>
            {formData.job_description && (
              <div className="description-box">
                <p className="info-label">Job Description</p>
                <p className="description-text">{formData.job_description}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="application-form">
            <h3>Update Details</h3>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                name="current_status" 
                value={formData.current_status || ''} 
                onChange={handleInputChange}
                className="form-select"
                disabled={isSaving}
              >
                <option value="applied">Applied</option>
                <option value="phone_screen">Phone Screen</option>
                <option value="phone_screen_completed">Phone Screen Completed</option>
                <option value="technical_interview_scheduled">Technical Interview Scheduled</option>
                <option value="technical_interview_completed">Technical Interview Completed</option>
                <option value="final_round">Final Round</option>
                <option value="offer_received">Offer Received</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Recruiter Name</label>
                <input 
                  placeholder='Jane Smith' 
                  type="text" 
                  value={formData.recruiter_name || ''} 
                  name="recruiter_name" 
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isSaving}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Recruiter Email</label>
                <input 
                  placeholder='recruiter@company.com' 
                  type="email" 
                  value={formData.recruiter_email || ''} 
                  name="recruiter_email" 
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority Level (1-5)</label>
                <input 
                  type='number' 
                  min="1" 
                  max="5" 
                  value={formData.priority_level || 0} 
                  name='priority_level' 
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isSaving}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Actual Offer</label>
                <input 
                  placeholder='$130,000' 
                  type="text" 
                  value={formData.actual_offer || ''} 
                  name="actual_offer" 
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea 
                placeholder='Add any additional notes about this application...' 
                value={formData.notes || ''} 
                name="notes" 
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
                disabled={isSaving}
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/applications')} 
                className="btn-secondary"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button type='submit' className="btn-primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Application