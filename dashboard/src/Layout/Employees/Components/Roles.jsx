import {Button} from '@/components/ui/button'
import {useToast} from '@/hooks/use-toast';
import api from '@/utils/api';
import {Label} from '@radix-ui/react-dropdown-menu';
import axios from 'axios';
import {space} from 'postcss/lib/list';
import React, {Fragment, useState} from 'react'
import { useQueryClient } from 'react-query';
import {useParams} from 'react-router-dom';

function Roles({data}) {
    const [isEdit,
        setIsEdit] = useState(false)
    const {toast} = useToast()
    const [roles,
        setRoles] = useState([])
    
    const queryClient = useQueryClient()
    const params = useParams()
    console.log(params)
    const handleChange = (event) => {
        // Update the state with the new value if (event.target.name === "roles") {
        let a = []
        a.push(event.target.value);
        setRoles((p) => [
            ...p,
            event.target.value
        ]);
        // }
    }

    const handleDeleteSelectedRoles = async(e, value) => {
        try {
            console.group("y")
            const response = await api.put(`/employee/disable-role/${params.id}`, {roles: e, value}); //
            console.log('Disabling Roles successful:', response.data);
            toast({
                title: `Employee Role ${!value ? 'Enables' : 'Diasbled'}`, //
                // description: "Friday, February 10, 2023 at 5:57 PM"
                variant: "success"
            })
            // window.location.reload()
            
            queryClient.invalidateQueries(["ViewEmp", params.id])
        } catch (error) {
            console.error('Registration failed:', error);
        }
    }

    const handleSubmit = async(event) => {
        event.preventDefault();

        try {
            const response = await api.put(`/employee/update-role/${params.id}`, {roles: roles}); //
            console.log('Updating Roles successful:', response.data);
            toast({
                title: "Employee Roles Updated", //
                // description: "Friday, February 10, 2023 at 5:57 PM"
                variant: "success"
            })
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className='rounded-sm border-gray-300 border p-4 my-4'>
            <div className='flex items-center justify-between'>
                <h2 className='font-semibold text-lg'>Roles</h2>
                {isEdit
                    ? <Button className="rounded-none px-5 py-1" onClick={() => setIsEdit(false)}>Cancel</Button>
                    : <Button className="rounded-none px-5 py-1" onClick={() => setIsEdit(true)}>Edit</Button>
}

            </div>

            <div className='my-4'>
                <p className='font-semibold text-gray-700 flex'></p>
                <div className='flex items-center'>
                    {/* {
                        params?.id
                    } */}
                    {data
                        ?.map((e, _i) => (
                            <div
                                className=''
                                key={_i}>
                                
                                {isEdit  && <Fragment>
                                    {
                                        !e.disable ? 
                                        (<div   onClick={() => handleDeleteSelectedRoles(e.name,true)} className='w-max mr-5 px-4 py-1 flex items-center ml-2 mt-1 border border-black bg-blue-300 font-semibold '>
                                            <p>{e.name}</p>
                                            {/* <div
                                                onClick={() => handleDeleteSelectedRoles(e.name,false)}
                                            ></div> */}
                                            <ion-icon name="close-outline" style={{fontSize:"20px"}}></ion-icon>
                                            </div>
                                        ) :
                                        (<div onClick={() => handleDeleteSelectedRoles(e.name, false)} className='w-max mr-5 px-4 py-1 flex items-center ml-2 mt-1 border border-black bg-red-600 text-white font-semibold'>
                                            <p className='mr-5'>{e.name}</p>
                                            {/* <div
                                            name="eye-outline"
                                            style={{
                                            fontSize: "18px",
                                            color: "red"
                                        }}  onClick={() => handleDeleteSelectedRoles(e.name, true)}></div> */}
                                        <ion-icon name="checkmark-done-outline" style={{fontSize:"20px"}}></ion-icon>
                                        </div>
                                        )
                                    }
                                </Fragment>
}
                            </div>
                        ))
}
                </div>
            </div>

            {isEdit && <div className='mt-10 border rounded-lg p-4 border-gray-600'>
                <p className='font-semibold text-black underline'>Add New Role</p>
                <form onSubmit={handleSubmit} action="" className='mt-3 grid '>
                    <div className='flex flex-col'>
                        {/* <div> */}
                        <Label className='font-semibold my-2'>Roles</Label>
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
                        {/* </div> */}
                    </div>

                    <div className='flex items-center '>
                        {roles && roles.map((e, i) => (
                            <div
                                className='px-3 mr-3 py-1 border w-max mt-2 rounded-2xl border-gray-400 text-gray-800 flex items-center'>
                                <span>{e}</span>
                                <ion-icon
                                    name="close-outline"
                                    style={{
                                    fontSize: "20px",
                                    marginLeft: "10px",
                                    color: "red",
                                    cursor: "pointer"
                                }}
                                    // onClick={() => handleDeleteSelectedRoles(e, i)}
                                    ></ion-icon>
                            </div>
                        ))
}

                    </div>
                    <Button className="rounded-none w-max px-5 py-1 mt-6">Add Roles</Button>
                </form>
            </div>
}

        </div>
    )
}

export default Roles
