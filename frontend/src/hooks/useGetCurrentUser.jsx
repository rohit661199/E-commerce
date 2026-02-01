import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice';
import { serverUrl } from '../App';


function useGetCurrentUser() {
    const dispatch=useDispatch();
  useEffect(()=>{
  const fetchUser=async () => { 
    
    try {
      const token=localStorage.getItem("token")
           const {data}=await axios.get("http://localhost:4000/api/user/current",{ headers: { token } })
            console.log(data.user)
            dispatch(setUserData(data.user))
  
    } catch (error) {
        console.log(error)
    }
}
fetchUser()
 
  },[])
}

export default useGetCurrentUser
