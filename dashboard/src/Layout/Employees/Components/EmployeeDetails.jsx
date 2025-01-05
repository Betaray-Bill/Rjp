import { Input } from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import React from 'react'

function EmployeeDetails({data}) {
    return (
        <div className='rounded-sm border-gray-300 border p-4'>
            <h2 className='font-semibold text-lg'>General Details</h2>

            <div>
                <div className='grid grid-cols-2 mt-4 place-content-center gap-5'>
                    {/* Emp Details */}
                    <div className='flex flex-col'>
                        <Label className="text-md text-gray-700">Name
                        </Label>
                        <Input className='mt-2 text-black-900 border-gray-400 font-semibold' value={data?.name} ></Input>
                    </div>

                    <div className='flex flex-col'>
                        <Label className="text-md text-gray-700">Email
                        </Label>
                        <Input className='mt-2 text-black-900 border-gray-400 font-semibold' value={data?.email} ></Input>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default EmployeeDetails
