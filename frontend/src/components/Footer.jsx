import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='pt-5 px-4 md:px-20 lg:px-30 bg-green-900 w-full overflow-hidden' id='Footer'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-start'>
          <div className='w-full md:w-1/3 mb-8 md:mb-0'>
            <img src={assets.recycle_logo} alt="" />
            <p className='text-gray-400 mt-4'> a next-generation Smart City Management Platform designed to make 
          urban living more efficient, sustainable, and connected.  
          Our system integrates advanced technologies like IoT, AI, and 
          data analytics to improve transportation, energy use, and 
          citizen engagement.</p>
          </div>
          <div className='w-full md:w-1/5 mb-8 md:mb-0'>
            <h3 className='text-white text-lg font-bold mb-4'>Company</h3>
            <ul className='flex flex-col gap-2 text-gray-400'>
              <a href="#Header" className='hover:text-white'>Home</a>
              <a href="#about" className='hover:text-white'>About Us</a>
              <a href="#feedback" className='hover:text-white'>Feedback</a>
              <a href="#" className='hover:text-white'>Privacy policy</a>
            </ul>
          </div>
          <div className='w-full md:w-1/3'>
          <h3 className='text-white text-lg font-bold mb-4'>Subscribe to our newsletter</h3>
          <p className='text-gray-400 mb-4 max-w-80'>The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className='flex gap-2'>
            <input type="email" placeholder="Enter your email" className='p-2 rounded bg-gray-800 text-gray-400 border border-gray-700 focus:outline-none w-full md:w-auto'/>
            <button className='py-2 px-4 rounded bg-green-500 text-white'>Subscribe</button>
          </div>
          </div>
        </div>
        <div className='border-t border-gray-700 py-4 mt-5 text-center text-gray-500' >
          Copyright 2025 @ Gocity. All Right Reserved.
        </div>
    </div>
  )
}

export default Footer