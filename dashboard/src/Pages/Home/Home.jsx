import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '../../features/authSlice'
import { Outlet } from 'react-router-dom';

function Home() {
  const dispatch = useDispatch()
  const navigate= useNavigate()
    const {currentUser} = useSelector(state => state.auth)
    // const [role, setRole] = useState("")
    useEffect(() => {
        // console.log(currentUser)
        // if(currentUser){
        //     setRole(currentUser.employee.role[0]?.name)
        // }
    }, [])
    axios.defaults.withCredentials = true;
    const signOutNow = async() => {
        try{
          const res = axios.get('http://localhost:5000/api/employee/signout')
          console.log(res.data)
            dispatch(signOut())
            navigate('/login')
        }catch(err){
            console.log(err)
        }
    }



  return (
    // <div className=''>
    //   <nav>
    //     <h2 className='text-pink'>RJP</h2>
    //     <ul className={{display: 'flex'}}>
    //         <Link to="/home">Home</Link>  
    //         {
    //           (currentUser.employee.role[0]?.name === 'ADMIN' || currentUser.employee.role[0]?.name === 'MANAGER' || currentUser.employee.role[0]?.name === "KeyAccounts")&& 
    //           <Link to="/home/search">Search Trainers</Link>
    //         }
    //         {
    //           (currentUser.employee.role[0]?.name === 'ADMIN' || currentUser.employee.role[0]?.name === 'MANAGER' )&& 
    //           <Link to="/home/add">Add +</Link>
    //         }
    //         {
    //           (currentUser.employee.role[0]?.name === 'ADMIN' || currentUser.employee.role[0]?.name === 'MANAGER' || currentUser.employee.role[0]?.name === "Trainer Sourcer")&& 
    //           <Link to='/home/trainer'>Add Trainers</Link>
    //         }
            
    //         <Link to="/home/profile">Profile</Link>
    //     </ul>
    //     <button onClick={signOutNow}> 
    //       sign Out
    //     </button>
    //   </nav>

    //   {currentUser && <p>Welcome, {currentUser.employee?.name}</p>}
    //   <h5>You are {currentUser && currentUser.employee.role[0]?.name}</h5>
      
    //   <div className="container">
    //     <Outlet/>
        
    //   </div>
    // </div>

    <div className='p-0 m-0 h-screen w-screen'>
      {/* Main Bar */}
      <div className='w-screen'>
        <div className=''>
          <img src="../../assets/logo.png" alt="RJP logo" className='w-20'/>
        </div>
        <div>

        </div>
        <div>
          {/* Notification */}

          {/* Accounts */}
          
        </div>
      </div>

      {/* Sidebar */}
    </div>
  )
}

export default Home
