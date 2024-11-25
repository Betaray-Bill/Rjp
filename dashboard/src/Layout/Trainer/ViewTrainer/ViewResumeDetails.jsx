import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { setResumeDetails } from '@/features/trainerSlice';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react'
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

function ViewResumeDetails({data, isNew}) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isEdit, setIsEdit] = useState(true)
    const [extractedData, setExtractedData] = useState(null);
    const [error, setError] = useState(null);
    const params = useParams()
    const [resume, setResume] = useState()
    const {toast} = useToast()
    const queryClient = useQueryClient();

    const [isLock, setIsLock]  = useState(false)
    const {trainerDetails} = useSelector(state  => state.currentTrainer)
    console.log(resume)
    useEffect(() => {
        // if()
        // console.log("data.isLocked ", data.isLocked)
          setIsLock(data.isLocked)
    }, [])
    useEffect(() => {
      if(data && !isNew){
        console.log(data[0])
        setResume({
            professionalSummary: data ? data.professionalSummary : [],
            technicalSkills: data ? data.technicalSkills : [],
            careerHistory: data ? data.careerHistory : [],
            certifications: data ? data.certifications : [],
            education: data ? data.education : [],
            trainingsDelivered: data ? data.trainingsDelivered : [],
            clientele: data ? data.clientele : [],
            experience: data ? data.experience : [],
          })
        //   console.log(data)
          setIsLock(data.isLocked)
        // setExtractedData(data)
        // setIsEdit(false)
      }

      if(isNew){
        // New Resume is getting created    
      }
    }, [data?.domain])
  
    const dispatch = useDispatch()


  
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
    console.log(params)
  
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
                        // readOnly={isLock}
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
                //   readOnly={isLock}
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
                // readOnly={isLock}
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
            await axios.put(`http://localhost:5000/api/trainersourcer/updateResume/${params.id}/resume/${data._id}`, resume)
            toast({
                title:"Resume is Updated",
                // description:`$ is Updated`
            })
            queryClient.invalidateQueries(['getTrainerById', params.id]);
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

        try{
            console.log(`http://localhost:5000/api/project/add-resume/${projectId}/trainer/${trainerDetails._id}/resume`)
            await axios.put(`http://localhost:5000/api/project/add-resume/${projectId}/trainer/${trainerDetails._id}/resume`, {resumeId:data._id})
            toast({
                title:"Resume is Added",
                // description:`${data.project} is Updated`
            })
            queryClient.invalidateQueries(['getTrainerById', params.id]);
            
        }catch(e){
            console.error(e)
            setError('Failed to add project to resume')
        }
    }
    
    // console.log(resume?.projects)
    // console.log(data?.isLocked)
    const changeIsLock = async(e) => {
        // setIsLock(!isLock)
        // console.log(isLock)
        if(data.isLocked){
            setIsLock(false)

            // console.log("unlock it")
            await axios.put(`http://localhost:5000/api/trainersourcer/updateLockStatus/${data._id}`, {isLock: false})
            
            // queryClient.invalidateQueries(['getTrainerById', params.id]);
        }else{
            // console.log("lock it")
            setIsLock(true)
            await axios.put(`http://localhost:5000/api/trainersourcer/updateLockStatus/${data._id}`, {isLock: true})
           
            // queryClient.invalidateQueries(['getTrainerById', params.id]);
        }

        queryClient.invalidateQueries(['getTrainerById', params.id]);
        // setIsLock(data.isLocked)
        // window.location.reload();
// 
    }
    console.log(data.isLocked)
    return ( 
        <div>

          {/* Display the section for adding the resume to the project */}
        <div className='flex items-center justify-between mt-5'>
            <div className='flex items-start flex-col'>
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
                                            <option key={project._id} value={project._id}>{project.projectName}</option>
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

                <div className='my-5 flex items-center '>
                    {
                        data && data?.projects?.map((e, _i) => (
                            <p className='font-medium border rounded-full px-3 mx-1' key={_i}>{e.projectName}</p>
                        ))
                    }
                </div>
            </div>

            <div onClick={() => changeIsLock()} className='hover:cursor-pointer'>

                {
                    data.isLocked ?  
                    <ion-icon style={{fontSize:"20px"}} name="lock-closed-outline"></ion-icon>
                    :
                    <ion-icon style={{fontSize:"20px"}} name="lock-open-outline"></ion-icon>
                }
                
            </div>
        </div>
        <form onSubmit={submitResumeHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 items-start ">
                <div className="mt-4 rounded-sm p-2">
                <h3 className="font-semibold flex justify-between items-center">
                    <span>Professional Summary:</span>
                    <ion-icon
                    name="add-outline"
                    style={{
                        fontSize: "18px",
                    }}
                    onClick={() => handleAdd("professionalSummary")}
                    ></ion-icon>
                </h3>
                {renderTextareas(resume?.professionalSummary, "professionalSummary")}
                </div>

                {/* Technical Skills */}
                <div className="mt-4 p-3">
                <h3 className="font-semibold flex justify-between items-center">
                    <span>Technical Skills:</span>
                    <ion-icon
                    name="add-outline"
                    style={{
                        fontSize: "18px",
                    }}
                    onClick={() => handleAdd("technicalSkills")}
                    ></ion-icon>
                </h3>
                {renderTextareas(resume?.technicalSkills, "technicalSkills")}
                </div>

                {/* Career History */}
                <div className="mt-4 p-3">
                <h3 className="font-semibold flex justify-between items-center">
                    <span>Career History:</span>
                    <ion-icon
                    name="add-outline"
                    style={{
                        fontSize: "18px",
                    }}
                    onClick={() => handleAdd("careerHistory")}
                    ></ion-icon>
                </h3>
                {renderTextareas(resume?.careerHistory, "careerHistory")}
                </div>

                {/* Certifications */}
                <div className="mt-4 p-3">
                <h3 className="font-semibold flex justify-between items-center">
                    <span>Certifications:</span>
                    <ion-icon
                    name="add-outline"
                    style={{
                        fontSize: "18px",
                    }}
                    onClick={() => handleAdd("certifications")}
                    ></ion-icon>
                </h3>
                {renderTextareas(resume?.certifications, "certifications")}
                </div>

                {/* Education */}
                <div className="mt-4 p-3">
                <h3 className="font-semibold flex justify-between items-center">
                    <span>Education:</span>
                    <ion-icon
                    name="add-outline"
                    style={{
                        fontSize: "18px",
                    }}
                    onClick={() => handleAdd("education")}
                    ></ion-icon>
                </h3>
                {renderTextareas(resume?.education, "education")}
                </div>

                {/* Trainings Delivered */}
                <div className="mt-4 p-3">
                <h3 className="font-semibold flex justify-between items-center">
                    <span>Training Delivered:</span>
                    <ion-icon
                    name="add-outline"
                    style={{
                        fontSize: "18px",
                    }}
                    onClick={() => handleAdd("trainingsDelivered")}
                    ></ion-icon>
                </h3>
                {renderTextareas(resume?.trainingsDelivered, "trainingsDelivered")}
                </div>

                {/* Clientele */}
                <div className="mt-4 p-3">
                <h3 className="font-semibold flex justify-between items-center">
                    <span>Clientele:</span>
                    <ion-icon
                    name="add-outline"
                    style={{
                        fontSize: "18px",
                    }}
                    onClick={() => handleAdd("clientele")}
                    ></ion-icon>
                </h3>
                {renderTextareas(resume?.clientele, "clientele")}
                </div>

                {/* Experience */}
                <div className="mt-4 p-3">
                <h3 className="font-semibold flex justify-between items-center">
                    <span>Experience:</span>
                    <ion-icon
                    name="add-outline"
                    style={{
                        fontSize: "18px",
                    }}
                    onClick={() => handleAdd("experience")}
                    ></ion-icon>
                </h3>
                {renderTextareas(resume?.experience, "experience")}
                </div>
            </div>
            <div className="justify-center flex mt-8">
                <Button type="submit">Submit</Button>
            </div>
        </form>;
        </div>
    )
  }
  

export default ViewResumeDetails
