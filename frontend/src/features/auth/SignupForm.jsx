import React from 'react'
import { useState,useEffect} from 'react';
import { authService } from '../../services/authService';
function SignupForm() {
    const [formData, setFormData] = useState({
        'username':'',
        'email':'',
        'password':'',
        'confirmPassword':''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error,setError] = useState({});
    function handleInputChange(e){
        const {name,value} = e.target;
        setFormData({
            ...formData,
            [name]:value
        })
    }
    async function handleRegister(e){
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = authService.register(formData.email,formData.password,formData.username);
            console.log(response);
        } catch (error) {
            console.log(error);
            
        } finally{
            setIsLoading(false);
        }
    }
    let disabled = false;
    useEffect(() => {
        setError({});
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (formData.email === '' || !emailRegex.test(formData.email)){
            setError((prev)=>({...prev,email:'Invalid email format'}));
        }
        if ( !passwordRegex.test(formData.password)){
            setError(((prev)=>({...prev,password:'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'})));
            console.log('password:',formData.password,'confirmPassword:',formData.confirmPassword); 
        }
        if(formData.confirmPassword !== formData.password){
            setError((prev)=>({...prev,confirmPassword:'Passwords do not match'}));
        }
        if (formData.username.length < 3){
            setError((prev)=>({...prev,username:'Username must be at least 3 characters long'}));
        }
        

    },[formData])
    disabled = Object.keys(error).length > 0;
  return (
    <form onSubmit={(e)=>handleRegister(e)}>
        <input placeholder='email'name='email' type="text" value={formData.email} onChange={(e)=>handleInputChange(e)}/>
        <div>{error.email}</div>
        <input placeholder='username' name='username' type="text" value={formData.username} onChange={(e)=>handleInputChange(e)}/>
        <div>{error.username}</div>
        <input placeholder='password' name='password' type="password" value={formData.password} onChange={(e)=>handleInputChange(e)}/>
        <div>{error.password}</div>
        <input placeholder='confirm-password' name='confirmPassword' type="password" value={formData.confirmPassword} onChange={(e)=>handleInputChange(e)}/>
        <div>{error.confirmPassword}</div>
        <button disabled={disabled} type='submit'>Register</button>
    </form>
  )
}

export default SignupForm