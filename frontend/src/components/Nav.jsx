import React from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { serverUrl } from '../utils/config.js';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import ProfilePopup from './ProfilePopup';
import axios from 'axios';
import { CiLogout } from "react-icons/ci";
// CgProfile not used here
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Nav() {

    const navigate=useNavigate()

    const { userData,city } = useSelector(state => state.user);
   
    const dispatch=useDispatch()
    const handleLogOut=async () =>{
        try{
            const result=await axios.get(`${serverUrl}/api/auth/signout`,
                {withCredentials:true})
                dispatch(setUserData(null))
                console.log(result)
                navigate('/signin')

            }catch (error){

                console.log(error)
        }
    }

    


    return (
        <div className="w-full h-20 fixed top-0 z-50 flex items-center justify-between px-6 bg-black/10 backdrop-blur-sm">
            <h1 className="text-3xl font-bold text-[#4dff1f] drop-shadow-md hover:text-[#3be810] transition-colors duration-300 cursor-pointer"
                onClick={() => navigate('/')}>
                GoCity
            </h1>

            <div className="hidden md:flex items-center space-x-2 w-48">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-white/20 backdrop-blur-md border border-white/30">
                    <FaMapMarkerAlt className="text-[#4dff1f] text-xl drop-shadow-md" />
                    <div className="truncate text-white font-medium drop-shadow-sm">{city}</div>
                </div>
            </div>

            <button 
                className="px-3 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white text-sm font-medium 
                border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg"
                onClick={() => navigate("/status")}
            >
                View Status
            </button>

            <div className="flex items-center space-x-4">
                <ProfilePopup className="flex items-center" handleLogOut={handleLogOut} />
                
                <button
                    className="hidden md:flex p-2 rounded-full bg-[#4dff1f] text-gray-900 hover:bg-[#3be810] 
                    transition-all duration-300 items-center justify-center shadow-lg"
                    onClick={handleLogOut}
                >
                    <CiLogout className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default Nav
