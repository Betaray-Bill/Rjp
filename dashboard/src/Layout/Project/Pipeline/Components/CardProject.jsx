import React from 'react'

function CardProjects({projects}) {
    console.log(projects)
    return (
        <div
            className='border border-gray-200 w-[350px] rounded-sm p-4 py-3 my-5 cursor-pointer bg-white'>
            <div className='flex items-center justify-between'>
                <h4 className='font-semibold '>{projects.projectName}</h4>
                <span className='rounded-md px-2 bg-blue-100'>{projects.company.name}</span>
            </div>
            <div className='flex   justify-start mt-4'>
                <span className='font-light text-gray-800'>
                    Training :
                </span>
                <span className='font-normal ml-1'> {projects.domain}</span>
            </div>
            <div className='flex items-start  justify-start mt-2'>
                <span className='font-light'>
                    Owner :
                </span>
                <span className='font-medium'>{projects.projectOwner.name}</span>
            </div>
            <div className='flex items-center justify-start mt-2'>
                <ion-icon name="calendar-outline" style={{fontSize:"20px"}}></ion-icon>
                <div className='ml-3 flex items-center justify-between font-light'>
                    <span>{new Date(projects.trainingDates
                            ?.startDate).toISOString().split('T')[0]}</span>
                    <span className='mx-3'>-</span>
                    <span>{new Date(projects.trainingDates
                            ?.endDate).toISOString().split('T')[0]}</span>
                </div>
            </div>

        </div>
    )
}

export default CardProjects
