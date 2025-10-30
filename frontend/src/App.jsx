import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginForm from './features/auth/LoginForm.jsx';
import SignupForm from './features/auth/SignupForm.jsx';
import {Routes ,Route} from 'react-router-dom';
import Applications from './features/applications/Applications.jsx';
import ApplicationForm from './features/applications/ApplicationForm.jsx';
function App() {
  

  return (
   <Routes>
    <Route path='/login' element={<LoginForm/>}/>
    <Route path='/signup' element={<SignupForm/>}/>
    <Route path='/applications' element={<Applications/>}/>
    <Route path='/applications/form' element={<ApplicationForm/>}/>
   </Routes>
  )
}


export default App
