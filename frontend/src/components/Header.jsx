import React from "react";
import { motion } from "framer-motion";
import Nav from "./Nav";
import homeImage from "../assets/home.png";

import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';


const Header = () => {

  const navigate = useNavigate();
   const userData = useSelector((state) => state.user.userData);
    
  return (
    <motion.div
      id="Header"
      className="relative min-h-screen mb-4 bg-cover bg-center flex items-center w-full overflow-hidden"
      style={{ backgroundImage: `url(${homeImage})` }}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <Nav />
        <div className="relative text-center w-full">
          <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Welcome <span className="text-[#4dff1f]">{userData?.name}</span>
          </h1>
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-3 text-white drop-shadow-md">
              Make Your City Better Together
            </h2>
            <p className="text-xl text-gray-100 mb-6 drop-shadow-md">
              See something that needs attention in your community? Your voice matters! 
              Help us create a cleaner, safer, and more beautiful city for everyone.
            </p>
            <button 
              className="mt-5 px-8 py-3 rounded-xl bg-[#4dff1f] text-gray-900 text-2xl 
              shadow-xl font-semibold cursor-pointer hover:bg-[#3be810] transition-colors duration-300"  
              onClick={() => navigate("/report")}
            >
              Report Now
            </button>
          </div>

      </div>
    
      

     
    </motion.div>

  );
};

export default Header;
