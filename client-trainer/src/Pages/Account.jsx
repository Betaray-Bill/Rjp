import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"

import axios from 'axios';
import PersonalDetails from '@/Layout/Accounts/PersonalDetails';
import BankDetails from '@/Layout/Accounts/BankDetails';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from "@/components/ui/card";
import {PencilLine, Upload} from "lucide-react";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from 'react-query';
import api from '@/utils/api';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '  70vw',
    height: '70vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    overflowY: 'scroll',
    boxShadow: 24,
    p: 4
};

function Account() {
    const [open,
        setOpen] = useState(false);
        const {toast} = useToast()
        const queryClient= useQueryClient()
    const {user} = useSelector(state => state.auth)

    const [isEdit, setIsEdit] = useState(false);

    const [formData,
        setFormData] = useState(user);

    const [generalDetails,
        setGeneralDetails] = useState({...user.generalDetails});

    // Update handlers (optional for convenience)
    const handleChange = (e) => {
        const {id, value} = e.target;
        setGeneralDetails((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleAddressChange = (e) => {
        const {id, value} = e.target;
        setGeneralDetails((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [id]: value
            }
        }));
    };

    axios.defaults.withCredentials = true;
    const handleSubmit = async(e) => {
        try {
            const res = await api.put(`/trainer/update/${user._id}`, {generalDetails:{...generalDetails}}  )
            const response = await res.data;
            queryClient.invalidateQueries(["user", user._id])

   
            toast({
                title: "Personal Details Updated",
                description: "Your details have been successfully updated",
                variant: "success",
                duration: 3000,
            })
            setIsEdit(false)
        } catch (e) {
            console.error(e)
            // setError('Failed to submit the resume')
        }
    };

    console.log(user)

    // Pass change
    const [pass,
        setPass] = useState({currentPassword: "", newpassword: "", confirmnewpassword: ""})

    axios.defaults.withCredentials = true;
    const submitHandler = async(e) => {
        e.preventDefault()
        if (pass.newpassword === pass.confirmnewpassword) {
            console.log("Same")
            try {
                const response = await api.put(`/trainer/change-password/${user._id}`, {
                    newpassword: pass.newpassword,
                    currentPassword: pass.currentPassword
                }); // Replace with your API endpoint
                console.log('Password Adding successful:', response.data);
            } catch (error) {
                console.error('Password Adding failed:', error);
            }

            // /trainer/change-password/${user._id}
        } else {
            alert("Not same")
        }
    }

    return (
        <div className='grid w-full place-content-center my-4 pl-[5vw]'>
            <p className='text-md text-gray-700 mt-4 pb-[-2] font-semibold'>Accounts</p>

            <div className='mt-8'>
                <Card className="w-[90vw] lg:w-[80vw] ">
                    <CardContent className="flex flex-col p-4">
                        <div
                            className=" grid place-content-between grid-cols-1 md:grid-cols-2 items-center w-full mb-4">
                            <div className='flex items-center'>
                                <Avatar className="h-12 w-12 mr-4 ">
                                    <AvatarImage
                                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                        alt={user.generalDetails.name}/>
                                    <AvatarFallback>{user
                                            .generalDetails
                                            .name
                                            .charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{user.generalDetails.name}</p>
                                    <Button variant="outline" size="sm" className="mt-2">
                                        <PencilLine className="h-4 w-4 mr-2"/>
                                        Update Picture
                                    </Button>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-max mt-4">
                                <Dialog>
                                    <DialogTrigger>
                                        <div className='flex items-center '><PencilLine className="h-4 w-4 mr-2"/>
                                            <span>change Password
                                            </span>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                <form onSubmit={submitHandler}>
                                                    <div className='grid grid-cols-2 gap-8'>
                                                        <div>
                                                            <Label className="mt-4 mb-10">Current Password</Label>
                                                            <Input
                                                                type="password"
                                                                name="currentPassword"
                                                                placeholder="Current Password"
                                                                required
                                                                onChange={(e) => setPass({
                                                                ...pass,
                                                                [e.target.name]: e.target.value
                                                            })}/>
                                                        </div>
                                                        <div>
                                                            <Label className="mt-4 mb-10">New Password</Label>
                                                            <Input
                                                                type="password"
                                                                name="newpassword"
                                                                placeholder="New Password"
                                                                required
                                                                onChange={(e) => setPass({
                                                                ...pass,
                                                                [e.target.name]: e.target.value
                                                            })}/>
                                                        </div>
                                                        <div>
                                                            <Label className="mt-4 mb-10">Confirm New Password</Label>
                                                            <Input
                                                                type="password"
                                                                name="confirmnewpassword"
                                                                placeholder="Confirm New Password"
                                                                required
                                                                onChange={(e) => setPass({
                                                                ...pass,
                                                                [e.target.name]: e.target.value
                                                            })}/>
                                                        </div>

                                                    </div>
                                                    <Button type="submit" className="mt-4 w-full">Change Password</Button>
                                                </form>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>

                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className='w-[90vw] lg:w-[80vw]  mt-8 p-6 bg-white rounded-md'>
                <div className='flex items-center justify-between'>
                    <h2 className='font-semibold'>Personal Info</h2>
                    {
                        isEdit ?
                            <div>
                                <Button className="rounded-none border border-red-600 bg-white text-red-600 mx-4 hover:bg-red-200" onClick={() => setIsEdit(false)}>Cancel</Button>
                                <Button className="rounded-none" onClick={handleSubmit}>Submit</Button>
                            </div>:
                        <Button className="rounded-none" onClick={() => setIsEdit(true)}>Edit</Button>
                    }
                </div>

                <Card className="mx-auto mt-4">
                    <CardContent
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        <div className="space-y-2">
                            <Label className="text-slate-700" htmlFor="name">
                                Name
                            </Label>
                            <Input readOnly={!isEdit} id="name" value={generalDetails.name} onChange={handleChange}/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                readOnly={!isEdit}
                                type="email"
                                value={generalDetails.email}
                                onChange={handleChange}/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700" htmlFor="phoneNumber">
                                Mobile Number
                            </Label>
                            <Input
                                readOnly={!isEdit}
                                id="phoneNumber"
                                value={generalDetails.phoneNumber}
                                onChange={handleChange}/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700" htmlFor="alternateNumber">
                                Alternate Number
                            </Label>
                            <Input
                                readOnly={!isEdit}
                                id="alternateNumber"
                                value={generalDetails.alternateNumber}
                                onChange={handleChange}/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700" htmlFor="whatsappNumber">
                                WhatsApp Number
                            </Label>
                            <Input
                                readOnly={!isEdit}
                                id="whatsappNumber"
                                value={generalDetails.whatsappNumber}
                                onChange={handleChange}/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700" htmlFor="flat_doorNo_street">
                                Address - Flat/Door No/Street
                            </Label>
                            <Input
                                readOnly={!isEdit}
                                id="flat_doorNo_street"
                                value={generalDetails.address.flat_doorNo_street}
                                onChange={handleAddressChange}/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700" htmlFor="area">
                                Address - Area
                            </Label>
                            <Input
                                readOnly={!isEdit}
                                id="area"
                                value={generalDetails.address.area}
                                onChange={handleAddressChange}/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700" htmlFor="townOrCity">
                                Address - Town/City
                            </Label>
                            <Input
                                readOnly={!isEdit}
                                id="townOrCity"
                                value={generalDetails.address.townOrCity}
                                onChange={handleAddressChange}/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700" htmlFor="state">
                                Address - State
                            </Label>
                            <Input
                                readOnly={!isEdit}
                                id="state"
                                value={generalDetails.address.state}
                                onChange={handleAddressChange}/>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700" htmlFor="pincode">
                                Address - Pincode
                            </Label>
                            <Input
                                readOnly={!isEdit}
                                id="pincode"
                                value={generalDetails.address.pincode}
                                onChange={handleAddressChange}/>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {
                user && user.trainingDetails.trainerType !== 'Internal' && <BankDetails />
            }

            <p className='text-end text-red-500 mt-10'>To update your details please contact the company</p>
        </div>
    )
}

export default Account
