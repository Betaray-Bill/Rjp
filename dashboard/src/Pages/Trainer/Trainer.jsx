import React from 'react'
import { Outlet } from 'react-router-dom'

function Trainer() {
  return (
    <div className=''>
        <div className='mt-10'>
            <h2 className='text-xl font-semibold my-4'>Trainer</h2>
        </div>
      <Outlet />
    </div>
  )
}

export default Trainer
