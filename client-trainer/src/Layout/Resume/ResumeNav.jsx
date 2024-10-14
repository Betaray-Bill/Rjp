import React, { Fragment, useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { setCurrentResumeDetails, setCurrentResumeName } from '@/features/resumeSlice'
  

function ResumeNav() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const {currentResumeDetails, currentResumeName} = useSelector(state => state.resume)

    
    const [position, setPosition] = useState("Main Resume")
    const {user}  = useSelector(state => state.auth)
    const [resumeName, setResumeName] = useState([])
    const [open, setOpen] = useState(false)


    useEffect(() => {
        if(user !== null || user !== undefined){
            setResumeName([])
            setResumeName(prev => [...prev, "Main Resume"])
            user.resumeVersions.forEach(element => {
                setResumeName(prevState => [...prevState, element.trainingName])
            });
        }
    }, [])

    // Check for the changes in the version of the Resume
    useEffect(() => {
        console.log(position)

        if(user !== null || user !== undefined){
            if(position === 'Main Resume'){
                dispatch(setCurrentResumeName("Main Resume"))
                dispatch(setCurrentResumeDetails(user.mainResume))
                if(location.pathname !== '/home/resume'){
                    navigate('/home/resume')
                }   
            }else{
                let resumeVersionId = user.resumeVersions.find(element => element.trainingName === position)
                dispatch(setCurrentResumeName(resumeVersionId.trainingName))
                console.log(resumeVersionId.trainingName)
                dispatch(setCurrentResumeDetails(resumeVersionId))
                // console.log(currentResumeDetails)
                navigate(`/home/resume/copy/${resumeVersionId._id}`)
            }
        }

    }, [position])


    
  return (
    <div className='flex items-center justify-between  bg-white py-6 px-4 rounded-md border'>
        {/* Dropdown for Resume's, Download, copy, Upload */}
        <div>
            <p className="text-sm text-muted-foreground pb-2">Resume Version</p>
            {
                location.pathname.split('/')[location.pathname.split('/').length - 1] !== 'new' ?
                (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-max justify-between"
                            >
                                <span className='mr-2'>
                                    {resumeName !== undefined
                                    ? resumeName.find((resume) => resume === position)
                                    : "Select Resume..."}
                                </span>
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
                                disabled={resume === position ? true : false}
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
                )  : null
            }

        </div>

        {/*Download, Copy, Upload  */}
        <div className='flex items-center justify-between w-max px-2'>
            <div className='px-2'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><ion-icon style={{fontSize:"25px"}} name="download-outline"></ion-icon></TooltipTrigger>
                        <TooltipContent>
                        <p>Download</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {
                location.pathname.split('/')[location.pathname.split('/').length - 1 ] === 'resume' ? 
                (
                    <Fragment>
                        <div className='px-2'>
                            <Button variant="outline" onClick={() => {
                                    dispatch(setCurrentResumeName("new"))
                                    navigate("/home/resume/new")
                                }}
                                className="border border-buttonPrimary text-buttonPrimary"
                            >Make a Copy</Button>
                        </div>
                        <div className='px-2'>
                            <Button variant="outline" className="flex items-center bg-buttonPrimary text-white">
                                <ion-icon name="cloud-upload-outline" style={{fontSize:"18px"}}></ion-icon>
                                <span className='pl-2'>Upload</span>
                            </Button>   
                        </div>
                    </Fragment>
                ) : null
            }
        </div>
    </div>
  )
}

export default ResumeNav
