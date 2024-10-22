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
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import {setAllEmp} from '@/features/employeeSlice';
  

function GetAllEmployee() {
    const dispatch = useDispatch()

    const getAll = async() => {
        const response = await axios.get('http://localhost:5000/api/employee/getAll'); // Replace with your API endpoint
        return response.data
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
        <p onClick={() => refetch()} className="flex items-center bg-gray-100 border border-black rounded-md cursor-pointer px-[10px] w-max py-[3px]">
            <ion-icon name="sync-outline"></ion-icon>
            <span>Sync</span>
        </p>
        <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
                <TableRow>
                    <TableHead>S.no</TableHead>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    {/* <TableHead className="text-left">Edit</TableHead> */}
                    </TableRow>
            </TableHeader>
            <TableBody>
                {data && data?.map((emp, index) => (
                <TableRow key={index} onClick={() => {
                    console.log(`${index+1}.) ${emp.email}   `)
                }}>
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell className="text-left">{emp?.role?.map((e, _i) => (
                        <span className="mx-2 px-2 rounded-lg bg-gray-200" key={_i}>{e.name}</span>
                    ))}</TableCell>
                        {/* <TableCell className="font-medium cursor-pointer">
                            <DropdownMenu>
                                <DropdownMenuTrigger><ion-icon name="ellipsis-vertical-outline"></ion-icon></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Edit Profile</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Dialog>
                                            <DialogTrigger>Add Role</DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                <DialogTitle>Edi</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    </DropdownMenuItem>

    
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell> */}
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default GetAllEmployee
