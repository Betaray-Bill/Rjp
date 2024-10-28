import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
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
import ResumeDetails from '../AddTrainers/Resume/ResumeDetails'
import { useSelector } from 'react-redux'
import ViewResumeDetails from './ViewResumeDetails'



function ViewResume({data}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [isNew, setIsNew] = useState(false)
    // const {trainerDetails} = useSelector(state => state.trainer)
    const [resumeDetails, setResumeDetails] = useState([])  


    useEffect(() => {
        // console.log("Changed to " + value.trainingName)
        let res = data?.filter(element => {
            return element.trainingName === value.trainingName
        });
        // console.log(res)
        setResumeDetails(res)
        // setResumeDetails()
    }, [value.trainingName])
    
    // console.log(resumeDetails)
  return (
    <div className=''>
        <div className='flex items-center justify-between'>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between flex items-center"
                    >
                        <span>{
                            value ?  value.trainingName  : "Select Resume"
                        }</span>
                        <ion-icon style={{fontSize:"18px"}} name="chevron-collapse-outline"></ion-icon>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                        <CommandEmpty>No Resume found.</CommandEmpty>
                        <CommandGroup>
                        {data?.map((framework, index) => (
                            <CommandItem
                                key={index}
                                value={framework.trainingName}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : (framework))
                                    setOpen(false)
                                }}
                            >
                        
                            {framework.trainingName}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <div className='flex items-center justify-between'>
                <Button className="bg-white text-gray-800 border-2 border-black">
                    <ion-icon name="download-outline" style={{fontSize:"18px"}}></ion-icon>
                    <span>Download</span>
                </Button>

                <Button className="ml-4" onClick={() => {setIsNew(true)}}>
                    <ion-icon name="add-outline" style={{fontSize:"18px"}}></ion-icon>
                    <span>New Resume</span>
                </Button>
            </div>


        </div>

        <div>
            
            { value  && <ViewResumeDetails data={value} isNew={isNew}/>}
        </div>
    </div>
  )
}

export default ViewResume
