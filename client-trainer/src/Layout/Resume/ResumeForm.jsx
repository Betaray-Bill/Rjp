import {Fragment, useEffect, useState,useRef} from 'react'
import {Textarea} from "@/components/ui/textarea"
import {useDispatch, useSelector} from 'react-redux';
import {Input} from "@/components/ui/input"
import axios from 'axios';
import {setCredentials} from '@/features/authSlice';
import {Button} from '@/components/ui/button';
import {setSaveResumeDetails} from '@/features/resumeSlice';
import {useToast} from "@/hooks/use-toast"
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';


function ResumeForm() {
    const resumeRef = useRef();
    const [isSubmit,
        setIsSubmit] = useState(false)
    const {toast} = useToast()
    const queryClient = useQueryClient()


    const {currentResumeDetails, currentResumeName, saveResumeDetails, downloadResume} = useSelector(state => state.resume)
    const {user} = useSelector(state => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isEdit,
        setIsEdit] = useState(true)
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




    // console.log(currentResume)
    useEffect(() => {
        if (currentResumeName === saveResumeDetails.trainingName) {
            setCurrentResume({
                ...saveResumeDetails
            })
        } else {
            setCurrentResume({
                ...user.mainResume
            })
        }

        // console.log(currentResumeDetails)
    }, [currentResumeName, isSubmit])

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
        if (!isEdit) {
            setCurrentResume((prevState) => {
                return {
                    ...prevState,
                    [field]: [
                        ...prevState[field],
                        ''
                    ], // Add empty string to the field array
                };
            });
        } else {
            toast({duration: 3000, variant: "destructive", title: "Adding field disabled", description: "Click edit to take action"})
        }
    };

    // Handler to delete an item from a specific field
    const handleDelete = (field, index) => {
        if (!isEdit) {
            setCurrentResume((prevState) => {
                const updatedArray = prevState[field].filter((_, i) => i !== index);
                return {
                    ...prevState,
                    [field]: updatedArray
                };
            });
        } else {
            toast({variant: "destructive", duration: 3000, title: "Deleting field disabled", description: "Click edit to take action"})
        }
    };

    // Function to render textareas for array fields
    const renderTextareas = (fieldArray, fieldName) => {
        if (fieldArray?.length === 0) {
            return (
                <div
                    key={0}
                    className='py-2 h- flex align-top items-start border border-gray-200 p-2 my-2 rounded-md'>
                    <Textarea
                        value=""
                        readOnly={isEdit}
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
        return fieldArray?.map((value, index) => (
            <div
                key={index}
                className='py-2 h- flex align-top items-start border border-gray-200 p-2 my-2 rounded-md'>
                <Textarea
                    value={value}
                    readOnly={isEdit}
                    onChange={(e) => handleChange(e, fieldName, index)}
                    placeholder={`Type your ${fieldName}`}
                    className="w-[30vw] text-gray-800 text-sm outline-none border-collapse border-none h-max"/>
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
    // console.log(currentResumeName)
    // Handle Submitting the Copy resume

    axios.defaults.withCredentials = true;
    //    Update Mutation Query
    const submitResume = useMutation(
        (data) => axios.put(`http://localhost:5000/api/trainer/updateresume/${user._id}`, {
                ...data,
                isMainResume: currentResumeName === "Main Resume"
                    ? true
                    : false
            }) // Replace with your API endpoint
        ,
        {
            onSuccess: (data) => {
                // console.log('Registration successful:', data.data);
                queryClient.invalidateQueries({ queryKey:  ["user", user._id]    })
                setIsSubmit(prev => !prev)
                dispatch(setSaveResumeDetails({
                    professionalSummary: [],
                    technicalSkills: [],
                    careerHistory: [],
                    certifications: [],
                    education: [],
                    trainingsDelivered: [],
                    clientele: [],
                    experience: [],
                    file_url: '',
                    trainingName: ''
                }))
            
                setIsEdit(false)
                toast({
                    duration: 3000, variant: "success", title: "Submitted successfully",
                    // description: "Click edit to take action",
                })
            }
        }
    )


    const handleSubmit = async(e) => {
        setIsSubmit(prev => !prev)
        e.preventDefault();
        // console.log('Form Data Submitted:', currentResumeName ,user._id);
        // Perform API call to Update the Data for this Resume
        try {

            submitResume.mutate(currentResume)

        } catch (error) {
            setIsSubmit(prev => !prev)

            // console.error('Registration failed:', error);
        }

    };

    axios.defaults.withCredentials = true;
    const getTrainerDetails = async() => {

        try {
            const res = await axios.get(`http://localhost:5000/api/trainer/details/${user._id}`)
            // console.log(res.data)
            // setData(res.data)
            dispatch(setCredentials(res.data))

        } catch (err) {
            // console.log("Error fetching the data")
        }
    }

    // handle Save in browser
    const handleSaveResume = async() => {
        setIsEdit(prev => !prev)
        // console.log(isEdit)
        if (isEdit) {
            // console.log("Edit clickde")

        } else {
            // console.log("Save")
            dispatch(setSaveResumeDetails({
                ...currentResume
            }))
            toast({
                duration: 3000, variant: "success", title: "Saved successfully",
                // description: "Click edit to take action",
            })
        }
    }

    return (
        <div className="my-6 mb-6 w-[70vw] rounded-md ">
            <div
                className='flex justify-between m-8 border-b-1 border-gray-500 items-center'>
                {currentResumeName !== 'Main Resume'
                    ? <div className=''>
                            <label htmlFor="">Training Name</label>
                            <Input
                                placeholder="Training Name"
                                value={currentResumeDetails.trainingName}
                                readOnly/>
                        </div>
                    : <div className='text-gray-700 font-medium px-3 py-1 bg-slate-200 rounded-full'>Main Resume</div>
}

                <Button
                    className='px-[20px] py-[10px] rounded-md cursor-pointer text-white
                        bg-buttonPrimary flex align-middle items-center'
                    onClick={handleSaveResume}>
                    {isEdit
                        ? (
                            <Fragment>
                                <ion-icon
                                    name="pencil-outline"
                                    style={{
                                    fontSize: "16px"
                                }}></ion-icon>
                                <span className='ml-2'>Edit</span>
                            </Fragment>
                        )
                        : <Fragment>
                            <ion-icon
                                name="bookmark-outline"
                                style={{
                                fontSize: "16px"
                            }}></ion-icon>
                            <span className='ml-2'>Save</span>
                        </Fragment>
}
                </Button>
            </div>
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
            <div className='grid place-content-center w-full my-8'>
                <Button onClick={handleSubmit} disabled={isSubmit}>{isSubmit
                        ? "Saving "
                        : "Submit"}</Button>
            </div>
        </div>
    )
}

export default ResumeForm
