import React, { useRef, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import axios from 'axios'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '@/utils/Loading'
import SearchResult from '@/Layout/Search/SearchResult'
import SearchBar from './SearchTrainers/SearchBar'
import ViewTrainers from './ViewTrainers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function ViewSingleProject() {
  const projectId = useParams()
  const navigate = useNavigate();
  const [collapse, setCollapse] = useState(false)

  // Scroll to a Section
  const sectionRef = useRef(null);
  const [isAdd, setIsAdd] = useState(false)
  const scrollToSection = () => {
    setIsAdd(true)
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [100])
    
  };

  const { currentUser } = useSelector(state => state.auth)
  const fetchProjects = async () => {
    const response = await axios.get(`http://localhost:5000/api/project/get-project/${projectId.projectId}`)
    console.log(response.data)
    return response.data.project
  }
//  console.log(projectId.projectId)
  const { data: projects, isLoading, error } = useQuery(
    ['ViewProject', projectId.projectId], 
    
    fetchProjects,
    {
      enabled: !!projectId.projectId,
      staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
      cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
    }
  )

  if (isLoading) return <div><Loading /></div>
  if (error) return <div>Error: {error.message}</div>
  console.log(projects)
  const {_id,  company, contactDetails,amount, trainers,trainingDates, projectName, domain, description, modeOfTraining } = projects;

  return (
    <div className=''>
      <button onClick={() => navigate(-1)} className='flex items-center mt-[-10] mb-4'>
        <ion-icon name="arrow-back-outline"></ion-icon>
        <span className='ml-2'>Go Back</span>
      </button>
      {/* PRoject Data */}
      <div className='border rounded-md shadow-md py-4 px-4'>
        <div className="grid grid-cols-3 gap-8 place-content-between">
          <div className='flex flex-col justify-between'>
            <h2 className="text-left text-gray-700 mb-[3px]">Project Name</h2>
            <Input type="text" className="text-gray-900 font-medium" readOnly value={projectName} />
          </div>
          <div className='flex flex-col justify-between'>
            <h2 className="text-left text-gray-700 mb-[3px]">Domain</h2>
            <Input type="text" className="text-gray-900 font-medium" readOnly value={domain} />
          </div>
          <div className='flex flex-col justify-between'>
            <h2 className="text-left text-gray-700 mb-[3px]">Company</h2>
            <Input type="text" className="text-gray-900 font-medium" readOnly value={company.name} />
          </div>
          <div className='flex flex-col justify-between'>
            <h2 className="text-left text-gray-700 mb-[3px]">Mode of Training</h2>
            <Input type="text" className="text-gray-900 font-medium" readOnly value={modeOfTraining} />
          </div>
          <div className='flex flex-col justify-between'>
            <h2 className="text-left text-gray-700 mb-[3px]">Amount</h2>
            <Input type="number" className="text-gray-900 font-medium" value={amount} />
          </div>
          <div className='flex flex-col justify-between'>
            <h2 className="text-left text-gray-700 mb-[3px]">Training Dates</h2>
            <Input type="date" className="text-gray-900 font-medium" readOnly value={new Date(trainingDates.startDate).toISOString().split('T')[0]} />
          </div>
        </div>
      </div>

      {/* Company Contact Person - default Hidden */}

      {/* Trainer Section - Search Bar [FIlters, Search Result, seach Result with add function to add them in the projects] */}

      {/* Show the Trainers Added to the  */}

      <div className='border rounded-md mt-8 py-4 px-3 shadow-sm'>
        <div className='flex items-center justify-between'>
          <div className='font-semibold'>Trainers</div>
          <Button onClick={scrollToSection}>Add Trainer</Button>
        </div>
        <div>
          {/* Search Bar */}
          <ViewTrainers trainers={trainers}/>
          {/* <SearchBar domainSearch={domain}/> */}

          {/* <div ref={sectionRef}></div> */}
          {
            isAdd &&(
              <div className='mt-10 border-t pt-5' ref={sectionRef}>
                <div className='text-right'>
                  <ion-icon 
                    onClick={() => setIsAdd(false)}
                    name="close-outline" 
                    style={{fontSize:"22px", cursor:"pointer", borderRadius:"50%", border:"1px solid black"}} ></ion-icon>
                </div>
                <SearchBar domain={domain} id={_id}/>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default ViewSingleProject