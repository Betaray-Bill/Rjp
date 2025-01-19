import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import axios from 'axios'
import React, {useState} from 'react'
import { useToast } from "@/hooks/use-toast"
import api from '@/utils/api'

function AddEmployee() {
    const { toast } = useToast()
    const [empData,
        setEmpData] = useState({name: "", email: "", roles: [], password: ""})

    const handleChange = (event) => {
        // Update the state with the new value
        if(event.target.name === "roles"){
            let a =[]
            a.push(event.target.value);
            setEmpData({
                ...empData,
                roles:a
            });
        }else{
            setEmpData({
                ...empData,
                [event.target.name]: event.target.value
            });
        }
    }

    console.log(empData)

    axios.defaults.withCredentials = true;
    const handleSubmit = async(event) => {
        event.preventDefault();
        
        try {
            const response = await api.post('/employee/register', empData); // Replace with your API endpoint
            console.log('Registration successful:', response.data);
            toast({
                title: "Employee Registered",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className='mt-8 border p-4 rounded-md'>
            <h2>Add Employee</h2>

            <form
                onSubmit={handleSubmit}
                action=""
                className='mt-10 grid place-content-center '>
                <div className='grid place-content-center gap-10 items-center grid-cols-1 md:grid-cols-2 2xl:grid-cols-3'>
                    <div>
                        <Label htmlFor="name">Employee Name</Label>
                        <Input required type="text" id="" name="name" onChange={(e) => handleChange(e)}/>
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input required type="text" name="email" onChange={(e) => handleChange(e)}/>
                    </div>
                    {/* <div>
                    <Label>Date Of Birth</Label>
                    <Input required
                        type="date"
                        id="name"
                        name="email"
                        onChange={(e) => handleChange(e)}/>
                </div> */}
                    {/* <div>
                        <Label>Password</Label>
                        <Input required
                            type="password"
                            id="password"
                            name="password"
                            onChange={(e) => handleChange(e)}/>
                    </div> */}
                    <div className='flex flex-col'>
                        <Label>Role</Label>
                        <select
                            name="roles"
                            id=""
                            onChange={(e) => handleChange(e)}
                            className='w-[300px]'>
                            <option value="ADMIN">ADMIN</option>
                            {/* <option value="Manager">Manager</option> */}
                            <option value="Trainer Sourcer">Trainer Sourcer</option>
                            <option value="KeyAccounts">KeyAccounts</option>
                            <option value="Finance">Finance</option>
                        </select>
                    </div>
                    {/* <div>
                    <Label>Email</Label>
                    <Input required
                        type="text"
                        id="name"
                        name="email"
                        onChange={(e) => handleChange(e)}/>
                </div> */}
                </div>
                <div className='w-full text-center'>
                    <Button className="mt-10" type="submit">Submit</Button>
                </div>
            </form>
        </div>
    )
}

export default AddEmployee
