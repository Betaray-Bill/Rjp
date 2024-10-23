import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate,useLocation } from 'react-router-dom'
import { signOut } from '../../features/authSlice'
import { Outlet } from 'react-router-dom';
import logo from "../../assets/logo.png"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { userAccess } from '../../utils/CheckUserAccess.js'
import { RolesEnum } from '../../utils/constants.js'
import { resetDomainResultsAndSearch } from '@/features/searchTrainerSlice'

function Home() {
  const dispatch = useDispatch()
  const navigate= useNavigate()
  const location = useLocation(); // Get the current URL
  // Helper function to check if the current path matches the given path
  const isActive = (path) =>{
    return location.pathname.split('/').includes(path)
  };

    const {currentUser} = useSelector(state => state.auth)

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

    <div className='p-0 m-0'>
      <div className="flex">

        {/* Sidebar */}
        <div className='h-screen fixed w-[280px] border-r-[1px]'>
          <div className='p-4 flex items-center h-[80px]'>
            <img src={logo} alt="RJP logo" className='w-20 h-10'/>
            <p className='font-semibold text-lg pl-2 text-gray-700'>RJP Infotek</p>
          </div>
          {/* sidebar content */}
          <div className='mt-10 m-4 py-2'>
            <Link to="/home" className="flex items-center nav-link rounded-md py-2 px-[8px] mt-2">
              <ion-icon name="home-outline" style={{fontSize:"18px"}} className=""></ion-icon>
              <span className='ml-2 text-[16px] text-black'>
                <p className='text-black'>Home</p>  
              </span>
            </Link>
            {
              userAccess([RolesEnum.ADMIN, RolesEnum.MANAGER, RolesEnum.KEY_ACCOUNT], currentUser?.employee.role) && 
                  <Link to="/home/search" className="flex items-center nav-link rounded-md py-2 px-[8px] mt-2">
                      <ion-icon name="search-outline" style={{fontSize:"18px"}} className=""></ion-icon>
                      <span className='ml-2 text-[16px] text-black'>
                        <p className='text-black'>Search Trainers</p>
                      </span>
                  </Link>   
                      
            }
            {
             userAccess([RolesEnum.ADMIN, RolesEnum.MANAGER], currentUser?.employee.role) && 
                  <Link to="/home/employee" className="flex items-center nav-link rounded-md  py-2 px-[8px] mt-2">
                      <ion-icon name="person-add-outline" style={{fontSize:"18px"}} className=""></ion-icon>
                      <span className='ml-2 text-[16px] text-black'>
                        <p className='text-black'>Employee</p>
                      </span>
                  </Link>   
                      
            }
            {
               userAccess([RolesEnum.ADMIN,RolesEnum.TRAINER_SOURCER], currentUser?.employee.role) && 
                  <Link to="/home/trainer" className="flex items-center nav-link rounded-md  py-2 px-[8px] mt-2">
                      <ion-icon name="book-outline" style={{fontSize:"18px"}} className=""></ion-icon>
                      <span className='ml-2 text-[16px] text-black'>
                        <p className='text-black'>Trainers</p>
                      </span>
                  </Link>   
                      
            }
          </div>
        </div>

        {/* Main Section */}
        <div className="grid w-full ml-[280px] place-content-center">
            <div className=''>
              {/* <div className='flex justify-end items-center p-4 absolute top-0 z-10 bg-pink-100'>
                <DropdownMenu>
                  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>  */}
              <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
