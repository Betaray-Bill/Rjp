import React from 'react'

function DealCard({deal}) {
  return (
    <div 
        className='border rounded-md p-4 m-2  hover:shadow-md transition-shadow transition-ease-in-out cursor-pointer'
    >
        <div className='flex items-center justify-between'>
        <h4 className='font-semibold underline'>{deal.projectName}</h4>
        <span className='border border-black rounded-md px-2 bg-blue-200'>{deal.modeOfTraining}</span>
        </div>
        <div  className='flex items-center justify-start mt-4'>
        <span>
            Training : 
        </span>
        <span className='font-semibold ml-3'>{deal.domain}</span>
        </div>
        <div className='flex items-center justify-start mt-2'>
        <ion-icon name="calendar-outline"></ion-icon>
        <div className='ml-3 flex items-center justify-between'>
            <span>{new Date(deal.trainingDates?.startDate).toDateString()}</span>
            <span className='mx-3'>-</span>
            <span>{new Date(deal.trainingDates?.endDate).toDateString()}</span>
        </div>
        </div>
    {/* <div className='flex items-center'>
      <span>
        View
      </span>
      <ion-icon name="unlink-outline"></ion-icon>
    </div> */}
  </div>
  )
}

export default DealCard
