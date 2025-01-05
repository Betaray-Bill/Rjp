import React, { useEffect, useRef, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setResumeDetails } from '@/features/trainerSlice'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from 'react-query'
import api from '@/utils/api'


function ResumeForm({data}) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEdit, setIsEdit] = useState(true)
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const {user}  = useSelector   (state => state.auth)
    const queryClient =useQueryClient()
  const {toast} = useToast()

  const [resume, setResume] = useState({
    professionalSummary: [],
    technicalSkills: [],
    careerHistory: [],
    certifications: [],
    education: [],
    trainingsDelivered: [],
    clientele: [],
    experience: [],
    domain:"",
    trainingName:""
  })
  
  useEffect(() => {
    // checkConnection();
    if(user.resumeVersion.length>0){
        setResume(user.resumeVersion[0])
    }
  }, []);
  
  const [connectionStatus, setConnectionStatus] = useState("");
  const [modelStatus, setModelStatus] = useState("");
  // const [isModelLoaded, setIsModelLoaded] = useState(false);

  const checkConnection = async () => {
    try {
      const response = await api.get("/resumeextractor/check-connection");
      setConnectionStatus(response.data.message);
      setModelStatus(response.data.modelStatus);
    } catch (error) {
      setConnectionStatus("Failed to connect to Azure");
      setError(error.response ? error.response.data : error.message);
    }
  };

