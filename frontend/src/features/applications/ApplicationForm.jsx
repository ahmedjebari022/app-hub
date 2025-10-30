import React from 'react'
import { useState } from 'react';
import { applicationService } from '../../services/applicationService';
import api from '../../services/api';

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
            
            const response = await applicationService.createApplication(formData);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form onSubmit={(e) => { handleSubmitForm(e) }}>
            <input placeholder='company_name' type='text' value={formData.company_name} name='company_name' onChange={(e) => handleInputChange(e)} />
            <input placeholder='job_title' type='text' value={formData.job_title} name='job_title' onChange={(e) => handleInputChange(e)} />
            <input placeholder='location' type='text' value={formData.location} name='location' onChange={(e) => handleInputChange(e)} />
            <input placeholder='date_applied' type='date' value={formData.date_applied} name='date_applied' onChange={(e) => handleInputChange(e)} />
            <input placeholder='job_description' type='text' value={formData.job_description} name='job_description' onChange={(e) => handleInputChange(e)} />
            <input placeholder='posted_salary' type='text' value={formData.posted_salary} name='posted_salary' onChange={(e) => handleInputChange(e)} />
            <input placeholder='years_of_experience' type='number' value={formData.years_of_experience} name='years_of_experience' onChange={(e) => handleInputChange(e)} />
            <input placeholder='required_skills' type='text' value={formData.required_skills} name='required_skills' onChange={(e) => handleInputChange(e)} />
            <button type='submit'>Submit</button>
        </form>
    );
}

export default ApplicationForm;