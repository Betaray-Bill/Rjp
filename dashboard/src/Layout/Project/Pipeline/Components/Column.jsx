import CardProject from '@/Layout/Project/Pipeline/Components/CardProject'
import React from 'react'
import {Link} from 'react-router-dom'

function Column({index, stage, projects}) {
    return (
        <div>
            <div
                className='w-[350px] h-max bg-blue-100 border-t-4 border-blue-900 rounded-b-md  p-4 flex-shrink-0'>
                <h3 className='text-lg font-semibold mb-2'>{stage}</h3>
                <p className='text-sm text-gray-600'>Content for Stage {index + 1}</p>
            </div>

            {/* Project Card */}
            {projects && projects
                ?.map((project) => (
                    <Link to={`/home/projects/view/${project._id}`} key={project._id} >
                        <CardProject projects={project}/>
                    </Link>
                ))
            }
        </div>
    )
}

export default Column
