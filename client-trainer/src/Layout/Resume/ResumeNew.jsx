import {useEffect, useState} from 'react'
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {useDispatch, useSelector} from 'react-redux'
import {setCopyResumeDetails, setCurrentResumeName} from '@/features/resumeSlice'
import {Button} from '@/components/ui/button'
import axios from 'axios'
import { setCredentials } from '@/features/authSlice'
import { useNavigate } from 'react-router-dom'

function ResumeNew() {
    const {currentResumeDetails, currentResumeName} = useSelector(state => state.resume)
    const {user} = useSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [currentResume,
        setCurrentResume] = useState({
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

    function isObjectEmpty(obj) {
        return Object.values(obj).every(value => {
            if (Array.isArray(value)) {
                return value.length === 0 || (value.length === 1 && value[0] === '');
            }
            return value === '';
        });
    }

    useEffect(() => {
        if(isObjectEmpty(currentResume)){
            setCurrentResume({
                ...currentResumeDetails
            })
        }

        console.log(currentResumeDetails)
    }, [])

    const handleNewResumeName = (e) => {
        dispatch(setCurrentResumeName(e.target.value))
        setCurrentResume({...currentResume, trainingName:e.target.value})
        console.log(currentResumeName)
    }

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

    useEffect(() => {
        dispatch(setCopyResumeDetails(currentResume))
    }, [currentResume])

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
        if (fieldArray.length === 0) {
            return (
                <div
                    key={0}
                    className='py-2 flex align-top items-start border border-gray-200 p-2 my-2 rounded-md'>
                    <Textarea
                        value=""
                        onChange={(e) => handleChange(e, fieldName, 0)}
                        placeholder={`Type your ${fieldName}`}
                        className="w-[30vw] text-gray-800 text-sm outline-none border-collapse border-none"/>
                    <ion-icon
                        name="trash-outline"
                        style={{
                        color: "rgba(246, 43, 43, 0.644)",
                        fontSize: "18px",
                        cursor: "pointer"
                    }}
                        onClick={() => handleDelete(fieldName, 0)}></ion-icon>
                </div>
            )
        } 
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
        ))
    };


    // Handle Submitting the Copy resume
    const [isSubmit, setIsSubmit] = useState(false)
    axios.defaults.withCredentials = true;
    const handleSubmit = async(e) => {
      e.preventDefault();
      setIsSubmit(prev => !prev)

      console.log('Form Data Submitted:', currentResume);
      // Perform API call to save form data
      try {
          const response = await axios.post(`http://localhost:5000/api/trainer/${user._id}/copy-resume`, currentResume); // Replace with your API endpoint
          console.log('Registration successful:', response.data);
          getTrainerDetails() 
          setIsSubmit(prev => !prev)
          setCurrentResume({
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
        //   navigate("/home/resume")
          // setUser(response.data)
      }catch (error) {
          console.error('Registration failed:', error);
      }
    };

    axios.defaults.withCredentials = true;
    const getTrainerDetails = async() => {
  
      try{
        const res = await axios.get(`http://localhost:5000/api/trainer/details/${user._id}`)
        console.log(res.data)
        // setData(res.data)
        dispatch(setCredentials(res.data))
      }catch(err){
        console.log("Error fetching the data")
      }
    }
  
    return (
        <div className='my-6 mb-6  bg-white rounded-md  '>
            <form className='grid grid-cols-2 items-start mt-4'>
                <div className='py-2 ml-[-25px] my-2 rounded-md'>
                    <label htmlFor="" className='mb-2'>Training Name</label>
                    <Input
                        className="w-[30vw]"
                        placeholder="Training Name"
                        value={currentResumeDetails.trainingName}
                        onChange={(e) => handleNewResumeName(e)}/>
                </div>
                <div></div>
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

            <div className='grid place-content-center w-full my-8' >
                <Button onClick={handleSubmit} disabled={isSubmit}>{isSubmit ? "Saving ":"Save"}</Button>
            </div>
        </div>
    )
}

export default ResumeNew
