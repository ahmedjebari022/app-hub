import { useParams } from "react-router-dom";
import api from "./api";


export const applicationService = {

    createApplication : async (applicationData) =>{
        const {company_name,job_title,location,required_skills,job_description,years_of_experience,posted_salary,date_applied,status} = applicationData;
        return await api.post('/applications',{company_name,job_title,location,required_skills,job_description,years_of_experience,posted_salary,date_applied,status})
    },

    getApplications : async () =>{
        return await api.get('/applications')
    },

    getApplicationById : async (id) =>{
        return await api.get('/applications',{
            params:{id}
        })
    },

    updateApplicationById : async (id,updateData) =>{
        return await api.patch('/applications',{
            params:{id},
            data:updateData
        })
    }

    


}