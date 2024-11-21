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
import SearchBar from './Components/SearchTrainers/SearchBar'
import ViewTrainers from './Components/ViewTrainers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ViewEmployee from './Components/ViewEmployee'
import ViewCompanyContact from './Components/ViewCompanyContact'
import ViewProjectData from './Components/ViewProjectData'
import Notes from './Components/Notes'

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
  const {_id, notes, company, contactDetails,amount,employees, trainers,trainingDates, projectName, domain, description, modeOfTraining } = projects;


  const fileUpload = async(e) => {
    console.log(e)
    // const upload = axios.post("http://localhost:5000/api/filestorage/upload-to-blob", {folderName:`${projectName}`})
    const upload = await axios.get("http://localhost:5000/api/filestorage/check-blob-connection")
    console.log(upload)
    const res = upload.data
    console.log(res)
  }

  return (
    <div className=''>
      <div className='flex items-center justify-between mb-3'>
        {/* <input type="file" name="" multiple={false} id="" onChange={(e) => fileUpload(e.target.files[0])}/> */}
        <button onClick={() => navigate(-1)} className='flex items-center mt-[-10] mb-4'>
          <ion-icon name="arrow-back-outline"></ion-icon>
          <span className='ml-2'>Go Back</span>
        </button>
        <div>
          <Button className="rounded-none">Edit</Button>
        </div>
      </div>
      {/* PRoject Data */}
      <ViewProjectData projects={projects}/>

      {/* Company Contact Person - default Hidden */}
      <ViewCompanyContact data={company} contact={contactDetails}/>  

      {/* Trainer Section - Search Bar [FIlters, Search Result, seach Result with add function to add them in the projects] */}

      {/* Show the Trainers Added to the  */}

      <div className='border rounded-md mt-8 py-4 px-3 shadow-sm'>
        <div className='flex items-center justify-between'>
          <div className='font-semibold'>Trainers</div>
          <Button onClick={scrollToSection} className='flex items-center bg-blue-950 rounded-none'>
            <ion-icon name="search-outline" style={{fontSize:"20px"}}></ion-icon>
            <span>Search Trainer</span>
          </Button>
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

      {/* Employees */}
      {/* <ViewEmployee employees={employees}/>  */}
      <Notes projectName={projectName} projectId={_id} notes={notes}/>
    </div>
  )
}

export default ViewSingleProject
