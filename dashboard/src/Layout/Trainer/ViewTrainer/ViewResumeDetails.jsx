import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { setResumeDetails } from '@/features/trainerSlice';
import React, { useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';

function ViewResumeDetails({data, isNew}) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isEdit, setIsEdit] = useState(true)
    const [extractedData, setExtractedData] = useState(null);
    const [error, setError] = useState(null);
    console.log(data[0])
    const [resume, setResume] = useState()
    
    // console.log(resume)
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
        // setExtractedData(data)
        // setIsEdit(false)
      }
    }, [data.trainingName])
  
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
  
  
    return ( 
        <div>
          <div className='flex items-center justify-between mt-8'>
            {/* <h2 className='text-slate-700 text-lg py-4 font-semibold'>Resume Details</h2> */}
  
            {/* <div className="w-full max-w-sm items-center gap-1.5 hidden">
              <Input ref={fileInputRef} id="resume" type="file" onChange={handleFileChange} accept=".pdf,.docx" />
            </div> */}
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
        </div>
    )
  }
  

export default ViewResumeDetails
