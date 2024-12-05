import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {setResumeDetails} from '@/features/trainerSlice.js';
import {Button} from '@/components/ui/button';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {useQueryClient} from 'react-query';
import { useToast } from '@/hooks/use-toast';

function ViewGeneralDetails({data, id}) {
    const trainerId = useParams()
    const queryClient = useQueryClient()
    const dispatch = useDispatch();
    const {trainerDetails} = useSelector(state => state.trainer)
    const {toast} = useToast()
    const [isEdit,
        setIsEdit] = useState(false)
    console.log("Trainer Details ", trainerDetails)
    const [generalDetails,
        setGeneralDetails] = useState({
        name: "",
        email: "",
        phoneNumber: null,
        whatsappNumber: null,
        alternateNumber: null,
        dateOfBirth: Date(),
        address: {
            flat_doorNo_street: "",
            area: "",
            townOrCity: "",
            state: "",
            pincode: ""
        }
    })

    useEffect(() => {
        if (data) {
            console.log(data)
            setGeneralDetails(data)
        }
    }, [data])

    const handleChange = (event) => {
        const updatedGeneralDetails = {
            ...generalDetails,
            [event.target.name]: event.target.value
        }
        setGeneralDetails(updatedGeneralDetails);
        dispatch(setResumeDetails({name: "generalDetails", data: updatedGeneralDetails}))
    }

    const submitHandler = async(e) => {
        // e.preventDefault()
        console.log("object")
        // http://localhost:5000/api/trainer/updateResume/671f1f348706010ba634eb92/resum
        // e/671f1f348706010ba634eb8f
        // console.log(`http://localhost:5000/api/trainer/updateResume/671f1f348706010ba
        // 6 34eb92/resume/${data._id}`)
        try {
            console.log("object ", trainerDetails)
            // console.log(resume)
            const res = await axios.put(`http://localhost:5000/api/trainersourcer/update-profile/${trainerId.id}`, {generalDetails: generalDetails})
            console.log(generalDetails)
            const data = res.data
            console.log(data)
            queryClient.invalidateQueries(["getTrainerById", trainerId.id])
            setIsEdit(false)
        } catch (e) {
            console.error(e)
            // setError('Failed to submit the resume')
        }

    }

    const handleAddressChange = (event) => {
        const updatedGeneralDetails = {
            ...generalDetails,
            'address':{ ...generalDetails.address,
            [event.target.name]: event.target.value
            }
        }
        setGeneralDetails(updatedGeneralDetails);
        dispatch(setResumeDetails({name: "generalDetails", data: updatedGeneralDetails}))
    }

    // Reset Password
    const ResetPassword = async() => {
        console.log("object")
        try {
            console.log("object ", trainerDetails)
            // console.log(resume)
            const res = await axios.put(`http://localhost:5000/api/trainer/reset/${trainerId.id}`)
            console.log(generalDetails)
            const data = res.data
            console.log(data)
            toast({
                title: "Password Reset Successfully",
                // description: "Your password has been reset successfully",
                variant: "success",
            })
            queryClient.invalidateQueries(["getTrainerById", trainerId.id])
            setIsEdit(false)
        } catch (e) {
            console.error(e)
            // setError('Failed to submit the resume')
        }
    }

    return (
        <div className=''>
            <div className='flex justify-between'>
                <h2 className='text-slate-700  text-lg py-4 font-semibold'>General Details</h2>
                <div className='font-semibold text-lg'>
                    {/* Trainer {data.generalDetails?.name} */}
                    { !isEdit
                        ? (
                            <Button onClick={() => setIsEdit(true)} className="flex items-center">
                                <ion-icon name="pencil-outline"></ion-icon>
                                Edit
                            </Button>
                        )
                        : <Button onClick={submitHandler}>
                            Submit
                        </Button>
}

                </div>
            </div>

            <div
                className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[25px] mb-3 mt-3 place-items-center'>
                <div>
                    <Label htmlFor="Name">Name</Label>
                    <Input
                        readOnly={!isEdit}
                        type="text"
                        value={generalDetails.name}
                        id="name"
                        name="name"
                        onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="Email">Email</Label>
                    <Input
                        readOnly={!isEdit}
                        type="email"
                        value={generalDetails.email}
                        id="Email"
                        name="email"
                        onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="Phone Number" className="flex items-center">
                        <span className='mr-4'>Phone Number
                        </span>
                        <ion-icon
                            name="repeat-outline"
                            style={{
                            fontSize: "24px"
                        }}
                            onClick={() => setGeneralDetails({
                            ...generalDetails,
                            whatsappNumber: generalDetails.phoneNumber
                        })}></ion-icon>
                    </Label>
                    <Input
                        readOnly={!isEdit}
                        type="number"
                        id="Phone Number"
                        value={generalDetails.phoneNumber
                        ? generalDetails.phoneNumber
                        : ""}
                        name="phoneNumber"
                        onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="Whatsapp Number">
                        <span>Whatsapp Number</span>
                    </Label>
                    <Input
                        readOnly={!isEdit}
                        type="number"
                        id="Whatsapp Number"
                        value={generalDetails.whatsappNumber === null
                        ? generalDetails.phoneNumber
                        : generalDetails.whatsappNumber}
                        name="whatsappNumber"
                        onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="Alternate Number">Alternate Number</Label>
                    <Input readOnly={!isEdit} type="number" id="Alternate Number" value={generalDetails.alternateNumber !== ""
                        ? generalDetails.alternateNumber
                        : ""} // if alternateNumber is null then take phoneNumber
                        name="alternateNumber" onChange={(e) => handleChange(e)}/>
                </div>

                <div className='flex flex-col'>
                    <Label htmlFor="Date of Birth" className="mb-2">Date of Birth</Label>
                    <Input
                        readOnly={!isEdit}
                        type="date"
                        className="w-max"
                        id="name"
                        name="dateOfBirth"
                        onChange={(e) => handleChange(e)}
                        value={generalDetails.dateOfBirth}/>
                </div>

                <div>
                    <Label htmlFor="flat_doorNo_street">Flat/Door No/Street</Label>
                    <Input
                        readOnly={!isEdit}
                        type="text"
                        value={generalDetails.address.flat_doorNo_street ? generalDetails.address.flat_doorNo_street : null}
                        id="flat_doorNo_street"
                        name="flat_doorNo_street"
                        onChange={(e) => handleAddressChange(e)}/>
                </div>
                <div>
                    <Label htmlFor="area">Area</Label>
                    <Input
                        readOnly={!isEdit}
                        type="text"
                        value={generalDetails.address.area ? generalDetails.address.area : null}
                        id="area"
                        name="area"
                        onChange={(e) => handleAddressChange(e)}/>
                </div>
                <div>
                    <Label htmlFor="townOrCity">Town or City</Label>
                    <Input
                        readOnly={!isEdit}
                        type="text"
                        value={generalDetails.address.townOrCity ? generalDetails.address.townOrCity : null}
                        id="townOrCity"
                        name="townOrCity"
                        onChange={(e) => handleAddressChange(e)}/>
                </div>
                <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                        readOnly={!isEdit}
                        type="text"
                        value={generalDetails.address.state ? generalDetails.address.state : null}
                        id="state"
                        name="state"
                        onChange={(e) => handleAddressChange(e)}/>
                </div>
                <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                        readOnly={!isEdit}
                        type="text"
                        value={generalDetails.address.pincode ? generalDetails.address.pincode : null}
                        id="pincode"
                        name="pincode"
                        onChange={(e) => handleAddressChange(e)}/>
                </div>

            </div>

            {/* Reset Password */}

            <div className='flex justify-between items-center mt-10 w-[80vw] border py-2 px-4 rounded-md'>
                <h2 className='font-semibold'>Password Reset</h2>
                <Button className='w-[200px] bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full' onClick={ResetPassword}>
                    Reset Password
                </Button>
            </div>
        </div>
    )
}

export default ViewGeneralDetails
