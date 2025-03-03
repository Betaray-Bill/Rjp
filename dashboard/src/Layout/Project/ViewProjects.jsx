import { Button } from '@/components/ui/button'
import CardProject from '@/Layout/Project/Pipeline/Components/CardProject'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PipeLine from './Pipeline/PipeLine'
import { userAccess } from '@/utils/CheckUserAccess'
import { RolesEnum } from '@/utils/constants'

function ViewProjects() {
  const {currentUser} = useSelector(state => state.auth)

  return (
    <div>
      <div className='flex justify-between items-center'>
            <div className='text-xl font-semibold text-gray-800'>
              Projects
            </div>
            {
             userAccess([RolesEnum.ADMIN, RolesEnum.KEY_ACCOUNT], currentUser?.employee.role)
              && (
                <Link to="/home/projects/create">
                <Button className="rounded-none bg-blue-700">Create Deal</Button>
            </Link>
              )
            }
      </div>

      {/* View All prev Projects */}
    
      <div className='mt-2'>
        <PipeLine />
      </div>
    </div>
  )
}

export default ViewProjects
