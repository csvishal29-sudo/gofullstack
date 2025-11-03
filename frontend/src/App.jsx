import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import ForgotPasword from './pages/ForgotPassword.jsx'
import useGetCurrentUser from './hooks/useGetCurrentUser.jsx'
import { useSelector } from 'react-redux'
export const serverURL="http://localhost:3030"
import Home from './pages/Home.jsx'
import { Navigate } from 'react-router-dom'
import useGetCity from './hooks/useGetCity.jsx'
import Report from './components/Report.jsx'

import Capture from './components/Capture.jsx'
import Status from './components/Status.jsx'
const App = () => {
  useGetCurrentUser();
  useGetCity()
  const {userData} = useSelector((state) => state.user);
  
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (userData !== undefined) {
      setIsLoading(false);
    }
  }, [userData]);

  if (isLoading) {
    return null;
  }

  return (

    
    
    <Routes>
      <Route 
        path="/signin" 
        element={userData ? <Navigate to="/" replace /> : <SignIn />} 
      />
      <Route 
        path="/signup" 
        element={userData ? <Navigate to="/" replace /> : <SignUp />} 
      />
      <Route 
        path="/forgot-password" 
        element={userData ? <Navigate to="/" replace /> : <ForgotPasword />} 
      />
      <Route 
        path="/" 
        element={userData ? <Home /> : <Navigate to="/signin" replace />} 
        />

        <Route
        path="/report" element={<Report/>}/>

        <Route path="/capture" element={<Capture />} />

         <Route path="/status" element={<Status />} />

          <Route path="/capture" element={<Capture />} />

        

      
     

    </Routes>


   
   


  )
}

export default App
