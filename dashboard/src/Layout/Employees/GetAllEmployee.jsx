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
import { useQuery, useQueryClient } from 'react-query';

  

function GetAllEmployee() {
    const queryClient = useQueryClient()

    const getAll = async() => {
        const response = await axios.get('http://localhost:5000/api/employee/getAll'); // Replace with your API endpoint
        return response.data
    }

    const {data, refetch} = useQuery({
        queryKey:["getAllEmployees"], 
        queryFn:getAll,
        refetchOnReconnect: true,
        staleTime: 10 * 60 * 1000, 
        cacheTime: 20 * 60 * 1000 
    });

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
                {/* <TableHead className="text-right">Amount</TableHead> */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data && data?.map((emp, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell className="text-left">{emp?.role?.map((e, _i) => (
                        <span className="mx-2 px-2 rounded-lg bg-gray-200" key={_i}>{e.name}</span>
                    ))}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default GetAllEmployee
