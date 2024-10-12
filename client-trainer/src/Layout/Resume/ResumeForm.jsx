import React, { Fragment, useEffect, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentResumeDetails } from '@/features/resumeSlice';
import { Input } from "@/components/ui/input"

function ResumeForm({type}) {

    const {currentResumeDetails, currentResumeName} = useSelector(state => state.resume)
    const dispatch = useDispatch()

    const [currentResume, setCurrentResume] = useState({
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
    console.log(currentResumeDetails)
    useEffect(() => {
      setCurrentResume({...currentResumeDetails})
      console.log(currentResumeDetails)
    }, [currentResumeName])
    
    const handleChange = (e, field, index) => {
        const value = e.target.value;

        setCurrentResume((prevState) => {
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
    };

    // Handler to add a new empty textarea for a specific field
    const handleAdd = (field) => {
        setCurrentResume((prevState) => {
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
        setCurrentResume((prevState) => {
            const updatedArray = prevState[field].filter((_, i) => i !== index);
            return {
                ...prevState,
                [field]: updatedArray
            };
        });
    };

    // Function to render textareas for array fields
    const renderTextareas = (fieldArray, fieldName) => {
        return fieldArray.map((value, index) => (
            <div
                key={index}
                className='py-2 flex align-top items-start border border-gray-200 p-2 my-2 rounded-md'>
                <Textarea
                    value={value}
                    onChange={(e) => handleChange(e, fieldName, index)}
                    placeholder={`Type your ${fieldName}`}
                    className="w-[30vw] text-gray-800 text-sm outline-none border-collapse border-none"/>
                <ion-icon
                    name="trash-outline"
                    style={{
                    color: "rgba(246, 43, 43, 0.644)",
                    fontSize: "18px",
                    cursor: "pointer"
                }}
                    onClick={() => handleDelete(fieldName, index)}></ion-icon>
            </div>
        ));
    };

    return (
      <Fragment>
        {
            currentResumeName !== 'Main Resume' ? 
              <div className='mx-auto ml-16 mt-4'>
                <label htmlFor="">Training Name</label>
                <Input placeholder="Training Name" value={currentResumeDetails.trainingName} readOnly />
              </div> : <div className='mx-auto ml-16 mt-4 font-semibold text-gray-800'>Main Resume</div>
        }
        <form className='grid grid-cols-2 items-start'>
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
                {renderTextareas(currentResume.professionalSummary, 'professionalSummary')}
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
                {renderTextareas(currentResume.technicalSkills, 'technicalSkills')}
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
                {renderTextareas(currentResume.careerHistory, 'careerHistory')}
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
                {renderTextareas(currentResume.certifications, 'certifications')}
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
                {renderTextareas(currentResume.education, 'education')}
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
                {renderTextareas(currentResume.trainingsDelivered, 'trainingsDelivered')}
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
                {renderTextareas(currentResume.clientele, 'clientele')}
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
                {renderTextareas(currentResume.experience, 'experience')}
            </div>

        </form>
      </Fragment>
    )
}

export default ResumeForm
