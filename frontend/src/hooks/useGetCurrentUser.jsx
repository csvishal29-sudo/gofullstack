import axios from 'axios';
import React,  { useEffect } from 'react';
import { serverURL } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';


function useGetCurrentUser() {
    const dispatch = useDispatch();

    useEffect(() => {
       

        const fetchUser = async () => {
          try {
            const result = await axios.get(`${serverURL}/api/user/current`,
            { withCredentials: true });
            
                dispatch(setUserData(result.data));
            
          } catch (error) {
            
                dispatch(setUserData(null));
            }
            
          }
        
        
        fetchUser();

       
    }, [dispatch])
  }
export default useGetCurrentUser;