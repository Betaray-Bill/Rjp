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
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { setCurrentResumeDetails, setCurrentResumeName, setIsDownload } from '@/features/resumeSlice'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
  

function ResumeNav() {
    const navigate = useNavigate()
    const params = useParams()
    const location = useLocation()
    const dispatch = useDispatch()
    const {currentResumeDetails, currentResumeName,downloadResume, downloadResumeName} = useSelector(state => state.resume)
    const resumeRef = useRef();
    // console.log(currentResumeDetails._id)
    
    // const [position, setPosition] = useState(user && user.resumeVersion[0]?._id
    const {user}  = useSelector(state => state.auth)
    const [resumeName, setResumeName] = useState([])
    const [open, setOpen] = useState(false)

    const [position, setPosition] = useState(user && user.resumeVersion[0]?._id)

    useEffect(() => {
        if(user !== null || user !== undefined){
            setResumeName([])
            // setResumeName(prev => [...prev, "Main Resume"])
            user.resumeVersion.forEach(element => {
                setResumeName(prevState => [...prevState, element])
            });
        }
        navigate('/home/resume/' + position);

    }, [])
    console.log(resumeName)
    // Check for the changes in the version of the Resume
    useEffect(() => {
        // console.log(position)

        // if(user !== null || user !== undefined){
        //     if(position === 'Main Resume'){
        //         dispatch(setCurrentResumeName("Main Resume"))
        //         dispatch(setCurrentResumeDetails(user.resumeVersion[0]))
        //         if(location.pathname !== '/home/resume'){
        //             navigate('/home/resume/main')
        //         }   
        //     }else{
        //         let resumeVersionId = user.resumeVersion.find(element => element.domain === position)
        //         dispatch(setCurrentResumeName(resumeVersionId.domain))
        //         // console.log(resumeVersionId.domain)
        //         dispatch(setCurrentResumeDetails(resumeVersionId))
        //         // console.log(currentResumeDetails)
        //         navigate(`/home/resume/copy/${resumeVersionId.domain}`)
        //     }
        // }

    }, [position])

        // HandleDownload 
    // check if download is clicked, if yes then check if this component and the clicked are same

    console.log(position)
    console.log(resumeName)
  return (
    <div className='flex items-center justify-between  bg-white py-6 px-4 rounded-md border' ref={resumeRef} >
     
        <Fragment>
            {/* Dropdown for Resume's, Download, copy, Upload */}
            <div>
                <p className="text-sm text-muted-foreground pb-2">Resume Version</p>
                {
                    location.pathname.split('/')[location.pathname.split('/').length - 1] !== 'new' ?
                    (
                       
                        <select 
                            className='px-3 py-2 rounded-sm border border-gray-200 text-md font-medium' 
                            onChange={(e) => {
                                const selectedResume = JSON.parse(e.target.value); // Parse the selected option's value
                                console.log(selectedResume);
                                setPosition(selectedResume.isMainResume ? resumeName[0]._id : selectedResume._id);
                                // Uncomment and adjust the following lines as needed:
                                dispatch(setCurrentResumeName(selectedResume._id));
                                dispatch(setCurrentResumeDetails(user.resumeVersion.find(element => element.domain === selectedResume.domain)));
                                // if (location.pathname !== '/home/resume') {
                                    navigate('/home/resume/' + selectedResume._id);
                                // }
                            }}
                        >
                            <option value="" disabled>Select Resume</option>
                            {
                                resumeName.map((resume, _i) => (
                                    <option key={_i} value={JSON.stringify(resume)}>
                                        {resume.isMainResume ? "Main Resume" : resume.domain}
                                    </option>
                                ))
                            }
                        </select>

                    )  : null
                }
 
            </div>

            {/*Download, Copy, Upload  */}
            <div className='flex items-center justify-between w-max px-2'>
                <a target='_blank' className='px-2' onClick={() => {
                    console.log('Downloading ', currentResumeName)
                    dispatch(setIsDownload({
                        bool:true, name:currentResumeName
                    }))
                    console.log(currentResumeName)
                    navigate(`/home/resume/download/preview/${position}`)
                    
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
                </a>
                {
                    params.id === user.resumeVersion[0]._id ? 
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
                }
            </div>
        </Fragment>
    </div>
  )
}

export default ResumeNav
