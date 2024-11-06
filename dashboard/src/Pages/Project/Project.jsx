import { Button } from '@/components/ui/button'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'

function Project() {
  return (
    <div className='w-[80vw] h-max min-h-[80vh] px-3 '>
      <Outlet />
    </div>
  )
}

export default Project
