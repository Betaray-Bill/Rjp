import {RolesEnum} from '@/utils/constants';
import React from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import logo from "../../assets/logo.png"
import {userAccess} from '@/utils/CheckUserAccess';
import axios from 'axios';
import {resetDomainResultsAndSearch} from '@/features/searchTrainerSlice';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from '@/features/authSlice';


function Sidebar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation(); // Get the current URL
    const {currentUser} = useSelector(state => state.auth)
  console.log(currentUser)
    // Helper function to check if the current path matches the given path
    const isActive = (path) => {
        if (path === "home") {
            return location
                .pathname
                .split('/')[
                    location
                        .pathname
                        .split('/')
                        .length - 1
                ] === "home"
        }
        return location
            .pathname
            .split('/')
            .includes(path)
    };

    axios.defaults.withCredentials = true;
    const signOutNow = async() => {
        try {
            const res = axios.get('http://localhost:5000/api/employee/signout')
            console.log(res.data)
            dispatch(signOut())
            dispatch(resetDomainResultsAndSearch())
            navigate('/login')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='h-screen fixed w-[250px] border-r-[1px]'>
            <div className='p-4 flex items-center h-[80px]'>
                <img src={logo} alt="RJP logo" className='w-20 h-10'/>
                <p className='font-semibold text-lg pl-2 text-gray-700'>RJP Infotek</p>
            </div>
            {/* sidebar content */}
            <div className='mt-10 m-4 py-2'>
                <Link
                    to="/home"
                    className={`flex items-center nav-link rounded-md py-2 px-[8px] mt-2 ${isActive('home')
                    ? "bg-blue-100"
                    : "bg-white"}`}>
                    <ion-icon
                        name="home-outline"
                        style={{
                        fontSize: "18px"
                    }}
                        className=""></ion-icon>
                    <span className='ml-2 text-[16px] text-black'>
                        <p className='text-black'>Home</p>
                    </span>
                </Link>
                {userAccess([
                    RolesEnum.ADMIN, RolesEnum.MANAGER, RolesEnum.KEY_ACCOUNT
                ], currentUser
                    ?.employee.role) && <Link
                        to="/home/search"
                        className={`flex items-center nav-link rounded-md py-2 px-[8px] mt-2 ${isActive('search')
                        ? "bg-blue-100"
                        : "bg-white"}`}>
                        <ion-icon
                            name="search-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            className=""></ion-icon>
                        <span className='ml-2 text-[16px] text-black'>
                            <p className='text-black'>Search Trainers</p>
                        </span>
                    </Link>
}
                {userAccess([
                    RolesEnum.ADMIN, RolesEnum.KEY_ACCOUNT
                ], currentUser
                    ?.employee.role) && 
                    <Link
                        to="/home/projects"
                        className={`flex items-center nav-link rounded-md py-2 px-[8px] mt-2 ${isActive('projects')
                        ? "bg-blue-100"
                        : "bg-white"}`}>
                        <ion-icon
                            name="file-tray-stacked-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            className=""></ion-icon>
                        <span className='ml-2 text-[16px] text-black'>
                            <p className='text-black'>Projects</p>
                        </span>
                    </Link>
                }
                {userAccess([
                    RolesEnum.ADMIN, RolesEnum.MANAGER
                ], currentUser
                    ?.employee.role) && <Link
                        to="/home/employee"
                        className={`flex items-center nav-link rounded-md py-2 px-[8px] mt-2 ${isActive('employee')
                        ? "bg-blue-100"
                        : "bg-white"}`}>
                        <ion-icon
                            name="person-add-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            className=""></ion-icon>
                        <span className='ml-2 text-[16px] text-black'>
                            <p className='text-black'>Employee</p>
                        </span>
                    </Link>
}
                {userAccess([
                    RolesEnum.ADMIN, RolesEnum.TRAINER_SOURCER
                ], currentUser
                    ?.employee.role) && <Link
                        to="/home/trainer"
                        className={`flex items-center nav-link rounded-md py-2 px-[8px] mt-2 ${isActive('trainer')
                        ? "bg-blue-100"
                        : "bg-white"}`}>
                        <ion-icon
                            name="book-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            className=""></ion-icon>
                        <span className='ml-2 text-[16px] text-black'>
                            <p className='text-black'>Trainers</p>
                        </span>
                    </Link>
}
              {userAccess([
                    RolesEnum.ADMIN, RolesEnum.MANAGER
                ], currentUser
                    ?.employee.role) && <Link
                        to="/home/company"
                        className={`flex items-center nav-link rounded-md py-2 px-[8px] mt-2 ${isActive('company')
                        ? "bg-blue-100"
                        : "bg-white"}`}>
                        <ion-icon
                            name="podium-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            className=""></ion-icon>
                        <span className='ml-2 text-[16px] text-black'>
                            <p className='text-black'>Company</p>
                        </span>
                    </Link>
}
            </div>

            <div className='absolute bottom-0 p-4'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className='flex justify-between items-center'>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className='ml-2 font-semibold'>{currentUser.employee?.name}</span>                    
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-4">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center">
                    <ion-icon name="person-outline"></ion-icon>
                    <span>
                      <Link to="/home/profile">Profile</Link>
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button onClick={() => signOutNow()}>Sign out</Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>


        </div>
    )
}

export default Sidebar
