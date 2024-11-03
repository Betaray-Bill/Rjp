import { Button } from '@/components/ui/button'
import CardProject from '@/Pages/Company/CardProject'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function ViewProjects() {
  const [projects, setProjects] = useState()
  const {currentUser} = useSelector(state => state.auth)
  const fetchProjects = async() => {
    try {
      const response = await axios.get(`http://localhost:5000/api/project/projects-employees/${currentUser.employee._id}`)
      setProjects(response.data.projects.Projects)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])
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
            <CardProject key={project._id} project={project} />
          ))
        }
      </div>
    </div>
  )
}

export default ViewProjects
