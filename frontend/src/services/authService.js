import api from "./api";

export const authService = {
    login : async (email ,password) => {
       return await api.post('/login',{email ,password});
    },

    logout : async () => {
        return await api.post('/logout');
    },

    register : async (email,password,username) =>{
        return await api.post('/users',{username ,email ,password});
    },

    me : async ()=> {
        return await api.get('/me');
    }

}