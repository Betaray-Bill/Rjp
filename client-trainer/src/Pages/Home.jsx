import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLogoutQuery } from '../app/services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { useQueries, useQuery } from 'react-query';
import axios from 'axios';


function Home() {
  const userData = localStorage.getItem('user')
  const [users, setUser] = useState([])
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {user} = useSelector((state)=> state.auth)

  console.log(user)


  // Sign out
  const signOutFunction = () => {
    return axios.get('http://localhost:5000/api/trainer/signout')
  }

  
  const signOut = async() => {
    signOutFunction()
    dispatch(logout())
    navigate("/login")
  }
  console.log(user)

  return (
    <div>
      <h2 onClick={signOut}>Sign Out</h2>
      Home
      {
        users &&
        <p>
          {
            JSON.stringify(users)
          }
        </p>
      }
    </div>
  )
}

export default Home
