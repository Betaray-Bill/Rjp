import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { setResumeDetails } from '@/features/trainerSlice';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function ViewNewResume({data, projects}) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isEdit, setIsEdit] = useState(true)
    const [extractedData, setExtractedData] = useState(null);
    const [error, setError] = useState(null);
    const [resume, setResume] = useState()
    const {toast} = useToast()
    const params = useParams()
    // console.log(resume)
    useEffect(() => {
        if(data){
          setResume({
              professionalSummary: data ? data.professionalSummary : [],
              technicalSkills: data ? data.technicalSkills : [],
              careerHistory: data ? data.careerHistory : [],
              certifications: data ? data.certifications : [],
              education: data ? data.education : [],
              trainingsDelivered: data ? data.trainingsDelivered : [],
              clientele: data ? data.clientele : [],
              experience: data ? data.experience : [],
              projects: data ? data.projects : [],
            })
          // setExtractedData(data)
          // setIsEdit(false)
        }
  
      }, [])
    
  
    const dispatch = useDispatch()

    console.log("Clicked on New Resume")

    // const handleTrainingNameChange = (e) => {
    //     // setResume({...resume, trainingName:e.target.value})
    //     console.log(e)
    //     let trainingDetails = {}
    //     for(let i=0; i<projects.length; i++){
    //         if(projects[i]._id === e){
    //             console.log(projects[i])
    //             trainingDetails._id = projects[i]._id
    //             trainingDetails.name = projects[i].projectName
    //             break;
    //         }
    //     }

    //     setResume({...resume, projects:trainingDetails})
    // }

  
    // -----------------------Render the Resume Details Sections -------------------------------
    
    const handleChange = (e, field, index) => {
      const value = e.target.value;
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
  
    // console.log("Resume Details ", updateResume())
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
  
    //   console.log("Resume is ", resume)
      dispatch(setResumeDetails({name: "mainResume", data: updateResume()}))
  
    };
  
    // Handler to add a new empty textarea for a specific field
    const handleAdd = (field) => {
            setResume((prevState) => {
            //   console.log(prevState)
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

    const submitResumeHandler = async(e) => {
        e.preventDefault()
        // http://localhost:5000/api/trainer/updateResume/671f1f348706010ba634eb92/resume/671f1f348706010ba634eb8f
        // console.log(`http://localhost:5000/api/trainer/updateResume/671f1f348706010ba634eb92/resume/${data._id}`)
        try{
            console.log("object")
            console.log(resume)
            await axios.post(`http://localhost:5000/api/trainersourcer/${params.id}/copy-resume`, resume)
            console.log(`http://localhost:5000/api/trainersourcer/${params.id}/copy-resume`)
            // navigate
            toast({
                title:"New Resume Is Created",
                description: "New Resume Has Been Created Successfully",
                status: "success",
                duration: 5000
            })
        
        }catch(e){
            console.error(e)
            setError('Failed to submit the resume')
        }

    }
     // Select Project to the Resume
     const addProjectToResume = async(projectId) => {
        console.log(projectId)
        if(projectId == ""){
            alert("Please select a project")
            return
        }

        // console.log(e)
        let trainingDetails = {}


        setResume({...resume, projects:projectId})

        // try{
        //     console.log(`http://localhost:5000/api/project/add-resume/${projectId}/trainer/${trainerDetails._id}/resume`)
        //     await axios.put(`http://localhost:5000/api/project/add-resume/${projectId}/trainer/${trainerDetails._id}/resume`, {resumeId:data._id})
        //     toast({
        //         title:"Resume is Added",
        //         description:`${data.trainingName} is Updated`
        //     })
        
        // }catch(e){
        //     console.error(e)
        //     setError('Failed to add project to resume')
        // }
    }
    const {trainerDetails} = useSelector(state  => state.currentTrainer)

    console.log(resume)
  
    return ( 
        <div className='mt-8'> 

          
         <form onSubmit={submitResumeHandler}>
            {/* <div>
                <Label>Training Name</Label>

                <select 
                    className='ml-4'  
                    onChange={(e) => handleTrainingNameChange(e.target.value)}
                >
                    <option value="Select Training">Select Training</option>
                    {
                        projects && projects?.map((e, _i) => (
                            <option key={_i} value={e._id}>{e.projectName}</option>
                        ))
                    }
                </select>
            </div> */}

            <div>
                {
                    trainerDetails.projects.length > 0 ? 
                    (
                        <div className='flex items-center'>
                            <select name="" id="" onChange={(e) => {
                                addProjectToResume(e.target.value)
                            }}>
                                <option value="">Add to a Project</option>
                                {
                                    trainerDetails?.projects?.map(project => (
                                        <option value={project._id}>{project.projectName}</option>
                                    ))
                                }
                            </select>
                        </div>
                    ) : (
                        <div className='flex items-center'>
                            <p className='text-sm text-gray-500'>No projects assigned yet.</p>
                        </div>
                    )
                }
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 items-start '>
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
                      {renderTextareas(resume?.professionalSummary, 'professionalSummary')}
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
                      {renderTextareas(resume?.technicalSkills, 'technicalSkills')}
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
                      {renderTextareas(resume?.careerHistory, 'careerHistory')}
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
                      {renderTextareas(resume?.certifications, 'certifications')}
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
                      {renderTextareas(resume?.education, 'education')}
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
                      {renderTextareas(resume?.trainingsDelivered, 'trainingsDelivered')}
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
                      {renderTextareas(resume?.clientele, 'clientele')}
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
                      {renderTextareas(resume?.experience, 'experience')}
                  </div>
  
            </div>
            <div className='justify-center flex mt-8'>
            <Button type="submit">Submit</Button>
            </div>
         </form>

        </div>
    )
  }
  

export default ViewNewResume
