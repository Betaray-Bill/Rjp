import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {setAllEmp} from '@/features/employeeSlice';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import api from '@/utils/api';
  

function GetAllEmployee() {
    const dispatch = useDispatch()
    const {currentUser} = useSelector(state => state.auth)

    const getAll = async() => {
        const response = await api.get('/employee/getAll')
        // , {
            // withCredentials: true, // Ensures cookies are included in the request
            // headers: {
            //     Authorization: token ? `Bearer ${token}` : '', // Set the token, if available
            // },
        //   });
          console.log(response.data)
          return response.data;
    }

    const {data, refetch} = useQuery({
        queryKey:["getAllEmployees"], 
        queryFn:getAll,
    });

    console.log(data)
    if(data){
        dispatch(setAllEmp(data))
    }

  return (
    <div>
        <div className='flex items-center justify-between'>
            <p onClick={() => refetch()} className="flex items-center bg-blue-100 border border-black rounded-md cursor-pointer px-[10px] w-max py-[3px] mb-4">
                <ion-icon name="sync-outline"></ion-icon>
                <span>Sync</span>
            </p>
            <Link to="/home/employee/add">
                <Button>
                    <ion-icon name="add-outline" style={{fontSize:"20px"}}></ion-icon>
                    <span>Add Employee</span>
                </Button>
            </Link>
        </div>
        <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
                <TableRow>
                    <TableHead>S.no</TableHead>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead></TableHead>
                    {/* <TableHead className="text-left">Edit</TableHead> */}
                    </TableRow>
            </TableHeader>
            <TableBody>
                {data && data?.map((emp, index) => (
                <TableRow key={index} onClick={() => {
                    console.log(`${index+1}.) ${emp.email}   `)
                }}>
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell className="font-medium flex items-center">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className='ml-2'>{emp.name}</span>
                    </TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell className="text-left">{emp?.role?.map((e, _i) => (
                        <span className="mx-2 px-2 rounded-lg bg-blue-100" key={_i}>{e.name}</span>
                    ))}</TableCell>
                    <TableCell>
                        <Link to={`/home/employee/view/${emp._id}`}>
                            <Button className="bg-transparent text-black border border-black rounded-none hover:bg-blue-100">View</Button>
                        </Link>
                    </TableCell>
                        
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default GetAllEmployee
