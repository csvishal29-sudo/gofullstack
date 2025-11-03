import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../utils/config.js';




const ForgotPassword = () => {
    const [step, setStep] = React.useState(1);
    const [email, setEmail]=useState("");
    const [otp, setOtp]=useState("");
    const [newPassword, setNewPassword]=useState("");
    const [confirmPassword, setConfirmPassword]=useState("");
    const navigate = useNavigate();

    const handleSendOtp= async()=>{   
        try{
            const result = await axios.post(`${serverUrl}/api/auth/send-otp`,
                {email},
            {withCredentials:true})
            console.log(result)
            setStep(2) 
           
        }catch(error){
            console.log(error)

        }   
    }

     const handleVerifyOtp= async()=>{   
        try{
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`,
                {email,otp},
            {withCredentials:true})
            console.log(result)
            setStep(3) 
           
        }catch(error){
            console.log(error)

        }   
    }

     const handleResetPassword= async()=>{ 
        if(newPassword !== confirmPassword){
            alert("Passwords do not match");
            return null;
        }  
        try{
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`,
                {email,newPassword},
            {withCredentials:true})
            console.log(result)
            navigate("/signin");
           
        }catch(error){
            console.log(error)

        }   
    }


    return (
        <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
                <div className='flex items-center gap-4 mb-4'>


                    <IoIosArrowRoundBack size={30} className='text-[#3da81dff] cursor-pointer' onClick={()=>navigate("/signin")}/>
                    <h1 className='text-2xl font-bold text-center text-[#3da81dff]'>Forgot Password</h1>
                </div>
                {step == 1
                    &&
                    <div>
                        {/* email input */}

            <div className="mb-6">
                <label  htmlFor="email" className='block text-gray-700 mb-1 font-medium'>email</label>
                <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none
                border-[1px] border-gray-200' placeholder ='Enter your email' 
                 onChange={(e)=>setEmail(e.target.value)} value={email}/>
            </div>
             <button 
                onClick={handleSendOtp}
                className={`w-full text-white font-semibold py-2 rounded-lg
                transition duration-200 bg-[#0b862aff] cursor-pointer`} > 
                Send Otp
            </button>

                    </div>}

                    {step == 2
                    &&
                    <div>
                        {/* otp input */}

            <div className="mb-6">
                <label  htmlFor="email" className='block text-gray-700 mb-1 font-medium'>OTP</label>
                <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none
                border-[1px] border-gray-200' placeholder ='Enter ' 
                 onChange={(e)=>setOtp(e.target.value)} value={otp}/>
            </div>
             <button 
                onClick={handleVerifyOtp}
                className={`w-full text-white font-semibold py-2 rounded-lg
                transition duration-200 bg-[#0b862aff] cursor-pointer`} > 
                Verify 
            </button>

            </div>}

              {step == 3
                    &&
                    <div>
                        {/* Confirm input */}

            <div className="mb-6">
                <label  htmlFor="newPassword" className='block text-gray-700 mb-1 font-medium'>New Password</label>
                <input type="password" className='w-full border rounded-lg px-3 py-2 focus:outline-none
                border-[1px] border-gray-200' placeholder ='Enter New Password' 
                 onChange={(e)=>setNewPassword(e.target.value)} value={newPassword}/>
            </div>

             <div className="mb-6">
                <label  htmlFor="ConfirmPassword" className='block text-gray-700 mb-1 font-medium'>Confirm Password</label>
                <input type="password" className='w-full border rounded-lg px-3 py-2 focus:outline-none
                border-[1px] border-gray-200' placeholder ='Confirm Password' 
                 onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword}/>
            </div>
             <button 
                onClick={handleResetPassword}
                className={`w-full text-white font-semibold py-2 rounded-lg
                transition duration-200 bg-[#0b862aff] cursor-pointer`}> 
                Reset Password
            </button>

            </div>}


            </div>

        </div>
    )
}

export default ForgotPassword
