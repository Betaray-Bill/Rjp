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
import Sidebar from '@/Layout/Home/Sidebar'
import { Button } from '@/components/ui/button'
import api from '@/utils/api'

function Home() {
  const dispatch = useDispatch()
  const navigate= useNavigate()
  const location = useLocation(); // Get the current URL
  // Helper function to check if the current path matches the given path
  const isActive = (path) =>{
    return location.pathname.split('/').includes(path)
  };

    const {currentUser} = useSelector(state => state.auth)
    console.log(currentUser)
    axios.defaults.withCredentials = true;
    const signOutNow = async() => {
        try{
          const res = api.get('http://bas.rjpinfotek.com:5000/api/employee/signout')
          console.log(res.data)
            dispatch(signOut())
            dispatch(resetDomainResultsAndSearch())
            localStorage.removeItem('empToken');
            navigate('/login')
        }catch(err){
            console.log(err)
        }
    }



  return (

    <div className='p-0 m-0'>
      <div className="flex">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Section */}
        <div className="grid w-full ml-[250px] p-4">
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

              <div className=''>
                <Outlet/>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
