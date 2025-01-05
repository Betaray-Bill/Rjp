import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from "@/components/ui/card";
import {PencilLine, Upload} from "lucide-react";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import axios from 'axios';
import {useToast} from '@/hooks/use-toast';
import {sub} from 'date-fns';

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

function Profile() {
    const [open,
        setOpen] = useState(false);
    const {currentUser} = useSelector(state => state.auth)
    console.log(currentUser)
    // const empId = useParams()

    const {toast} = useToast()
    // Pass change
    const [pass,
        setPass] = useState({currentPassword: "", newpassword: "", confirmnewpassword: ""})

    axios.defaults.withCredentials = true;
    const submitHandler = async(e) => {
        // e.preventDefault()
        if (pass.newpassword === pass.confirmnewpassword) {
            console.log("Same")
            try {
                const response = await axios.put(`http://bas.rjpinfotek.com:5000/api/employee/updatePassword/${currentUser.employee._id}`, {
                    newpassword: pass.newpassword,
                    currentPassword: pass.currentPassword
                }); // Replace with your API endpoint
                console.log('Password Adding successful:', response.data);
                toast({
                    title: "Password Updated",
                    // description: "Friday, February 10, 2023 at 5:57 PM",
                    variant: "success"
                })

                window
                    .location
                    .reload()
            } catch (error) {
                console.error('Password Adding failed:', error);
            }

            // http://bas.rjpinfotek.com:5000/api/trainer/change-password/${user._id}
        } else {
            alert("Not same")
        }
    }

    console.log(currentUser)

    return (
        <div >
            <div className='grid w-full place-content-center my-4'>
                <p className='text-lg text-black-700 mt-4 pb-[-2] font-semibold'>Accounts</p>

                <div className='mt-4'>
                    <Card className="w-[90vw] lg:w-[80vw] ">
                        <CardContent className="flex flex-col p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className='flex items-center'>
                                    <Avatar className="h-12 w-12 mr-4 ">
                                        <AvatarImage
                                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                            alt={currentUser.employee.name}/>
                                        <AvatarFallback>{currentUser.employee.name}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{currentUser.employee.name}</p>
                                        <Button variant="outline" size="sm" className="mt-2">
                                            <PencilLine className="h-4 w-4 mr-2"/>
                                            Update Picture
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <Button variant="outline" size="sm" className="w-max mt-4">
                                        <Dialog className="w-max">
                                            <DialogTrigger>
                                                <div className='flex items-center '>
                                                    <PencilLine className="h-4 w-4 mr-2"/>
                                                    <span>change Password
                                                    </span>
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                    <DialogDescription>
                                                        {/* <form onSubmit={submitHandler}> */}
                                                        <div className=' gap-8'>
                                                            <div className='my-2'>
                                                                <Label className="mt-4 mb-10 text-black mt-2">Current Password</Label>
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
                                                            <div className='my-2'>

                                                                <Label className="mt-4 mb-10 text-black mt-2">New Password</Label>
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
                                                            <div className='my-3'>

                                                                <Label className="mt-4 mb-10 text-black mt-2">Confirm New Password</Label>
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
                                                        <Button onClick={() => submitHandler()} type="submit" className="mt-4 w-max">Update Password</Button>
                                                        {/* </form> */}
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>

                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className='w-[90vw] lg:w-[80vw]  mt-8 p-6 bg-white rounded-md'>
                    <div className='font-semibold'>Personal Info</div>

                    <Card className="mx-auto mt-4">
                        <CardContent
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700" htmlFor="name">Name</Label>
                                <Input id="name" value={currentUser.employee.name} readOnly/>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700" htmlFor="trainerId">Trainer ID</Label>
                                <Input id="trainerId" value={currentUser.employee._id} readOnly/>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700" htmlFor="trainerId">Email ID</Label>
                                <Input id="trainerId" value={currentUser.employee.email} readOnly/>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-700" htmlFor="trainerId">Roles Assigned</Label>
                                <div className="flex flex-wrap items-center gap-2">
                                    {currentUser
                                        .employee
                                        .role
                                        .map((role, _i) => (
                                            <div
                                                className='bg-blue-50 w-max mr-5 px-4 py-1 border border-black rounded-lg flex items-center'
                                                key={_i}>{role.name}</div>
                                        ))}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}

export default Profile
