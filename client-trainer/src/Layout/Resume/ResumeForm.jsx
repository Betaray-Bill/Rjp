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
import { useLocation, useNavigate } from 'react-router-dom';
import { setResumeDetails } from '@/features/trainerSlice';


function ResumeForm() {
    const resumeRef = useRef();
    const [isSubmit,
        setIsSubmit] = useState(false)
    const {toast} = useToast()
    const queryClient = useQueryClient()


    const {currentResumeDetails, currentResumeName, saveResumeDetails, downloadResume} = useSelector(state => state.resume)
    const {user} = useSelector(state => state.auth)
    const navigate = useNavigate()
    const location = useLocation()
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

    // useEffect(() => {
    //     if(currentResumeName ==="Main Resume"){
    //         setCurrentResume({...user.mainResume})
    //     }
    // }, [])




    // console.log(currentResume)
    useEffect(() => {
        // if (currentResumeName === currentResume.trainingName) {
            console.log("Same reeume name: " + currentResumeName, saveResumeDetails.trainingName)

            if(currentResumeName ==="Main Resume"){
                setCurrentResume({...user.mainResume})
            }else{
                setCurrentResume({
                    ...currentResumeDetails, trainingName: currentResumeName
                })
            }
    

    }, [currentResumeName])

    // UPloading the Resume and Extracting the Resume
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    //   const [isEdit, setIsEdit] = useState(true)
    const [error, setError] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
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
        fileInputRef.current.files = null
        }
    };

    // Function to upload the resume to Azure and extract the data
    const uploadToAzure = async(file) => {
        const formData = new FormData();
        formData.append("resume", file);
        setIsUploading(true)
        try {
            const response = await axios.post("http://localhost:4000/upload", formData, {
                headers: {
                "Content-Type": "multipart/form-data",
                },
            });
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
            // setResume(newResume)
            setCurrentResume({
                ...newResume, trainingName: currentResumeName
            })
        } catch (error) {
        console.error("Error extracting resume data:", error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data : error.message);
        } finally {
        setIsLoading(false);
        setIsUploading(false)
        }
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

    // Handler to add a new empty textarea for a specific field
    const handleAdd = (field) => {
        // if (!isEdit) {
            setCurrentResume((prevState) => {
                return {
                    ...prevState,
                    [field]: [
                        ...prevState[field],
                        ''
                    ], // Add empty string to the field array
                };
            });
        // } else {
            toast({duration: 3000, variant: "success", title: "Adding field.."})
        // }
    };

    // Handler to delete an item from a specific field
    const handleDelete = (field, index) => {
        // if (!isEdit) {
            setCurrentResume((prevState) => {
                const updatedArray = prevState[field].filter((_, i) => i !== index);
                return {
                    ...prevState,
                    [field]: updatedArray
                };
            });
        // } else {
            toast({variant: "success", duration: 3000, title: "Deleting the field"})
        // }
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
                        // readOnly={isEdit}
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
                    // readOnly={isEdit}
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
    console.log(currentResume)

    axios.defaults.withCredentials = true;
    //    Update Mutation Query
    const submitResume = useMutation(
        (data) => axios.put(`http://localhost:5000/api/trainer/updateresume/${user._id}`, {
                ...data, trainingName:currentResumeName,
                isMainResume: currentResumeName === "Main Resume"
                    ? true
                    : false
            }) // Replace with your API endpoint
        ,
        {
            onSuccess: (data) => {
                // console.log('Registration successful:', data.data);
                // queryClient.invalidateQueries({ queryKey:  ["user", user._id]    })
                setIsSubmit(prev => !prev)
                // dispatch(setSaveResumeDetails({
                //     professionalSummary: [],
                //     technicalSkills: [],
                //     careerHistory: [],
                //     certifications: [],
                //     education: [],
                //     trainingsDelivered: [],
                //     clientele: [],
                //     experience: [],
                //     file_url: '',
                //     trainingName: ''
                // }))
                
                setIsEdit(false)
                getTrainerDetails()
                // dispatch(currentResumeName("Main Resume"))
                // navigate('/home/resume/main')
                toast({
                    duration: 3000, variant: "success", title: "Submitted successfully"
                })
                // navigate('/home/resume/main')

            }
        }
    )


    const handleSubmit = async(e) => {
        setIsSubmit(prev => !prev)
        e.preventDefault();
        // console.log('Form Data Submitted:', currentResumeName ,user._id);
        // Perform API call to Update the Data for this Resume
        try {
            console.log(currentResume)
            submitResume.mutate(currentResume)
            // navigate('/home/resume/main')
        } catch (error) {
            setIsSubmit(prev => !prev)

            // console.error('Registration failed:', error);
        }

    };

    axios.defaults.withCredentials = true;
    const getTrainerDetails = async() => {

        try {
            const res = await axios.get(`http://localhost:5000/api/trainer/details/${user._id}`)
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
            <div className='flex justify-between items-center'>
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
                </div>

                {
                    location.pathname.split("/").includes('main') &&
                    <div className='px-2'>
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
                            <Button onClick={handleButtonClick} disabled={isLoading} className="bg-buttonPrimary text-white flex items-center justify-between">
                                <ion-icon name="cloud-upload-outline"  style={{fontSize: "20px"}}></ion-icon>
                                <span className='ml-3'>{isLoading ? "Processing..." : "Upload Resume"}</span>
                            </Button>
                        </div>
                    </div>
                     
                }
            </div>
            {
                isLoading ? 
                <div className="text-center grid place-content-center w-full">
                  <img src="https://www.icegif.com/wp-content/uploads/2023/07/icegif-1263.gif" width={300} alt="" />
                  <p className='text-slate-700'>Processing your resume...</p>
                </div> : 
                <Fragment>
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
                </Fragment>
            }
        </div>
    )
}

export default ResumeForm
