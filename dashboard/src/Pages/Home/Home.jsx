import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from '../../features/authSlice'
import { Outlet } from 'react-router-dom';
import logo from "../../assets/logo.png"
import { Button } from '@/Components/ui/button'
import { userAccess } from '../../utils/CheckUserAccess.js'
import { RolesEnum } from '../../utils/constants.js'
import { resetDomainResultsAndSearch } from '@/features/searchTrainerSlice'

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
            dispatch(resetDomainResultsAndSearch())
            navigate('/login')
        }catch(err){
            console.log(err)
        }
    }



  return (
    // <div className=''>
    //   <nav>
    //     <h2 className='text-pink'>RJP</h2>
  
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

    <div className='p-0 m-0'>
      {/* Main Bar */}
      <div className='w-screen flex items-center p-3'>
        <div className=''>
          <img src={logo} alt="RJP logo" className='w-20 h-10'/>
        </div>
        <div>
        {/* IDK */}
        <ul className="flex items-center justify-evenly w-[80vw]">
            <Link to="/home">Home</Link>  
            {
              userAccess([RolesEnum.ADMIN, RolesEnum.MANAGER, RolesEnum.KEY_ACCOUNT], currentUser?.employee.role) && 
              <Link to="/home/search">Search Trainers</Link>
            }
            {
              userAccess([RolesEnum.ADMIN, RolesEnum.MANAGER], currentUser?.employee.role) && 
              <Link to="/home/employee">Add +</Link>
            }
            {
              userAccess([RolesEnum.ADMIN,RolesEnum.TRAINER_SOURCER], currentUser?.employee.role) && 
              <Link to='/home/trainer'>Add Trainers</Link>
            }
            
    
        </ul>
        </div>
        <div>
          {/* Notification */}
            <Button onClick={signOutNow}>
              <span className='text-white'>Sign out</span>
            </Button>
        </div>
      </div>

      {/* Sidebar */}


      {/* Main Section */}
      <div className="w-screen grid place-content-center">
        <div className='w-[80vw]'>
          <Outlet/>
        </div>
       </div>
    </div>
  )
}

export default Home
