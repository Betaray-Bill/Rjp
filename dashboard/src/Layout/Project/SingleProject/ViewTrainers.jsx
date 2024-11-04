import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function ViewTrainers({trainers}) {



  return (
    <div>
        {
            trainers.length > 0 ? 
            (
                <Table>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead>S.no</TableHead>
                            <TableHead className="">Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-left"></TableHead>
                            <TableHead className="text-left"></TableHead>
                            </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trainers?.length>0 && trainers?. map((trainer, index) => (
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
                                <TableCell>
                                    <ion-icon name="trash-outline"style={{color:"red", fontSize:"20px"}}></ion-icon>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : <div className=' text-center text-gray-600 my-8'>No Trainers are Added</div>
        }
    </div>
  )
}

export default ViewTrainers

