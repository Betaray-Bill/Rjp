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



function ViewResume({resumes}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [resumeDetails, setResumeDetails] = useState([])
    // console.log(resumes)
    useEffect(() => {
        // setResumeNames(
        console.log("values")
        if(value==="Main Resume"){
            setResumeDetails(resumes[resumes.length-1])
        }else{
            console.log("ins")
            let a = resumes.filter((r)=>r.trainingName===value)
            setResumeDetails(a)
        }
    }, [value])
 console.log(resumeDetails)
  return (
    <div className='border-t pt-4'>
        <div className='flex items-center justify-between'>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                    >
                        {
                            value ? (value.trainingName ? value.trainingName : "Main Resume") :"Select Resume"
                        }
                 
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                        <CommandEmpty>No Resume found.</CommandEmpty>
                        <CommandGroup>
                        {resumes?.map((framework, index) => (
                            <CommandItem
                                key={index}
                                value={framework.trainingName ? framework.trainingName : "Main Resume"}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : (framework))
                                    setOpen(false)
                                }}
                            >
                        
                            {framework.trainingName ? framework.trainingName : "Main Resume"}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* <div>
                <Button className="bg-blue-700">
                    <ion-icon name="download-outline" style={{fontSize:"24px"}}></ion-icon>
                    <span>Download</span>
                </Button>
            </div> */}


        </div>

        <div>
            {/* <ResumeDetails /> */}
        </div>
    </div>
  )
}

export default ViewResume
