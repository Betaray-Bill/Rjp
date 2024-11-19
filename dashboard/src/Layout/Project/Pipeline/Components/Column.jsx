import CardProject from '@/Layout/Project/Pipeline/Components/CardProject'
import React from 'react'
import {Link} from 'react-router-dom'

function Column({index, stage, projects}) {
    console.log(projects, stage)
    return (
        <div>
            <div
                className='w-[350px] h-max bg-blue-100 border-t-4 border-blue-900 rounded-b-md  p-4 flex-shrink-0'>
                <p className='text-lg font-semibold mb-2'>{stage}</p>
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
