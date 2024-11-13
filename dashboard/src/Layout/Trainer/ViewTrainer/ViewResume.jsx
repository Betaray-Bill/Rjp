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
import ViewNewResume from './ViewNewResume'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useToast } from "@/hooks/use-toast"


function ViewResume({data, projects}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [isNew, setIsNew] = useState(false)
    // const {trainerDetails} = useSelector(state => state.trainer)
    const [resumeDetails, setResumeDetails] = useState([])  
    const params = useParams()
    console.log(data)
    const navigate = useNavigate()
    console.log(projects)
    const { toast } = useToast()
    console.log(value)
    useEffect(() => {
        // console.log("Changed to " + value.trainingName)
        let res = projects?.filter(element => {
            return element.domain === value.projects
        });
        // console.log(res)
        setResumeDetails(res)
        // setResumeDetails()
    }, [])
    
    console.log(params.id)
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
                            value ? value : "Search Resume"
                            //  value ?  value.trainingName.name ? value.trainingName.name : value.trainingName  : "Select Resume"
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
                                    value={framework.domain ? framework.domain : framework.domain}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : framework.domain)
                                        setOpen(false)
                                        console.log(params)
                                        // navigate(`/home/trainer/view/${params.id}/resume/${framework}`)
                                    }}
                                >
                            
                                {framework.domain ? framework.domain : "Main Resume"}
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

                {
                    !isNew ?
                    <Button className="ml-4" onClick={() => setIsNew(true)}>
                        <span className="flex items-center" onClick={() => { 
                            setIsNew(true)
                            // navigate(`/home/trainer/view/${params.id}/add`);
                         }}>
                            <ion-icon name="add-outline" style={{fontSize:"18px"}}></ion-icon>
                            <span>New Resume</span>
                        </span>
                    </Button> : null
                }
            </div>


        </div>

        <div>
            
            { 
                value? (
                    !isNew ? <ViewResumeDetails data={data[0]} isNew={isNew}/> : <ViewNewResume  data={data[0]} />
                ) :
                (
                    isNew ? <ViewNewResume data={data[0]}/> : null
                ) 
                
            }
        </div>
    </div>
  )
}

export default ViewResume
