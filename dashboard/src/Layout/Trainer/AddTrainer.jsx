import React, {useState, useEffect, Fragment} from 'react';
// import './AddTrainer.css'; // External CSS file for grid styling
import {useDispatch, useSelector} from 'react-redux';
import {Button} from '@/components/ui/button';
import {removeResumeDetails, resetTrainerDetails} from '@/features/trainerSlice';
import {useMutation} from 'react-query';
import axios from 'axios';
import {useToast} from "@/hooks/use-toast"
import PersonalDetails from '@/Layout/Trainer/AddTrainers/PersonalDetails';
import TrainingDetails from '@/Layout/Trainer/AddTrainers/TrainingDetails';
import BankDetails from '@/Layout/Trainer/AddTrainers/BankDetails';
import TrainingDomain from '@/Layout/Trainer/AddTrainers/TrainingDomain';
import ResumeDetails from '@/Layout/Trainer/AddTrainers/Resume/ResumeDetails';
import {useNavigate} from 'react-router-dom';

const AddTrainer = () => {
    // console.log("meow", add++)
    const {toast} = useToast()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {currentUser} = useSelector(state => state.auth)
    const {trainerDetails} = useSelector(state => state.trainer)
    console.log(trainerDetails)
    console.log(currentUser)
    const handleReset = () => {
        dispatch(removeResumeDetails())
    }

    console.log(trainerDetails)

    // Trainer Submission QUERY
    const [isSubmission,
        setIsSubmission] = useState(false)
    const trainerMutation = useMutation((data) => {
        return axios.post(`http://localhost:5000/api/trainersourcer/register-trainer/${currentUser.employee._id}`, data)
    }, {
        onSuccess: (data) => {
            console.log("2")

            setIsSubmission(prev => !prev)
            console.log("Submission DOnes")
            // dispatch(removeResumeDetails())
            console.log(data)
            if (data) {
                // navigate('/home/dashboard');
                console.log("3")
            }
        },
        onSettled: () => {
            console.log("Settled")
            console.log("4")

            setIsSubmission(prev => !prev)
            toast({
                title: "Trainer Added",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        },
        onError: (error) => {
            console.log(error);
            setIsSubmission(prev => !prev)
            toast({
                title: "Trainer adding error",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        }
    })

    const submitHandler = async(event) => {
        event.preventDefault();
        // console.log(formData)
        console.log("Submit Handler")
        if(trainerDetails.trainingDetails.trainerType){
            // if()
            try {
                console.log("1")
                console.log(trainerDetails)
    
                // UPload aadhar and pancard File and get URL
                console.log(trainerDetails.bankDetails.aadharCard, trainerDetails.bankDetails.pancard)
                if (trainerDetails.bankDetails.aadharCard === undefined || trainerDetails.bankDetails.pancard === undefined) {
                    console.log("meow")
                    trainerMutation.mutate(trainerDetails)
                    dispatch(removeResumeDetails())
                    dispatch(resetTrainerDetails())
                } else {
                    console.log("Checking blob connection...");
                    const result = await axios.get('http://localhost:5000/api/filestorage/check-blob-connection');
                    const response = result.data;
                    console.log("Connection check result:", response);

                    if (result.status == 200) {
                        console.log("File is present. Sending data to another API...");

                        // Call another POST API Create a FormData object to handle file upload
                        const formData = new FormData();
                        formData.append("aadharCard", trainerDetails.bankDetails.aadharCard);
                        formData.append("pancard", trainerDetails.bankDetails.pancard);
                        console.log(trainerDetails.generalDetails.name)
                        // Additional metadata Call the POST API to upload the file
                        const uploadResult = await axios.post(`http://localhost:5000/api/filestorage/upload-aadhar-pan/trainer/${trainerDetails.generalDetails.name}`, formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        });

                        const res = uploadResult.data
                        const data = {
                            ...trainerDetails,
                            bankDetails: {
                                ...trainerDetails.bankDetails,
                                panCard: res.panCard,
                                aadharCard: res.aadharCard
                            }
                        }
                        // // Upload trainer details
                        trainerMutation.mutate(data)
                        dispatch(removeResumeDetails())
                        dispatch(resetTrainerDetails())
                    }

                    navigate("/home/trainer")
                }

            } catch (error) {
                console.log(error);
            }
        }else{
            toast({
                title: "Please select Trainer Type",
                // description: "Friday, February 10, 2023 at 5:57 PM",
                variant:"destructive"
            })
        }

    }

    return (

        <div className='w-[80vw] h-screen py-4 px-3'>
            <div className='p-3'>
                {/* <h>Add Trainer</h> */}
                {/* <Button onClick={handleReset}>Reset</Button> */}
                {/* FORM */}
                <form>
                    {/* General Details */}
                    <div className='mt-4 border p-3 rounded-md'>
                        <PersonalDetails/>
                    </div>

                    {/* Training Details */}
                    <div className='mt-10 border  p-3 rounded-md '>
                        <TrainingDetails/>
                    </div>

                    {/* Bank Details */}
                    <div className='mt-10 border  p-3 rounded-md '>
                        <BankDetails/>
                    </div>

                    {/* Training DOmain */}
                    <div className='mt-10 border p-3 rounded-md '>
                        <TrainingDomain/>
                    </div>

                    {/* Resume Details */}
                    <div className='mt-10 border  p-3 rounded-md '>
                        <ResumeDetails/>
                    </div>

                    <div className='mt-10 p-3 rounded-md grid place-items-center'>
                        <Button onClick={submitHandler} disabled={isSubmission}>{isSubmission
                                ? <div className='flex items-center justify-between'><img
                                        src="https://cdn.dribbble.com/users/172906/screenshots/1672303/2014-08-05_23_14_21.gif"
                                        alt=""
                                        className='w-[30px]'/>
                                        <span>Submitting</span>
                                    </div>
                                : "Submit"}</Button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default AddTrainer;