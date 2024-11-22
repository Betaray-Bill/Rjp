import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import axios from 'axios'
import { useQuery, useQueryClient } from 'react-query'
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
import { useToast } from '@/hooks/use-toast'

function ViewSingleProject() {
  const projectId = useParams()
  const navigate = useNavigate();
  const [collapse, setCollapse] = useState(false)
  const queryClient = useQueryClient();
  const {toast} = useToast()
  const state = {
    ParticipantList: "Participant List",
    Hotel: "Hotel",
    venue: "Venue",
    Travel: "Travel",
    FB_MTM: "FB/MTM",
    All_Reports_Mailed: "All Reports Mailed",
    certificate_Issued: "Certificate Issued",
    Online: "Online",
    InPerson: "In Person",
    Hybrid: "Hybrid",
    FullTime: "Full Time",
    PartTime: "Part Time",
  };
  
  // Training Delivered
  const [formData, setFormData] = useState({
    ParticipantList: false,
    Hotel: false,
    venue: false,
    Travel: false,
    FB_MTM: false,
    All_Reports_Mailed: false,
    certificate_Issued: false,
    Online: false,
    InPerson: false,
    Hybrid: false,
    FullTime: false,
    PartTime: false,
  });

  useEffect(() => {
    if( projects && projects.stages === "Training Delivery"){
      setFormData({
        ParticipantList: projects.trainingDelivery.ParticipantList,
        Hotel: projects.trainingDelivery.Hotel,
        venue: projects.trainingDelivery.venue,
        Travel: projects.trainingDelivery.Travel,
        FB_MTM: projects.trainingDelivery.FB_MTM,
        All_Reports_Mailed: projects.trainingDelivery.All_Reports_Mailed,
        certificate_Issued: projects.trainingDelivery.certificate_Issued,
        Online: projects.trainingDelivery.Online,
        InPerson: projects.trainingDelivery.InPerson,
        Hybrid: projects.trainingDelivery.Hybrid,
        FullTime: projects.trainingDelivery.FullTime,
        PartTime: projects.trainingDelivery.PartTime
      })
    }
  }, [projectId.projectId])


  const handleCheckboxChange = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field] === true ? false : true,
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(object)
      const response = await axios.put(`http://localhost:5000/api/project/updateCheckList/${projectId.projectId}`, formData);
      console.log("Response:", response.data);
      // alert("Form submitted successfully!");
      queryClient.invalidateQueries(['ViewProject', projectId.projectId]);
      toast({
        variant: "success",
          title: "Check List updated"
        })
    } catch (error) {
      console.error("Error submitting form:", error);
      // alert("Failed to submit form.");
    }
  };

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
    setFormData({
      ParticipantList: response.data.project.trainingDelivery.ParticipantList,
      Hotel: response.data.project.trainingDelivery.Hotel,
      venue: response.data.project.trainingDelivery.venue,
      Travel: response.data.project.trainingDelivery.Travel,
      FB_MTM: response.data.project.trainingDelivery.FB_MTM,
      All_Reports_Mailed: response.data.project.trainingDelivery.All_Reports_Mailed,
      certificate_Issued: response.data.project.trainingDelivery.certificate_Issued,
      Online: response.data.project.trainingDelivery.Online,
      InPerson: response.data.project.trainingDelivery.InPerson,
      Hybrid: response.data.project.trainingDelivery.Hybrid,
      FullTime: response.data.project.trainingDelivery.FullTime,
      PartTime: response.data.project.trainingDelivery.PartTime
    })
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
  const {_id, notes, company, stages, contactDetails,amount,employees, trainers,trainingDates, projectName, domain, description, modeOfTraining } = projects;


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
  
      {/* Training Delivery Section - showcase all the conditions */}
      <Fragment>
          {
            stages === "Training Delivery" 
            && 
            <div className='border rounded-md shadow-sm mt-8 py-4 px-4'>
              <h2 className='font-semibold my-4'>Training Delivery - CheckList</h2>
              {
                // JSON.stringify(formData)
              }
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div className='grid grid-cols-3 gap-2'>
                    {Object.keys(formData).map((field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={field}
                          checked={formData[field]}
                          onCheckedChange={() => handleCheckboxChange(field)}
                        />
                        <label htmlFor={field} className="capitalize">
                          {state[field]}
                        </label>
                      </div>
                    ))}
                  </div>

                <Button type="submit" className="mt-4 inline-block">
                  Submit
                </Button>
              </form>
            </div>
          }

      </Fragment>

      <Notes projectName={projectName} projectId={_id} notes={notes}/>
    </div>
  )
}

export default ViewSingleProject
