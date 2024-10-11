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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

  
   
import { Button } from '@/components/ui/button'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

function Resume() {
    const [position, setPosition] = useState("Main Resume")
    const {user}  = useSelector(state => state.auth)
    const [resumeName, setResumeName] = useState([])
    const [open, setOpen] = useState(false)
    
    const [currentResume, setCurrentResume] = useState({
        professionalSummary: [''],
        technicalSkills: [''],
        careerHistory: [''],
        certifications: [''],
        education: [''],
        trainingsDelivered: [''],
        clientele: [''],
        experience: [''],
        file_url: '',
        trainingName:''
    })

    useEffect(() => {
        if(user !== null || user !== undefined){
            console.log("meow")
            setResumeName([])
            setResumeName(prev => [...prev, "Main Resume"])
            user.resumeVersions.forEach(element => {
                setResumeName(prevState => [...prevState, element.trainingName])
            });
        }
    }, [])

    useEffect(() => {
        console.log(position)

        if(user !== null || user !== undefined){

        }

    }, [position])


  return (
    <div className='w-full h-screen p-4'>
        {/* Resume Nav */}
        <div className='flex items-center justify-between'>
            {/* Dropdown for Resume's, Download, copy, Upload */}
            <div>
                <p className="text-sm text-muted-foreground pb-1">Resume Version</p>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                        {resumeName !== undefined
                            ? resumeName.find((resume) => resume === position)
                            : "Select Resume..."}
                            <ion-icon name="swap-vertical-outline" style={{fontSize:"20px"}} className="ml-2 h-4 w-4 shrink-0 opacity-50"></ion-icon>
                        {/* <CaretSortIcon   /> */}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-max p-0">
                        <Command>
                        <CommandInput placeholder="Search Resume..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No resume found.</CommandEmpty>
                            <CommandGroup>
                            {resumeName.map((resume, _i) => (
                                <CommandItem
                                    key={_i}
                                    value={resume}
                                    onSelect={(currentValue) => {
                                        setPosition(currentValue === position ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                {resume}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

            </div>

            {/*Download, Copy, Upload  */}
            <div className='flex items-center justify-between w-max px-2'>
                <div className='px-2'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><ion-icon style={{fontSize:"20px"}} name="download-outline"></ion-icon></TooltipTrigger>
                            <TooltipContent>
                            <p>Download</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className='px-2'>
                    <Button variant="outline">Make a Copy</Button>
                </div>
                <div className='px-2'>
                    <Button variant="outline" className="flex items-center bg-black text-white">
                        <ion-icon name="cloud-upload-outline" style={{fontSize:"18px"}}></ion-icon>
                        <span className='pl-2'>Upload</span>
                    </Button>   
                </div>
            </div>
        </div>
        {
            user && JSON.stringify(user.resumeVersions[0])
        }
        <Outlet />

    </div>
  )
}

export default Resume
