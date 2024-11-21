import React, { Fragment, useRef, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
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

  // Training Delivered
  const [formData, setFormData] = useState({
    FaxList: "No",
    Hotel: "No",
    venue: "No",
    Travel_On_Return: "No",
    FB_MTM: "No",
    All_Reports_Mailed: "No",
    certificate_Issued: "No",
    venue: "No",
    Online_Inperson: "No"
  });


  const handleCheckboxChange = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field] === "Yes" ? "No" : "Yes",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://api.example.com/submit", formData);
      console.log("Response:", response.data);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form.");
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

      {/* Training Delivery Section - showcase all the conditions */}
      <Fragment>
          {
            stages === "Training Delivery" 
            && 
            <div className='border rounded-md shadow-sm mt-8 py-4 px-4'>
              <h2 className='font-semibold my-4'>Training Delivered - CheckList</h2>
              {
                // JSON.stringify(formData)
              }
              <form onSubmit={handleSubmit} className="space-y-4">
                {Object.keys(formData).map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={formData[field] === "Yes"}
                      onCheckedChange={() => handleCheckboxChange(field)}
                    />
                    <label htmlFor={field} className="capitalize">
                      {field.replace(/_/g, " ")}
                    </label>
                  </div>
                ))}

                <Button type="submit" className="mt-4">
                  Submit
                </Button>
              </form>
            </div>
          }

      </Fragment>

      {/* Employees */}
      {/* <ViewEmployee employees={employees}/>  */}
      <Notes projectName={projectName} projectId={_id} notes={notes}/>
    </div>
  )
}

export default ViewSingleProject