//   console.log(resume)

  console.log(resume)

  useEffect(() => {
    if(data){
      setResume(data)
      setExtractedData(data)
      setIsEdit(false)
    }
  }, [])

  const dispatch = useDispatch()

  // UPloading the Resume and Extracting the Resume
  const fileInputRef = useRef(null);

  // Function to handle the button click and trigger the file input click
  const handleButtonClick = (e) => {
    e.preventDefault()
    console.log("1")
    fileInputRef.current.click();
    console.log("2")
  };

  // Function to handle file upload
  const handleFileChange = async(event) => {
    const file = event.target.files[0];
    console.log("INSIDE the file: " + file)
    if (file) {
      // Handle the uploaded file here
      console.log('File uploaded:', file.name);
      setIsLoading(true);

      setFile(event.target.files[0]);
      setError(null);
      setExtractedData(null);

      await uploadToAzure(file)
      fileInputRef.current  = null
    }
  };

  // Function to upload the resume to Azure and extract the data
  const uploadToAzure = async(file) => {
    const formData = new FormData();
    formData.append("resume", file);
    setIsUploading(true)
    try {
        checkConnection()
      const response = await api.post("/resumeextractor/upload ", formData);
      setExtractedData(response.data);
      console.log(response.data)
      const newResume = {
        professionalSummary: Array.isArray(response.data.fields.professionalSummary) ?  response.data.fields.professionalSummary : [],
        technicalSkills: Array.isArray(response.data.fields.technicalSkills) ?  response.data.fields.technicalSkills : [],
        careerHistory: Array.isArray(response.data.fields.careerHistory) ?  response.data.fields.careerHistory : [],
        certifications: Array.isArray(response.data.fields.certifications) ?  response.data.fields.certifications : [],
        education: Array.isArray(response.data.fields.education) ?  response.data.fields.education : [],
        trainingsDelivered: Array.isArray(response.data.fields.trainingsDelivered) ?  response.data.fields.trainingsDelivered : [],
        clientele: Array.isArray(response.data.fields.clientele) ?  response.data.fields.clientele : [],
        experience: Array.isArray(response.data.fields.experience) ?  response.data.fields.experience : [],
      };
      dispatch(setResumeDetails({name: "mainResume", data: newResume}))
      setResume(newResume)
    } catch (error) {
      console.error("Error extracting resume data:", error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
      setIsUploading(false)
    }
  }

  // -----------------------Render the Resume Details Sections -------------------------------
  
  const handleChange = (e, field, index) => {
    const value = e.target.value;
    console.log(resume)
    let updateResume = () => {
      if(Array.isArray(resume[field])) {
        const updatedArray = [...resume[field]];
        updatedArray[index] = value;

        return {
            ...resume,
            [field]: updatedArray
        };
      }else{
        return {
           ...resume,
            [field]: value
        };
    }
  }

  console.log("Resume Details ", updateResume())
  setResume((prevState) => {
        // Update array fields based on the index
        if (Array.isArray(prevState[field])) {
            const updatedArray = [...prevState[field]];
            updatedArray[index] = value;

            return {
                ...prevState,
                [field]: updatedArray
            };
        }

        // For non-array fields
        return {
            ...prevState,
            [field]: value
        };
    });

    console.log("Resume is ", resume)
    dispatch(setResumeDetails({name: "mainResume", data: updateResume()}))

  };

  // Handler to add a new empty textarea for a specific field
  const handleAdd = (field) => {
          setResume((prevState) => {
            console.log(prevState)
              return {
                  ...prevState,
                  [field]: [
                      ...prevState[field],
                      ''
                  ], // Add empty string to the field array
              };
          });
  };

  // Handler to delete an item from a specific field
  const handleDelete = (field, index) => {
          setResume((prevState) => {
              const updatedArray = prevState[field].filter((_, i) => i !== index);
              return {
                  ...prevState,
                  [field]: updatedArray
              };
          });
  };

  // Function to render textareas for array fields
  const renderTextareas = (fieldArray, fieldName) => {
      if (fieldArray?.length === 0) {
          return (
              <div
                  key={0}
                  className='py-2 flex justify-between align-top items-start border border-gray-200 px-2 my-2 rounded-md'>
                  <Textarea
                      value=""
                      // readOnly={isEdit}
                      onChange={(e) => handleChange(e, fieldName, 0)}
                      placeholder={`Type your ${fieldName}`}
                      className=" text-gray-800 text-sm outline-none border-collapse border-none"/>
              </div>
          )
      }
      return Array.isArray(fieldArray) ? 
      fieldArray?.map((value, index) => (
        <div
            key={index}
            className='py-2 flex justify-between align-top items-start border    border-gray-200 p-2 my-2 rounded-md'>
            <Textarea
                value={value}
                // readOnly={isEdit}
                onChange={(e) => handleChange(e, fieldName, index)}
                placeholder={`Type your ${fieldName}`}
                className="text-gray-800 text-sm outline-none border-collapse border-none"/>
            <ion-icon
                name="trash-outline"
                style={{
                color: "rgba(246, 43, 43, 0.644)",
                fontSize: "18px",
                cursor: "pointer"
            }}
                onClick={() => handleDelete(fieldName, index)}></ion-icon>
        </div>
      )) : <div
          className='py-2 flex justify-between align-top items-start border    border-gray-200 px-2 my-2 rounded-md'>
          <Textarea
              value={fieldArray}
              // readOnly={isEdit}
              onChange={(e) => handleChange(e, fieldName, index)}
              placeholder={`Type your ${fieldName}`}
              className="text-gray-800 text-sm outline-none border-collapse border-none h-max"/>
          <ion-icon
              name="trash-outline"
              style={{
              color: "rgba(246, 43, 43, 0.644)",
              fontSize: "18px",
              cursor: "pointer"
          }}
              onClick={() => handleDelete(fieldName, index)}></ion-icon>
      </div>
    };




        // Handle Submitting the Copy resume
        const [isSubmit,
            setIsSubmit] = useState(false)
        axios.defaults.withCredentials = true;
        const submitHandler = async(e) => {
            e.preventDefault();
            setIsSubmit(prev => !prev)
    
            console.log('Form Data Submitted:', resume);
            // Perform API call to save form data
            try {
                const response = await api.post(`/trainer/main-resume/${user._id}`, resume); // Replace with your API endpoint
                console.log('Registration successful:', response.data);
                // getTrainerDetails()
                // setIsSubmit(prev => !prev)
                setResume({
                    professionalSummary: [''],
                    technicalSkills: [''],
                    careerHistory: [''],
                    certifications: [''],
                    education: [''],
                    trainingsDelivered: [''],
                    clientele: [''],
                    experience: [''],
                    file_url: '',
                    trainingName: ''
                })
                toast({
                    duration: 3000, variant: "success", title: "Submitted successfully",
                    // description: "Click edit to take action",
                })
                // getTrainerDetails()
                    // window.location.reload()
                //   navigate("/home/resume") 
                  queryClient.invalidateQueries(["user", user._id])
                  //   navigate(`/home/resume/${response.data.resume._id}`) 
                  //   setUser(response.data)
                  window.location.reload()
              
                //   setUser(response.data)
            } catch (error) {
                console.error('Registration failed:', error);
            }
            setIsSubmit(prev => !prev)

        };


        const submitCopyHandler = async(e) => {
          e.preventDefault();
          setIsSubmit(prev => !prev)
  
          console.log('Form Data Submitted:', resume);
          // Perform API call to save form data
          try {
              const response = await api.post(`/trainer/${user._id}/copy-resume`, {...resume, domain:domainName}); // Replace with your API endpoint
              console.log('Registration successful:', response.data);
              // getTrainerDetails()
              // setIsSubmit(prev => !prev)
              setResume({
                  professionalSummary: [''],
                  technicalSkills: [''],
                  careerHistory: [''],
                  certifications: [''],
                  education: [''],
                  trainingsDelivered: [''],
                  clientele: [''],
                  experience: [''],
                  file_url: '',
                  trainingName: ''
              })
              toast({
                  duration: 3000, variant: "success", title: "Submitted successfully",
                  // description: "Click edit to take action",
              })
              // getTrainerDetails()
                  // window.location.reload()
              //   navigate("/home/resume") 
                queryClient.invalidateQueries(["user", user._id])
                //   navigate(`/home/resume/${response.data.resume._id}`) 
                //   setUser(response.data)
                // window.location.reload()
            
              //   setUser(response.data)
          } catch (error) {
              console.error('Registration failed:', error);
          }
          setIsSubmit(prev => !prev)

      };


        const [domainName, setDomainName] = useState("")
        const sortDataByDomain = () => {
          console.log(domainName)
          // Helper function to sort a single array based on the domain
          const sortArray = (array, domainName) => {
              if (Array.isArray(array)) {
                  return [...array].sort((a, b) => { // Use spread to create a new array
                      let aContainsDomain = a.toLowerCase().includes(domainName.toLowerCase());
                      let bContainsDomain = b.toLowerCase().includes(domainName.toLowerCase());
                      return bContainsDomain - aContainsDomain; // Sort items with domain first
                  });
              }
              return array;
          };
      
          // Create a deep clone of the `resume` object to avoid direct mutations
          let data = JSON.parse(JSON.stringify(resume)); // Deep clone
      
          // Iterate over each key in the data object and sort if it's an array
          for (let key in data) {
              if (Array.isArray(data[key]) && data[key].length > 0 && key !== "projects") {
                  data[key] = sortArray(data[key], domainName); // Sort and reassign the cloned array
              }
          }
      
          setResume(data); // Update the state with the sorted data
          // return data;
          console.log(data)
      };


  return ( 
      <div className='w-[80vw] grid place-content-center'>
        <div className='flex items-center justify-between  p-4'>
          <h2 className='text-slate-700 text-lg py-4 font-semibold'>Resume Details</h2>

          <div className="w-full max-w-sm items-center gap-1.5 hidden">
            <Input  ref={fileInputRef} id="resume" type="file" onChange={handleFileChange} accept=".pdf,.docx" />
          </div>
          <div className='flex items-center justify-between'>
            {
              isUploading ? 
              <img src="https://media.lordicon.com/icons/wired/outline/2-cloud-upload.gif" 
                className='w-[30px] mx-5'
                alt="" 
              /> : null
            }
            {
              user.resumeVersion.length == 0 && 
              <Button onClick={handleButtonClick} disabled={isLoading}>
              {isLoading ? "Processing..." : "Upload Resume"}
            </Button>
            }
          </div>
        </div>
        
            {user.resumeVersion.length > 0 && 
                      <div className='p-4'>
                      <div>Domain Name</div>
                      <div className='flex items-center '>
                        <Input value={domainName} onChange={(e) => setDomainName(e.target.value)} placeholder='Type your domain name' />
                        <Button className="rounded-none ml-4" onClick={sortDataByDomain}>Filter</Button>
                      </div>
                    </div>
            }
        {
          isLoading ? 
          <div className="text-center grid place-content-center w-full">
            <img src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1263.gif" width={300} alt="" />
            <p className='text-slate-700'>Processing your resume...</p>
          </div>
          :
          <div className='grid grid-cols-1 p-3 items-start w-[80vw]'>
                <div className='mt-4 rounded-sm p-2'>
                    <h3 className='font-semibold flex justify-between items-center'>
                        <span>Professional Summary:</span>
                        <ion-icon
                            name="add-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            onClick={() => handleAdd('professionalSummary')}></ion-icon>
                    </h3>
                    {renderTextareas(resume.professionalSummary, 'professionalSummary')}
                </div>

                {/* Experience */}
                <div className='mt-4 p-3'>
                    <h3 className='font-semibold flex justify-between items-center'>
                        <span>Experience:</span>
                        <ion-icon
                            name="add-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            onClick={() => handleAdd('experience')}></ion-icon>
                    </h3>
                    {renderTextareas(resume.experience, 'experience')}
                </div>

                {/* Technical Skills */}
                <div className='mt-4 p-3'>
                    <h3 className='font-semibold flex justify-between items-center'>
                        <span>Technical Skills:</span>
                        <ion-icon
                            name="add-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            onClick={() => handleAdd('technicalSkills')}></ion-icon>
                    </h3>
                    {renderTextareas(resume.technicalSkills, 'technicalSkills')}
                </div>

                 {/* Education */}
                <div className='mt-4 p-3'>
                    <h3 className='font-semibold flex justify-between items-center'>
                        <span>Education:</span>
                        <ion-icon
                            name="add-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            onClick={() => handleAdd('education')}></ion-icon>
                    </h3>
                    {renderTextareas(resume.education, 'education')}
                </div>

                {/* Career History */}
                <div className='mt-4 p-3'>
                    <h3 className='font-semibold flex justify-between items-center'>
                        <span>Career History:</span>
                        <ion-icon
                            name="add-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            onClick={() => handleAdd('careerHistory')}></ion-icon>
                    </h3>
                    {renderTextareas(resume.careerHistory, 'careerHistory')}
                </div>

                {/* Certifications */}
                <div className='mt-4 p-3'>
                    <h3 className='font-semibold flex justify-between items-center'>
                        <span>Certifications:</span>
                        <ion-icon
                            name="add-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            onClick={() => handleAdd('certifications')}></ion-icon>
                    </h3>
                    {renderTextareas(resume.certifications, 'certifications')}
                </div>

                {/* Trainings Delivered */}
                <div className='mt-4 p-3'>
                    <h3 className='font-semibold flex justify-between items-center'>
                        <span>Training Delivered:</span>
                        <ion-icon
                            name="add-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            onClick={() => handleAdd('trainingsDelivered')}></ion-icon>
                    </h3>
                    {renderTextareas(resume.trainingsDelivered, 'trainingsDelivered')}
                </div>

                {/* Clientele */}
                <div className='mt-4 p-3'>
                    <h3 className='font-semibold flex justify-between items-center'>
                        <span>Clientele:</span>
                        <ion-icon
                            name="add-outline"
                            style={{
                            fontSize: "18px"
                        }}
                            onClick={() => handleAdd('clientele')}></ion-icon>
                    </h3>
                    {renderTextareas(resume.clientele, 'clientele')}
                </div>

    

          </div>

        }
            <div className='grid place-content-center my-10'>
              {
                user.resumeVersion.length === 0 ?
                <Button className="rounded-none" onClick={submitHandler} disabled={isSubmit}>{isSubmit? "Submitting" : "Submit"}</Button>:
                <Button className="rounded-none" onClick={submitCopyHandler} disabled={isSubmit}>{isSubmit ? "Submitting" : "Submit"}</Button>
              }
            </div>
        
      </div>
  )
}

export default ResumeForm