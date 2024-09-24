import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '../../features/authSlice'

function Home() {
  const dispatch = useDispatch()
  const navigate= useNavigate()
    const {currentUser} = useSelector(state => state.auth)
    const [role, setRole] = useState("")
    useEffect(() => {
        console.log(currentUser)
        if(currentUser){
            setRole(currentUser.employee.role.name)
        }
    }, [])
    axios.defaults.withCredentials = true;
    const signOutNow = async() => {
      console.log("meow")
        // localStorage.removeItem('user')
        // window.location.href = '/login'
        try{
            // const res = await axios('http://localhost:5000/api/employee/signout')
            // const data = await res.data
            // console.log(data)
            dispatch(signOut())
            navigate('/login')
        }catch(err){
            console.log(err)
        }
    }

  return (
    <div>
      Home
      <button onClick={signOutNow}>
        sign Out
      </button>
      {currentUser && <p>Welcome, {currentUser.employee.name}</p>}
      <h5>You are {currentUser && currentUser.employee.role.name}</h5>
      <nav>
        <ul>
            <li>Home</li>
            <li>Search Trainers</li>
            <li>
            <Link to="/trainer-register">Trainer Register</Link>
            </li>
            <Link to="/profile">Profile</Link>
        </ul>
      </nav>
    </div>
  )
}

export default Home
