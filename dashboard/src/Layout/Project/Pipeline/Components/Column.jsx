import React from 'react'

function Column({index, stage}) {
  return (
    <div
        key={index}
        className='w-[300px] h-max bg-blue-100 border-t-4 border-blue-900 rounded-b-md  p-4 flex-shrink-0'
    >
        <h3 className='text-lg font-semibold mb-2'>{stage}</h3>
        <p className='text-sm text-gray-600'>Content for Stage {index + 1}</p>

        {/* Project Card */}
    </div>
  )
}

export default Column
