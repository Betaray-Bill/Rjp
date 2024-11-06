import React from 'react'
import Column from './Components/Column';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CardProject from '@/Layout/Project/Pipeline/Components/CardProject';
const stages = [
    "one ",
    "two",
    "three",
    "four",
    "five",
    "six",
]
function PipeLine() {

    const { currentUser } = useSelector(state => state.auth)
    const fetchProjects = async () => {
        const response = await axios.get(`http://localhost:5000/api/project/projects-employees/${currentUser.employee._id}`)
        return response.data.projects.Projects
      }
    
      const { data: projects, isLoading, error } = useQuery(
        ['projects', currentUser.employee._id], 
        fetchProjects,
        {
          staleTime: 1000 * 60 * 5, // data stays    fresh for 5 minutes
          cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
        }
      )
    
      if (isLoading) return <div>Loading...</div>
      if (error) return <div>Error: {error.message}</div>
    


  return (  
    <div className='overflow-x-auto overflow-y-hidden'>
        <div className='flex space-x-8 w-[max]'>
            {
                stages.map((stage, index) => (
                    <Column index={index} stage={stage} projects={projects}/>
                ))
            }
        </div>
    </div>
  )
}

export default PipeLine
