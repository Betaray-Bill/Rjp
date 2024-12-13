import React from 'react'
import Column from './Components/Column';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CardProject from '@/Layout/Project/Pipeline/Components/CardProject';


// Example usage
// console.log(StagesEnum.TRAINING_REQUIREMENT); // Output: "Training Requirement"

function PipeLine() {

    const { currentUser } = useSelector(state => state.auth)
    const fetchProjects = async () => {
        const response = await axios.get(`http://localhost:5000/api/project/projects-employees/${currentUser.employee._id}`)
        console.log(response.data.projects)
        return response.data.projects
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
        <div className='flex space-x-6 w-[max]'>
            {
              projects && projects?.map((e, index) => (
                    <Column 
                      key={index} 
                      index={index} 
                      stage={e.name} 
                      projects={e.projects}
                    />
                ))
            }
        </div>
    </div>
  )
}

export default PipeLine
