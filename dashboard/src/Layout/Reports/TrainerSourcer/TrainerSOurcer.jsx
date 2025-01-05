import React, { useState } from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { useNavigate } from 'react-router-dom'
import TrainerSourced from './Component/TrainerSourced'
import TrainerDeployed from './Component/TrainerDeployed'

function TrainerSOurcer() {
        const navigate = useNavigate()
        const [selectType, setSelectType] = useState("")
  return (
    <div className=''>
            <div>
                <button onClick={() => navigate(-1)} className='flex items-center mt-2 mb-4'>
                    <ion-icon name="arrow-back-outline"></ion-icon>
                    <span className='ml-2'>Go Back</span>
                </button>
            </div>
            <div className='flex items-center justify-between'>
                <div className='font-semibold text-lg'>
                    Trainer Sourcer
                </div>
                <div>
                    <Select onValueChange={(e) => setSelectType(e)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Reports"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Trainer Sourced">Trainer Sourced</SelectItem>
                            <SelectItem value="Success Percentage">Success Percentage</SelectItem>
                            <SelectItem value="Trainers Deployed">Trainers Deployed</SelectItem> 
                        </SelectContent>
                    </Select>

                </div>
            </div>

            {
                selectType === "Trainer Sourced" && <TrainerSourced />
            }

            {
                selectType === "Success Percentage" && <TrainerSourced />
            }

            {
                selectType === "Trainers Deployed" && <TrainerDeployed />             }

        </div>
  )
}

export default TrainerSOurcer