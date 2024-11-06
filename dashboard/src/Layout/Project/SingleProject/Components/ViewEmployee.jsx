import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'


function ViewEmployee({employees}) {
  return (
    <div className='border rounded-md mt-8 py-4 px-3 shadow-sm'>
        <div className="flex items-center justify-between">
            <div  className='font-semibold'>
                Employees
            </div>
            <Button>Add Employee</Button>
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
                    <TableHead></TableHead>
                    {/* <TableHead className="text-left">Edit</TableHead> */}
                    </TableRow>
            </TableHeader>
            <TableBody>
                {employees && employees?.map((emp, index) => (
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
                    <TableCell>
                        <ion-icon name="trash-outline"style={{color:"red", fontSize:"20px"}}></ion-icon>
                    </TableCell>    
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default ViewEmployee
