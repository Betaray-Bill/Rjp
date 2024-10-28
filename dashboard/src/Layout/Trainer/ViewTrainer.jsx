import axios from 'axios'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import PersonalDetails from './AddTrainers/PersonalDetails'
import BankDetails from './AddTrainers/BankDetails'
import TrainingDomain from './AddTrainers/TrainingDomain'
import ResumeDetails from './AddTrainers/Resume/ResumeDetails'
import { useSelector } from 'react-redux'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import ViewResume from './ViewTrainer/ViewResume'

function ViewTrainer() {
  const params = useParams()
  const {trainerDetails} = useSelector(state => state.trainer)
  const [isEdit, setIsEdit] = useState(false)
  const [viewData, setViewData] = useState("Resumes")
  // console.log(data) 

  const getTrainerById = async() => {
    const response = await axios.get(`http://localhost:5000/api/trainer/details/${params.id}`); // Replace with your API endpoint
    return response.data
  }

  const {data, refetch,isLoading} = useQuery({
      queryKey:["getTrainerById", params.id], 
      queryFn:getTrainerById,
  });
  console.log(data) 

  const submitHandler = async () => {
    try{
      // trainerDetails.id = params.id
      // await axios.put('http://localhost:5000/api/trainer/update', trainerDetails)
      console.log("Trainer updated successfully")
      refetch()
      setIsEdit(false)
    }catch(e){
      console.error("Error updating trainer", e)
    }
  }

  return (
    <div>
      {
        (data && !isLoading) ? 
        (
          <div className=''>
            <div className='flex justify-between items-center'>
              <div>
                <Select defaultValue={viewData} onValueChange={(e) => {setViewData(e)}}>
                  <SelectTrigger className="min-w-[230px]">
                    <SelectValue placeholder="Select to View..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Details">Details</SelectItem>
                    <SelectItem value="Training Domains">Training Domains</SelectItem>
                    <SelectItem default value="Resumes">Resumes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='font-semibold text-lg'>
                {/* Trainer {data.generalDetails?.name} */}
                {
                  !isEdit ? 
                  (
                    <Button onClick={() => setIsEdit(true)} className="flex items-center">
                      <ion-icon name="pencil-outline"></ion-icon> Edit
                    </Button>
                  ): 
                  (
                    <Button onClick={submitHandler}>
                       Submit
                    </Button>
                  )
                }
              </div>
            </div>

            <div className='mt-5'>
              <form action="" className='border-t pt-4'>
                { 
                  viewData === "Details" && 
                  <PersonalDetails data={data.generalDetails}/>
                }
                 {
                  viewData === "Training Domains" && 
                  <TrainingDomain data={data.trainingDomain}/>
                }
                 {
                  viewData === "Resumes" && 
                  <ViewResume data={data.resumeVersion}/>
                }
              </form>
            </div>
            
          </div>
        )
        : (
          <div className="text-center grid place-content-center w-full">
            <img src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1263.gif" width={300} alt="" />
            <p className='text-slate-700'>Processing your resume...</p>
          </div>
        )
      }
    </div>
  )
}

export default ViewTrainer
