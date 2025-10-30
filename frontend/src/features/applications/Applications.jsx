import React from 'react'
import { useEffect,useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { authService } from '../../services/authService';
function Applications() {
    const [isLoading,setIsLoading] = useState(false);
    const [applications,setApplications] = useState([]);
    useEffect(() => {
        fetchApplication();

        async function fetchApplication(){
            try {
                setIsLoading(true);
                const response = await applicationService.getApplications()
                console.log(response.applications)
                setApplications(response.applications)
            } catch (error) {
                console.log(error);
            }
            finally{
                setIsLoading(false);
            }
        }

    },[])
  return (
    <>
    {applications.map((app)=>{
        return (
        <div key={app.id}>
            <div>{app.company_name}</div>
            <div>{app.current_status}</div>
            <div>{app.date_applied}</div>
            <div>{app.job_description}</div>
            <div>{app.job_title}</div>
            <div>{app.locations}</div>
            <div>{app.notes}</div>
            <div>{app.posted_salary}</div>
            <div>{app.predicted_salary}</div>
            <div>{app.priority_level}</div>
            <div>{app.recruiter_email}</div>
            <div>{app.required_skills}</div>
            <div>{app.years_of_experience}</div>
        </div>
        )
    })}
    </>
  )
}

export default Applications