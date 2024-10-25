import axios from 'axios'
import React from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import PersonalDetails from './AddTrainers/PersonalDetails'
import BankDetails from './AddTrainers/BankDetails'
import TrainingDomain from './AddTrainers/TrainingDomain'
import ResumeDetails from './AddTrainers/Resume/ResumeDetails'

function ViewTrainer() {
  const params = useParams()

  console.log(params) 

  const getTrainerById = async() => {
    const response = await axios.get(`http://localhost:5000/api/trainer/details/${params.id}`); // Replace with your API endpoint
    return response.data
  }

  const {data, refetch,isLoading} = useQuery({
      queryKey:["getTrainerById", params.id], 
      queryFn:getTrainerById,
  });

  return (
    <div>
      {
        (data && !isLoading) ? 
        (
          <div className=''>
            <form action="">
              <PersonalDetails data={data.generalDetails}/>
              <BankDetails />
              <TrainingDomain data={data.trainingDomain}/>
              <ResumeDetails />
            </form>
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
