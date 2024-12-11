import React from 'react'

function CardProjects({projects}) {
    console.log(projects)
    return (
        <div
            className='border border-gray-200 w-[350px] rounded-sm p-4 py-3 my-5 cursor-pointer bg-white'>

            <div className='flex items-start justify-between'>
                <h4 className='font-semibold text-sm'>{projects.projectName}</h4>
                <div className='grid place-content-end'>
                    <span className='rounded-md px-2 bg-blue-100 text-sm'>{projects.company.name}</span>
                </div>
            </div>
            <div className='flex   justify-start mt-4 flex-wrap'>
                <span className='font-light text-gray-800 text-sm'>
                    Training :
                </span>
                <span className='font-semibold ml-1 text-sm'>
                    {projects.domain}</span>
            </div>
            <div className='flex items-start  justify-start mt-2'>
                <span className='font-light text-sm'>
                    Owner :
                </span>
                <span className='font-medium ml-2 text-sm'>{projects.projectOwner.name}</span>
            </div>
            <div className='flex items-center justify-start mt-2'>
                <ion-icon
                    name="calendar-outline"
                    style={{
                    fontSize: "18px"
                }}></ion-icon>
                <div className='ml-3 flex items-center justify-between font-light'>
                    <span className='text-sm'>{new Date(projects.trainingDates
                                ?.startDate)
                            .toISOString()
                            .split('T')[0]}</span>
                    <span className='mx-3'>-</span>
                    <span className='text-sm'>{new Date(projects.trainingDates
                                ?.endDate)
                            .toISOString()
                            .split('T')[0]}</span>
                </div>
            </div>

        </div>
    )
}

export default CardProjects
