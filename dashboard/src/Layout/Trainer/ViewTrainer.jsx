import axios from 'axios'
import React, {Fragment, useEffect, useState} from 'react'
import {useQuery} from 'react-query'
import {useParams} from 'react-router-dom'
import PersonalDetails from './AddTrainers/PersonalDetails'
import BankDetails from './AddTrainers/BankDetails'
import TrainingDomain from './AddTrainers/TrainingDomain'
import ResumeDetails from './AddTrainers/Resume/ResumeDetails'
import {useDispatch, useSelector} from 'react-redux'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from '@/components/ui/button'
import ViewResume from './ViewTrainer/ViewResume'
import ViewGeneralDetails from './ViewTrainer/ViewGeneralDetails'
import ViewTrainingDomain from './ViewTrainer/ViewTrainingDomain'
import { setCurrentTrainerDetails } from '@/features/currentTrainerSlice'
import api from '@/utils/api'

function ViewTrainer() {
    const params = useParams()
    const dispatch = useDispatch()
    const {trainerDetails} = useSelector(state => state.trainer)
    const [isEdit,
        setIsEdit] = useState(false)
    const [viewData,
        setViewData] = useState("Resumes")
    const [isF, setFet] = useState(false)
    // console.log(data)

    const getTrainerById = async() => {
        const token = localStorage.getItem('empToken'); // Get the token from localStorage (or any storage)
console.log("TOke is", token)
        const response = await axios.get(`http://bas.rjpinfotek.com:5000/api/trainer/details/emp/${params.id}`, {
            withCredentials: true, // Ensures cookies are sent with each request
            headers: {
                Authorization: `Bearer ${token}`  // Set the token, if available
            },
        }); // Replace with your API endpoint
        dispatch(setCurrentTrainerDetails(response.data))
        return response.data
    }

    useEffect(() => {
        // getTrainerById(params.id)
    }, [])

    const {data, refetch, isLoading} = useQuery({
        queryKey: [
            "getTrainerById", params.id
        ],
        queryFn: getTrainerById,
        enabled:!!params.id,
        staleTime: 1000 * 60 * 5, // data stays    fresh for 5 minutes
        cacheTime: 1000 * 60 * 10 // cache data for 10 minutes

    });
    // console.log(data)

    const submitHandler = async() => {
        try {
            // trainerDetails.id = params.id await
            // axios.put('http://bas.rjpinfotek.com:5000/api/trainer/update', trainerDetails)
            // console.log("Trainer updated successfully")
            refetch()
            setIsEdit(false)
        } catch (e) {
            // console.error("Error updating trainer", e)
        }
    }

    return (
        <Fragment>
            <div className='mt-10'>
                <h2 className='text-xl mt-10 font-semibold my-4'>
                    Trainer {data && data.generalDetails.name} - {data && data.trainerId}
                </h2>
            </div>
            {/* {
                data && data.resumeVersion.map((e) => (
                    <p>{e.isLocked ? "Locked" : "not locked"}</p>
                ))
            } */}
            <div>
                {(data && !isLoading)
                    ? (
                        <div className=''>
                            <div className='flex justify-between items-center'>
                                <div>
                                    <Select
                                        defaultValue={viewData}
                                        onValueChange={(e) => {
                                        setViewData(e)
                                    }}>
                                        <SelectTrigger className="min-w-[230px]">
                                            <SelectValue placeholder="Select to View..."/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Details">Details</SelectItem>
                                            <SelectItem value="Training Domains">Training Domains</SelectItem>
                                            <SelectItem default value="Resumes">Resumes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                            </div>

                            <div className='mt-5'>
                                <div action="" className='border-t pt-4'>
                                    {viewData === "Details" && <ViewGeneralDetails id={data._id} data={data && data.generalDetails} bank={data && data.bankDetails}/>
    }
                                    {viewData === "Training Domains" && <ViewTrainingDomain trainingType={data && data.trainingDetails.trainerType} id={data._id} data={data && data.trainingDomain}/>
    }
                                    {viewData === "Resumes" && <ViewResume data={data.resumeVersion} projects={data.projects}/>
    }
                                </div>
                            </div>

                        </div>
                    )
                    : (
                        <div className="text-center grid place-content-center w-full">
                            <img
                                src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1263.gif"
                                width={300}
                                alt=""/>
                            <p className='text-slate-700'>Processing your resume...</p>
                        </div>
                    )
                }
            </div>
        </Fragment>
    )
}

export default ViewTrainer
