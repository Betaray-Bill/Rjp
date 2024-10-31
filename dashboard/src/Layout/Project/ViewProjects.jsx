import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

function ViewProjects() {
  return (
    <div>
      <div className='flex justify-between'>
            <div></div>
            <Link to="/home/projects/create">
                <Button className="rounded-none bg-blue-700">Create Project</Button>
            </Link>
        </div>
    </div>
  )
}

export default ViewProjects
