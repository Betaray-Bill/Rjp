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
        const response = await axios.get(`http://localhost:5000/api/trainer/details/emp/${params.id}`); // Replace with your API endpoint
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
        enabled:true,
        staleTime: 1000 * 60 * 5, // data stays    fresh for 5 minutes
        cacheTime: 1000 * 60 * 10 // cache data for 10 minutes

    });
    console.log(data)

    const submitHandler = async() => {
        try {
            // trainerDetails.id = params.id await
            // axios.put('http://localhost:5000/api/trainer/update', trainerDetails)
            console.log("Trainer updated successfully")
            refetch()
            setIsEdit(false)
        } catch (e) {
            console.error("Error updating trainer", e)
        }
    }

    return (
        <Fragment>
            <div className='mt-10'>
                <h2 className='text-xl mt-10 font-semibold my-4'>
                    Trainer {data && data.generalDetails.name}
                </h2>
            </div>
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
                                    {viewData === "Details" && <ViewGeneralDetails id={data._id} data={data.generalDetails}/>
    }
                                    {viewData === "Training Domains" && <ViewTrainingDomain id={data._id} data={data.trainingDomain}/>
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
