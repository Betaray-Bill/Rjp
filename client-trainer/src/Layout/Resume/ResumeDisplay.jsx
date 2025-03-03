import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';
import axios from 'axios';
import React, { Fragment, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';

function ResumeDisplay() {
    const params = useParams()
    const [isEdit, setIsEdit] = useState(false)
    console.log(params)
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
    const {toast} = useToast()
    const {user} = useSelector(state => state.auth)

    
  const [resume, setResume] = useState({
    professionalSummary: [],
    technicalSkills: [],
    careerHistory: [],
    certifications: [],
    education: [],
    trainingsDelivered: [],
    clientele: [],
    experience: [],
    trainingName:""
  })

    const fetchResume = async(id) => {
        const response = await api
            .get(`/trainer/resume/${id}`)
      
            setResume(response.data)
            return response.data
    }

    // Query to fetch resume data
    const {data, isLoading, isError, error} = useQuery([
        'resume', params.id
    ], () => fetchResume(params.id), {
        enabled: !!params.id
    });



    
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
    // dispatch(setResumeDetails({name: "mainResume", data: updateResume()}))

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

  const handleAddBetween = (field, index) => {
    console.log("Field is ", field, index)
    console.log(resume[field])
    setResume(prevState => {
        let updatedField = Array.isArray(prevState[field]) ? [...prevState[field]] : [];

        if (updatedField.length === 0) {
            updatedField.push('');
        } else if (index !== null && index >= 0 && index < updatedField.length) {
            updatedField.splice(index + 1, 0, '');
        } else {
            updatedField.push('');
        }

        return { ...prevState, [field]: updatedField };
    });
};

console.log(resume)


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
                      readOnly={resume.isLocked}
                      onChange={(e) => handleChange(e, fieldName, 0)}
                      placeholder={`Type your ${fieldName}`}
                      className=" text-gray-800 text-sm outline-none border-collapse border-none"/>
              </div>
          )
      }
      return Array.isArray(fieldArray) ? 
      fieldArray?.map((value, index) => (
        <Fragment>
        <div className='flex justify-end'>
            <ion-icon
            name="add-outline"
            style={{
            fontSize: "18px"
        }}
            onClick={() => handleAddBetween(fieldName, index)}></ion-icon>
        </div>
        <div
            key={index}
            className='py-2 flex justify-between align-top items-start border    border-gray-200 p-2 my-2 rounded-md'>
            <Textarea
                value={value}
                readOnly={resume.isLocked}
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
        </Fragment>

      )) : 
      <Fragment>
      <div className='flex justify-end'>
          <ion-icon
          name="add-outline"
          style={{
          fontSize: "18px"
      }}
          onClick={() => handleAddBetween(fieldName, index)}></ion-icon>
      </div>
      <div
          className='py-2 flex justify-between align-top items-start border    border-gray-200 px-2 my-2 rounded-md'>
          <Textarea
              value={fieldArray}
              readOnly={resume.isLocked}
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
      </Fragment>

    };


    const submitResumeHandler = async(e) => {
        e.preventDefault()
        // /trainer/updateResume/671f1f348706010ba634eb92/resume/671f1f348706010ba634eb8f
        // console.log(`/trainer/updateResume/671f1f348706010ba634eb92/resume/${data._id}`)
        try{
            console.log("object")
            console.log(resume)
            const r = await api.put(`/trainer/updateResume/${user._id}/resume/${params.id}`, resume)
            const res= await r.data
            console.log(res)
            toast({
                title:"Resume is Updated",
                // description:`$ is Updated`
            })
            queryClient.invalidateQueries(['resume', params.id]);
        }catch(e){
            console.error(e)
            // setError('Failed to submit the resume')
        }

    }




    return (
        <div>
            <div className='flex items-center justify-between px-4 pt-3'>
                <div>
                    {
                        resume.isLocked ? <ion-icon style={{fontSize:"20px"}} name="lock-closed-outline"></ion-icon> : <ion-icon style={{fontSize:"20px"}} name="lock-open-outline"></ion-icon>
                    }
                </div>
                <Button className="rounded-none  bg-blue-800" disabled={resume.isLocked} onClick={submitResumeHandler}>Save</Button>
   
            </div>
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
        </div>
    )
}

export default ResumeDisplay