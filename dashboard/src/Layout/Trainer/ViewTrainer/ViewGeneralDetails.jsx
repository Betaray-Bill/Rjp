import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {setResumeDetails} from '@/features/trainerSlice.js';


function ViewGeneralDetails({data}) {
    const dispatch = useDispatch();
    const {trainerDetails} = useSelector(state => state.trainer)


    const [generalDetails,
        setGeneralDetails] = useState({name: "", email: "", phoneNumber: null, whatsappNumber: null, alternateNumber: null, dateOfBirth:Date()})

    useEffect(() => {
        if(data) {
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

    // console.log(trainerDetails)

    return (
        <div className=''> 
            <h2 className='text-slate-700  text-lg py-4 font-semibold'>General Details</h2>
            <div
                className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[25px] mb-3 mt-3 place-items-center'>
                <div>
                    <Label htmlFor="Name">Name</Label>
                    <Input type="text" value={generalDetails.name} id="name" name="name" onChange={(e) => handleChange(e)} />
                </div>

                <div>
                    <Label htmlFor="Email">Email</Label>
                    <Input type="email" value={generalDetails.email} id="Email" name="email" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="Phone Number" className="flex items-center">
                        <span className='mr-4'>Phone Number </span>
                        <ion-icon name="repeat-outline" style={{fontSize:"24px"}} onClick={() => setGeneralDetails({...generalDetails, whatsappNumber: generalDetails.phoneNumber})}></ion-icon>
                    </Label>
                    <Input
                        type="number"
                        id="Phone Number"
                        value={generalDetails.phoneNumber ? generalDetails.phoneNumber : ""}
                        name="phoneNumber"
                        onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="Whatsapp Number">
                        <span>Whatsapp Number</span>
                    </Label>
                    <Input
                        type="number"
                        id="Whatsapp Number"
                        value={generalDetails.whatsappNumber === null ?  generalDetails.phoneNumber: generalDetails.whatsappNumber}
                        name="whatsappNumber"
                        onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="Alternate Number">Alternate Number</Label>
                    <Input
                        type="number"
                        id="Alternate Number"
                        value={generalDetails.alternateNumber !== "" ? generalDetails.alternateNumber : ""}  // if alternateNumber is null then take phoneNumber
                        name="alternateNumber"
                        onChange={(e) => handleChange(e)}/>
                </div>

                <div className='flex flex-col'>
                    <Label htmlFor="Date of Birth" className="mb-2">Date of Birth</Label>
                    <Input type="date" className="w-max" id="name" name="dateOfBirth" onChange={(e) => handleChange(e)} value={generalDetails.dateOfBirth}/>
                </div>


            </div>
        </div>
    )
}

export default ViewGeneralDetails
