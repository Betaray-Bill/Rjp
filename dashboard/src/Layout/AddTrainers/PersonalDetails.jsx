import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {setResumeDetails} from '@/features/trainerSlice.js';

function PersonalDetails() {
    const dispatch = useDispatch();
    const {trainerDetails} = useSelector(state => state.trainer)

    const [generalDetails,
        setGeneralDetails] = useState({name: "", email: "", phoneNumber: Number(), whatsappNumber: Number(), alternateNumber: Number()})

    const handleChange = (event) => {
        const updatedGeneralDetails = {
            ...generalDetails,
            [event.target.name]: event.target.value
        }
        setGeneralDetails(updatedGeneralDetails);
        dispatch(setResumeDetails({name: "generalDetails", data: updatedGeneralDetails}))
    }

    console.log(trainerDetails)

    return (
        <div className=''>
            <h2 className='text-slate-700  text-lg py-4 font-semibold'>General Details</h2>
            <div
                className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[25px] mb-3 mt-3 place-items-center'>
                <div>
                    <Label htmlFor="Name">Name</Label>
                    <Input type="text" id="name" name="name" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="Email">Email</Label>
                    <Input type="email" id="Email" name="email" onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="Phone Number">Phone Number</Label>
                    <Input
                        type="number"
                        id="Phone Number"
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
                        value={generalDetails.whatsappNumber
                        ? generalDetails.whatsappNumber
                        : generalDetails.phoneNumber}
                        name="whatsappNumber"
                        onChange={(e) => handleChange(e)}/>
                </div>

                <div>
                    <Label htmlFor="Alternate Number">Alternate Number</Label>
                    <Input
                        type="number"
                        id="Alternate Number"
                        name="alternateNumber"
                        onChange={(e) => handleChange(e)}/>
                </div>

            </div>
        </div>
    )
}

export default PersonalDetails
