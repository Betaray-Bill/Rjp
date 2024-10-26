import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import {setAllEmp} from '@/features/employeeSlice';
import axios from 'axios';
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
  

function GetTrainer() {
    const [trainer, setTrainer] = useState([])
    const dispatch = useDispatch()

    const getAll = async() => {
        const response = await axios.get('http://localhost:5000/api/employee/get-all-trainers'); // Replace with your API endpoint
        return response.data
    }

    const {data, refetch} = useQuery({
        queryKey:["getAllTrainers"], 
        queryFn:getAll,
    });

  return (
    <div>
        <div className='flex items-center justify-between'>
            <p onClick={() => refetch()} className="flex items-center bg-blue-100 border border-black rounded-md cursor-pointer px-[10px] w-max py-[3px] mb-4">
                <ion-icon name="sync-outline"></ion-icon>
                <span>Sync</span>
            </p>
            <Link to="/home/trainer/add">
                <Button>
                    <ion-icon name="add-outline" style={{fontSize:"20px"}}></ion-icon>
                    <span>Add Trainer</span>
                </Button>
            </Link>
        </div>
        <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
                <TableRow>
                    <TableHead>S.no</TableHead>
                    <TableHead className="">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    {/* <TableHead className="text-left">Edit</TableHead> */}
                    </TableRow>
            </TableHeader>
            <TableBody>
                {data?.trainers?.length>0 && data.trainers?.map((trainer, index) => (
                <TableRow key={index} onClick={() => {
                        console.log(`${index+1}.) ${trainer.email} `)
                    }}
                    className="cursor-pointer rounded-md"
                >
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell className="font-medium flex items-center">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className='ml-2'>{trainer.generalDetails.name}</span>
                    </TableCell>
                    <TableCell>{trainer.generalDetails.email}</TableCell>
                    <TableCell>{trainer.trainingDetails.trainerType}</TableCell>
                    <TableCell>
                        <Link to={`/home/trainer/view/${trainer._id}`}>
                            <Button className="bg-transparent border text-black rounded-none hover:bg-blue-200">View</Button>
                        </Link>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default GetTrainer
