import React from 'react'

function CardProjects({projects}) {
    console.log(projects)
    return (
        <div
            className='border w-[350px] rounded-sm p-2 my-3 cursor-pointer'>
            <div className='flex items-center justify-between'>
                <h4 className='font-semibold underline'>{projects.projectName}</h4>
                <span className='border border-black rounded-md px-2 bg-blue-200'>{projects.company.name}</span>
            </div>
            <div className='flex items-start  justify-start mt-4'>
                <span>
                    Training :
                </span>
                <span className='font-medium text-gray-600'>{projects.domain}</span>
            </div>
            <div className='flex items-start  justify-start mt-4'>
                <span>
                    Owner :
                </span>
                <span className='font-medium text-gray-600'>{projects.projectOwner}</span>
            </div>
            <div className='flex items-center justify-start mt-2'>
                <ion-icon name="calendar-outline"></ion-icon>
                <div className='ml-3 flex items-center justify-between'>
                    <span>{new Date(projects.trainingDates
                            ?.startDate).toDateString()}</span>
                    {/* <span className='mx-3'>-</span> */}
                    {/* <span>{new Date(projects.trainingDates
                            ?.endDate).toDateString()}</span> */}
                </div>
            </div>

        </div>
    )
}

export default CardProjects
