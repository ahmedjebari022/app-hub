import React from 'react'
import { authService } from '../../services/authService';
import { useState } from 'react';
import '../../index.css';
function LoginForm() {
    const [formData,setFormData] = useState({
        'email':'',
        'password':''
    })

    function handleInputChange(e){
        const {name,value} = e.target;
        setFormData({
            ...formData,
            [name]:value
        })
    }
    async function handleLogin(e){
        e.preventDefault();
        try {
            const response = await authService.login(formData.email,formData.password);
            console.log(response);
           
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div className="neobrutalist-container">
            <form onSubmit={handleLogin} className="neobrutalist-form">
                <h2 className="neobrutalist-title">LOGIN</h2>
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="EMAIL"
                    className="neobrutalist-input"
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="PASSWORD"
                    className="neobrutalist-input"
                />
                <button type="submit" className="neobrutalist-button">
                    ENTER
                </button>
            </form>
        </div>
    );
}

export default LoginForm