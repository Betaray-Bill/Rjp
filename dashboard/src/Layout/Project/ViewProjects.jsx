import { Button } from '@/components/ui/button'
import CardProject from '@/Pages/Company/CardProject'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function ViewProjects() {

  const { currentUser } = useSelector(state => state.auth)
  const fetchProjects = async () => {
    const response = await axios.get(`http://localhost:5000/api/project/projects-employees/${currentUser.employee._id}`)
    return response.data.projects.Projects
  }

  const { data: projects, isLoading, error } = useQuery(
    ['projects', currentUser.employee._id], 
    fetchProjects,
    {
      staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
      cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
    }
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>


  console.log(projects)
  return (
    <div>
      <div className='flex justify-between'>
            <div></div>
            <Link to="/home/projects/create">
                <Button className="rounded-none bg-blue-700">Create Project</Button>
            </Link>
      </div>

      {/* View All prev Projects */}
      <div className='grid grid-cols-3 gap-8 mt-10'>
        {
          projects && projects?.map((project) => (
            <Link to={`/home/projects/view/${project._id}`}>
              <CardProject key={project._id} project={project} />
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default ViewProjects
