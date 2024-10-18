import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui//button'

import { domains, trainingModesEnum, trainingTypes } from '@/utils/constants'
  

function TrainingDetails() {
    const [type, setType ] = useState("Internal")
    const [mode, setMode ] = useState("Internal")

    // Domain Search States
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const [list, setList] = useState([])


    const handleSearchTerm = (e) => {
        console.log(e)
        if(e){
            if(list.includes(e)){
                alert("Already Added")
            }else{
                console.log("1")
                if(list.length == 0){
                    setList([e])
                }else{
                    setList([...list, e])
                }
                console.log("2")

            }
        }
        
    }
    

  return (
    <div className='ml-5'>
      <h2 className='text-slate-700  text-lg py-4 font-semibold'>Training Details</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-3 mt-3 '>
        {/* Training courses, institution, duration, mode of training */}
        <div className='flex flex-col'>
            <Label htmlFor="trainerType" className="mb-2">Type of Trainer</Label>
            <select name="trainerType" id="" onChange={(e) => setType(e.target.value)}>
                <option value="Select the Type" disabled={true}>Select the Type</option>
                {
                    trainingTypes.map((mode, index) => (
                        <option key={index} value={mode}>{mode}</option>
                    ))
                }
            </select>
        </div>

        {
            type && type.split(" ")[0] === "External" ? (
                <div className='flex flex-col'>
                    <Label htmlFor="trainingMode" className="mb-2">Mode of Training</Label>
                    <select name="trainingMode" id="">
                        <option value="Select the Type" defaultValue={true}>Select the Mode</option>
                        {
                            trainingModesEnum.map((mode, index) => (
                                <option key={index} value={mode}>{mode}</option>
                            ))
                        }
                    </select>
                </div> 
            ): <div></div>
        }

        <div></div>
      </div>

    </div>
  )
}

export default TrainingDetails
