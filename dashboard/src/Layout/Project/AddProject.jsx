import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

function AddProject() {
  return (
    <div className=''>
        <div className='border-b-[1px] pb-5'>
            <h2 className='font-semibold text-lg'>Create Project</h2>
        </div>

        <div className='mt-8'>
            {/* Project details form */}
            <form>
                <div>
                    <div>
                        <h2 className='font-semibold'>Project Information</h2>
                    </div>
                    <div className='grid grid-cols-2 gap-8 mt-8 w-[80vw] '>
                        <div className='flex items-center justify-center'>
                            <Label className="font-normal mr-4">Project Name</Label>
                            <Input type="text"/>
                        </div>
                        <div className='flex items-center justify-center'>
                            <Label className="font-normal mr-4">Project Name</Label>
                            <Input type="text"/>
                        </div>
                        <div className='flex items-center justify-center'>
                            <Label className="font-normal mr-4">Project Name</Label>
                            <Input type="text"/>
                        </div>
                        <div className='flex items-center justify-center'>
                            <Label className="font-normal mr-4">Project Name</Label>
                            <Input type="text"/>
                        </div>
                        <div className='flex items-center justify-center'>
                            <Label className="font-normal mr-4">Project Name</Label>
                            <Input type="text"/>
                        </div>
                        <div className='flex items-center justify-center'>
                            <Label className="font-normal mr-4">Project Name</Label>
                            <Input type="text"/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddProject
