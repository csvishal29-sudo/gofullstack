import React from 'react'
import { useSelector } from 'react-redux';
import UserDashboard from '../components/userDashboard';


function Home()  {
    const {userData}=useSelector((state)=>state.user);

  return (
    <div >
      {<UserDashboard/>}
      


    </div>
  )
}

export default Home