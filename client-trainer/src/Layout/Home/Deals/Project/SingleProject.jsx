import { Label } from '@/components/ui/label';
import axios from 'axios';
import React from 'react'
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function SingleProject() {
  const params = useParams()
  const {user} = useSelector((state)=> state.auth)

  const fetchProject = async() => {
    const res = await axios.get(`http://localhost:5000/api/project/${params.projectId}/trainer/${user._id}`)
    return res.data.project;
  }

  // http://localhost:5000/api/project/67361ebbecf02b0117e1a99a/trainer/6735cb60346a85087117f784

  const { data, isLoading, isError } = useQuery(
    ["projects", params.projectId], 
    fetchProject,
    {
      enabled: !!params.projectId,
      staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
      cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
    }
  );

  if(isLoading){
    return <div className='w-screen grid place-content-center'>
      <img src="https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif" alt="" />
    </div>
  }

  console.log(data)

    return (
        <div className='grid place-content-center'>
            <div className='w-[80vw] mt-8 p-6 bg-white rounded-md shadow-sm'>
                <div className='flex items-center justify-between pb-3'>
                  <div className='font-semibold text-md flex items-center justify-start'>
                    <ion-icon name="file-tray-stacked-outline" style={{fontSize:"20px", color:"#3e4093"}}></ion-icon>
                    <span className='ml-3'>Training</span>
                  </div>
                  <div className='bg-buttonPrimary text-white p-1  rounded-md px-3'>{data.modeOfTraining}</div>
                </div>
                <hr />  
                <div className='mt-5 grid grid-cols-2 place-content-center gap-5'>
                  {/* Training Details */}
                  <div className='flex items-center'>
                    <Label className="opacity-70">Training Name -</Label>
                    <span className='ml-2 text-black-900 font-semibold'>{data.projectName}</span>
                  </div>
                  <div className='flex items-center'>
                    <Label className="opacity-70">Domain -</Label>
                    <span className='ml-2 text-black-900 font-semibold'>{data.domain}</span>
                  </div>
                  <div className='flex items-center'>
                    <Label className="opacity-70">Company Name -</Label>
                    <span className='ml-2 text-black-900 font-semibold'>{data.company.name}</span>
                  </div>
                  <div className='flex items-center'>
                    <Label className="opacity-70">Training Owner -</Label>
                    <span className='ml-2 text-black-900 font-semibold'>{data.projectOwner.name}</span>
                  </div>
                  <div className='flex items-center'>
                    <Label className="opacity-70">Training Owner Email -</Label>
                    <span className='ml-2 text-black-900 font-semibold'>{data.projectOwner.email}</span>
                  </div>
                  <div className='flex items-center'>
                    <Label className="opacity-70">Training Time -</Label>
                    <span className='ml-2 text-black-900 font-semibold'>{data.projectName.timing}</span>
                  </div>
                  <div className='flex items-center'>
                    <Label className="opacity-70">Start Date -</Label>
                    <span className='ml-2 text-black-900 font-semibold'>{new Date(data.trainingDates.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className='flex items-center'>
                    <Label className="opacity-70">End Date -</Label>
                    <span className='ml-2 text-black-900 font-semibold'>{new Date(data.trainingDates.endDate).toLocaleDateString()}</span>
                  </div>

                </div>
            </div>

            <div className='w-[80vw] mt-8 p-6 bg-white rounded-md shadow-sm'>
              {/* Accepted PO */}
              <div className='font-semibold text-md pb-3 flex items-center justify-start'>
                  <ion-icon name="file-tray-stacked-outline" style={{fontSize:"20px", color:"#3e4093"}}></ion-icon>
                  <span className='ml-3'>Purchase Order</span>
                </div>
            </div>


            <div className='w-[80vw] mt-8 p-6 bg-white rounded-md shadow-sm'>
              {/* Upload Invoice */}
              <div className='font-semibold text-md pb-3 flex items-center justify-start'>
                  <ion-icon name="newspaper-outline" style={{fontSize:"20px", color:"#3e4093"}}></ion-icon>
                  <span className='ml-3'>Invoice</span>
                </div>
            </div>
        </div>
    )
}

export default SingleProject
