import axios from 'axios'

const api = axios.create({
    baseURL:'http://127.0.0.1:5000',
    timeout: 10000,
    withCredentials: true,
    headers:{
        'Content-Type':'application/json'
    }
});

api.interceptors.response.use(
    (response) => response.data,
    (error)=>{
        
        return Promise.reject(error)
    }
)


export default api
