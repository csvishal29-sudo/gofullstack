// components/ProfilePopup.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../utils/config.js';
import { assets } from "../assets/assets";
import { CgProfile } from "react-icons/cg";


export default function ProfilePopup() {
  const userData = useSelector((state) => state.user.userData);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      setOpen(false);
      navigate('/signin');
    } catch (err) {
      console.error('Logout error', err);
    }
  };


  return (
    <div className="relative">
      {/* Profile Logo */}
      <CgProfile  className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-green-500
  text-[18px] shadow-xl font-bold cursor-pointer" onClick={() => setOpen((prev) => !prev)} />
       
      

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-2xl p-4 z-50 border"
          >
            <div className="flex flex-col items-center text-center">
               <img src={assets.profile} alt="" 
                className="w-16 h-16 rounded-full mb-2 border"
              />
              <p className="text-lg font-semibold">
                {userData?.name}
              </p>
              <p className="text-sm text-gray-500">
                {userData?.email}
              </p>
              <button
                onClick={handleLogOut}
                className="mt-3 w-full bg-green-500 text-white py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
