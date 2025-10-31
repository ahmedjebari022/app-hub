import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginForm from './features/auth/LoginForm.jsx';
import SignupForm from './features/auth/SignupForm.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import Applications from './features/applications/Applications.jsx';
import ApplicationForm from './features/applications/ApplicationForm.jsx';
import ApplicationEdit from './features/applications/ApplicationEdit.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<LoginForm />} />
        <Route path='/signup' element={<SignupForm />} />
        
        {/* Protected routes */}
        <Route 
          path='/applications' 
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/applications/form' 
          element={
            <ProtectedRoute>
              <ApplicationForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/applications/:id' 
          element={
            <ProtectedRoute>
              <ApplicationEdit />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path='/' element={<Navigate to="/applications" replace />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
