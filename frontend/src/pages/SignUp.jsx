import React from 'react'
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa"
import { FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
export const serverUrl="https://gocity-backend.onrender.com"
import { useDispatch } from 'react-redux';

const SignUp = () => {

    const primaryColor="#329713ff"
    const hoverColor="#2bc752ff"
    const bgColor="#fff9f6"
    const borderColor="#ddd"
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [isLoading, setIsLoading]=useState(false);
    const dispatch=useDispatch();
    const navigate = useNavigate();

    const handleSignup=async () =>{
      if (!name || !email || !password) {
        return;
      }
      setIsLoading(true);
      try{
        const result = await axios.post(`${serverUrl}/api/auth/signup`,{
          name,
          email,
          password
        },{withCredentials:true})
        dispatch(setUserData(result.data))
        // navigate to home immediately after successful sign-up
        navigate('/');
      }catch(error){
        console.log(error)
      }finally{
        setIsLoading(false);
      }
    }

    


  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4'
     style={{backgroundColor: bgColor}}>
        <div className='max-w-md w-full bg-white p-8 rounded-xl shadow-lg p-8 border-[1px] style={{
        border:1px solod ${borderColor}}}>'> 
          <h1 className={`text-3xl font-bold mb-2 `} style={{color:primaryColor}}>
            GoCity</h1>
            <p className='text-gray-600 mb-8'>Create your account to report on gocity</p>

            {/* name input */}

            <div className='mb-4'>
                <label  htmlFor="name" className='block text-gray-700 mb-1 font-medium'>Name</label>
                <input type="text" className='w-full border rounded-lg px-3 py-2 focus:outline-none
                focus:border-orange-500 ' placeholder ='Enter your Name ' style={{border:`1px 
                solid ${borderColor}`}} onChange={(e)=>setName(e.target.value)} value={name}/>
            </div>

             {/* email input */}

            <div className="mb-4">
                <label  htmlFor="email" className='block text-gray-700 mb-1 font-medium'>email</label>
                <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none
                focus:border-orange-500 ' placeholder ='Enter your email' style={{border:`1px 
                solid ${borderColor}`}}  onChange={(e)=>setEmail(e.target.value)} value={email}/>
            </div>

             {/* passwordinput */}

            <div className="mb-4">
                <label  htmlFor="password" className='block text-gray-700 mb-1 font-medium'>Password</label>
                <div className='relative'>
                <input type={`${showPassword?"text":"password"}`} className='w-full border rounded-lg
                 px-3 py-2 focus:outline-none
                focus:border-orange-500 ' placeholder ='Enter your password' style={{border:`1px 
                solid ${borderColor}`}}  onChange={(e)=>setPassword(e.target.value)} value={password}/>
                
                <button className='absolute right-3 cursor-pointer top-[14px] text-gray-500' 
                onClick={()=>setShowPassword(prev=>!prev)}>{!showPassword?
                 <FaRegEye />:<FaRegEyeSlash />}</button>
                </div>
            </div>
            
            <button 
              className='w-full text-white font-semibold py-2 rounded-lg
              transition duration-200 hover:bg-[#0b862aff] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed' 
              style={{backgroundColor:primaryColor}}
              onClick={handleSignup}
              disabled={isLoading || !name || !email || !password}
            >
                {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
            <p className='text-center mt-6 cursor-pointer' >Already have an account ? <span className="text-[#3da81dff]">
                 <Link to="/signin">Sign In</Link></span></p>
          
          
        </div>
      
    </div>
  )
}

export default SignUp
