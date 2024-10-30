import { userAccess } from '@/utils/CheckUserAccess'
import { RolesEnum } from '@/utils/constants'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'

function Company() {
  const {currentUser} = useSelector(state => state.auth)

  return (
    <div className='w-[80vw] h-max min-h-[80vh] py-4 px-3'>
        
        <div className='flex items-center justify-start mt-8'>
            {/* Add Company */}
            {
                userAccess([RolesEnum.ADMIN], currentUser?.employee.role) &&
                (
                    <Link to="/home/company/add-company" className='flex items-center justify-between border border-black p-2 px-5 rounded-md hover:bg-blue-100 cursor-pointer'>
                        <ion-icon name="add-outline" style={{fontSize:"20px", marginRight:"10px"}}></ion-icon>
                        <span>Add Company</span>
                    </Link>
                ) 
            }

            {/* View COmpany */}
            {
                userAccess([RolesEnum.ADMIN, RolesEnum.MANAGER], currentUser?.employee.role) &&
                (
                    <div className='flex items-center justify-between border border-black p-2 px-5 ml-10 rounded-md hover:bg-blue-100 cursor-pointer'> 
                        <ion-icon name="eye-outline" style={{fontSize:"20px", marginRight:"10px"}}></ion-icon>
                        <span>View Company</span>
                    </div>
                ) 
            }

            {/* Edit the Company Data - Add Contact Details  */}
            {
                userAccess([RolesEnum.ADMIN], currentUser?.employee.role) &&
                (
                    <div className='border border-black p-2 px-5 ml-10 rounded-md hover:bg-blue-100 cursor-pointer'>
                        Add Contact to Company
                    </div>
                ) 
            }
        </div>

        <div>
            <Outlet />
        </div>
    </div>
  )
}

export default Company
