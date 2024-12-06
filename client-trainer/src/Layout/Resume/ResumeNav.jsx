import React, { Fragment, useEffect, useRef, useState } from 'react'
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
import { setCurrentResumeDetails, setCurrentResumeName, setIsDownload } from '@/features/resumeSlice'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
  

function ResumeNav() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const {currentResumeDetails, currentResumeName,downloadResume, downloadResumeName} = useSelector(state => state.resume)
    const resumeRef = useRef();
    console.log(currentResumeDetails._id)
    
    const [position, setPosition] = useState("Main Resume")
    const {user}  = useSelector(state => state.auth)
    const [resumeName, setResumeName] = useState([])
    const [open, setOpen] = useState(false)


    useEffect(() => {
        if(user !== null || user !== undefined){
            setResumeName([])
            // setResumeName(prev => [...prev, "Main Resume"])
            user.resumeVersion.forEach(element => {
                setResumeName(prevState => [...prevState, element.domain])
            });
        }
    }, [])
    console.log(resumeName)
    // Check for the changes in the version of the Resume
    useEffect(() => {
        // console.log(position)

        if(user !== null || user !== undefined){
            if(position === 'Main Resume'){
                dispatch(setCurrentResumeName("Main Resume"))
                dispatch(setCurrentResumeDetails(user.resumeVersion[0]))
                if(location.pathname !== '/home/resume'){
                    navigate('/home/resume/main')
                }   
            }else{
                let resumeVersionId = user.resumeVersion.find(element => element.domain === position)
                dispatch(setCurrentResumeName(resumeVersionId.domain))
                // console.log(resumeVersionId.domain)
                dispatch(setCurrentResumeDetails(resumeVersionId))
                // console.log(currentResumeDetails)
                navigate(`/home/resume/copy/${resumeVersionId.domain}`)
            }
        }

    }, [position])

        // HandleDownload 
    // check if download is clicked, if yes then check if this component and the clicked are same


    
  return (
    <div className='flex items-center justify-between  bg-white py-6 px-4 rounded-md border' ref={resumeRef} >
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
                                    {resumeName.find((resume) => resume === position) 
                                    ? resumeName.find((resume) => resume === position)
                                    : "Main Resume..."}
                                </span>
                                <ion-icon name="swap-vertical-outline" style={{fontSize:"20px"}} className="ml-2 h-4 w-4 shrink-0 opacity-50"></ion-icon>
                          
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
                                    setPosition(currentValue === position ? "Main Resume" : currentValue)
                                    setOpen(false)
                                }}
                            >
                            {resume ? resume : "Main Resume"}
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
            <div className='px-2' onClick={() => {
                console.log('Downloading ', currentResumeName)
                dispatch(setIsDownload({
                    bool:true, name:currentResumeName
                }))
                console.log(currentResumeName)
                navigate(`/home/resume/download/preview/${currentResumeDetails._id}`)
                
            }}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            {
                                !location.pathname.split('/').includes("preview") ?<ion-icon style={{fontSize:"25px"}} name="eye-outline"></ion-icon> :<ion-icon style={{fontSize:"25px"}} name="download-outline"></ion-icon>
                            }
                            </TooltipTrigger>
                        <TooltipContent>
                            {
                                !location.pathname.split('/').includes("preview") ?<p>Preview and Download</p> :<p>Download</p>
                            }
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {/* {
                location.pathname.split('/')[location.pathname.split('/').length - 1 ] === 'main' ? 
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
                       
                    </Fragment>
                ) : null
            } */}
        </div>
        
    </div>
  )
}

export default ResumeNav
