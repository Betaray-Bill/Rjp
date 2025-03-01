import React, { Fragment, useEffect, useState } from 'react'
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
import api from '@/utils/api'
import { useQueryClient } from 'react-query'


function ViewResume({data, projects}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [isNew, setIsNew] = useState(false)
    const {trainerDetails} = useSelector(state => state.trainer)
    const [resumeDetails, setResumeDetails] = useState(data[0])  
    const params = useParams()
    // console.log(value)
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    // console.log(resumeDetails)
    const { toast } = useToast()
    // console.log(value)
    useEffect(() => {
        // console.log("Changed to " + value.trainingName)

        // if(value)
        if(value === "Main Resume"){
            // console.log("Main res")
            setResumeDetails(data[0])
        }else{
            // console.log("not Main res")

            let res = data?.filter(element => {
                return element.domain === value
            });
            // console.log(res)
            setResumeDetails(res[0])
        }

        // setResumeDetails()
    }, [value])


    const uploadMainResumeFn = async() => {
        // console.log("upload main resume")
        // setIsNew(true)   

        console.log(1)

        try{
            console.log(2)
            console.log(trainerDetails.mainResume)
            console.log(params.id)
            const sendData = await api.post(`/trainersourcer/uploadMainResume/${params.id}`, trainerDetails.mainResume)
            console.log(sendData)

            toast({
                title: "Resume Uploaded",
                message: "Main Resume Uploaded Successfully",
                type: "success",
            })

            queryClient.invalidateQueries(["getTrainerById", params.id])
        }catch(err){
            console.log(err)
            toast({
                title: "Error",
                message: "Error Uploading the Resume",
                type: "error",
            })
        }
    }
    
    // console.log(params.id)
  return (
    <div className=''>
        <div className='flex items-center justify-between'>

            {
                data && data.length > 0 && 
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
                                        value={framework.domain ? framework.domain : "Main Resume"}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue)
                                            setOpen(false)
                                            // console.log(params)
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
            }


            {
                data && data.length > 0 && 
                <div className='flex items-center justify-between'>
                {
                    value && <Link to={`/home/trainer/resume/${resumeDetails?._id}`} target='_blank' className="bg-white py-2 px-3 flex items-center text-gray-800 border border-black">
                    <ion-icon name="download-outline" style={{fontSize:"18px"}}></ion-icon>
                    <span className='ml-1'>Download</span>
                </Link>
                }

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
            }


        </div>

        
        <div>
            {
                data && data?.length == 0 && 
                <Fragment>
                    <ResumeDetails />
                    <div className='grid grid-place-center mt-7 justify-center'>
                        <Button onClick={ uploadMainResumeFn}>Save </Button>
                    </div>
                </Fragment>
            }
            </div>

       {
        data && data?.length > 0 && 
            <div>
                { 
                    value && resumeDetails ? (
                        !isNew ? <ViewResumeDetails data={resumeDetails && resumeDetails} isNew={isNew}/> : <ViewNewResume  data={data[0]} />
                    ) :
                    (
                        isNew ? <ViewNewResume data={data[0]}/> : null
                    ) 
                    
                }
            </div>
       }
    </div>
  )
}

export default ViewResume
