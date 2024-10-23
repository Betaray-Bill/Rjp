import { RolesEnum } from '@/utils/constants';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.png"
import { userAccess } from '@/utils/CheckUserAccess';

function Sidebar() {
    const dispatch = useDispatch()
    const navigate= useNavigate()
    const location = useLocation(); // Get the current URL
    const {currentUser} = useSelector(state => state.auth)

    // Helper function to check if the current path matches the given path
    const isActive = (path) =>{
        if(path === "home"){
            return location.pathname.split('/')[location.pathname.split('/').length -1] === "home"
        }
        return location.pathname.split('/').includes(path)
    };

  return (
    <div className='h-screen fixed w-[280px] border-r-[1px]'>
    <div className='p-4 flex items-center h-[80px]'>
      <img src={logo} alt="RJP logo" className='w-20 h-10'/>
      <p className='font-semibold text-lg pl-2 text-gray-700'>RJP Infotek</p>
    </div>
    {/* sidebar content */}
    <div className='mt-10 m-4 py-2'>
      <Link to="/home" className={`flex items-center nav-link rounded-md py-2 px-[8px] mt-2 ${isActive('home') ? "bg-blue-100" : "bg-white"}`}>
        <ion-icon name="home-outline" style={{fontSize:"18px"}} className=""></ion-icon>
        <span className='ml-2 text-[16px] text-black'>
          <p className='text-black'>Home</p>  
        </span>
      </Link>
      {
        userAccess([RolesEnum.ADMIN, RolesEnum.MANAGER, RolesEnum.KEY_ACCOUNT], currentUser?.employee.role) && 
            <Link to="/home/search" className={`flex items-center nav-link rounded-md py-2 px-[8px] mt-2 ${isActive('search') ? "bg-blue-100" : "bg-white"}`}>
                <ion-icon name="search-outline" style={{fontSize:"18px"}} className=""></ion-icon>
                <span className='ml-2 text-[16px] text-black'>
                  <p className='text-black'>Search Trainers</p>
                </span>
            </Link>   
                
      }
      {
       userAccess([RolesEnum.ADMIN, RolesEnum.MANAGER], currentUser?.employee.role) && 
            <Link to="/home/employee" className={`flex items-center nav-link rounded-md py-2 px-[8px] mt-2 ${isActive('employee') ? "bg-blue-100" : "bg-white"}`}>
                <ion-icon name="person-add-outline" style={{fontSize:"18px"}} className=""></ion-icon>
                <span className='ml-2 text-[16px] text-black'>
                  <p className='text-black'>Employee</p>
                </span>
            </Link>   
                
      }
      {
         userAccess([RolesEnum.ADMIN,RolesEnum.TRAINER_SOURCER], currentUser?.employee.role) && 
            <Link to="/home/trainer" className={`flex items-center nav-link rounded-md py-2 px-[8px] mt-2 ${isActive('trainer') ? "bg-blue-100" : "bg-white"}`}>
                <ion-icon name="book-outline" style={{fontSize:"18px"}} className=""></ion-icon>
                <span className='ml-2 text-[16px] text-black'>
                  <p className='text-black'>Trainers</p>
                </span>
            </Link>   
                
      }
    </div>
  </div>
  )
}

export default Sidebar
