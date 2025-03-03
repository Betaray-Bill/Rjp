import api from '@/utils/api'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
  

function OnGoingPoject(){
    const {currentUser} = useSelector(state => state.auth)

    useEffect(() => {
        fetchData()
    }, [])
    const [result, setResult] = useState([])

    const fetchData = async() => {
        try{
            const rsponse = await api.get(`/project/ongoing/${currentUser.employee._id}`);
            const res = await rsponse.data;
            setResult(res)
            console.log(res)
        }catch(err){
            console.log(err)
        }
    }


    return (
        <div className='mt-5 p-4 '>
            <div className='flex items-center justify-between'>
                <div className='font-semibold flex items-center '>
                    <ion-icon name="bar-chart-outline" style={{ fontSize: "23px" }}></ion-icon>
                    <span className='ml-2 text-lg'>In Progress Deals</span>
                </div>
            </div>

            <div>
                {
                    result && result.length > 0 ? (
                        <div className='mt-5'>  
                            <Table>
                                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>S.no</TableHead>
                                    <TableHead>Training Name</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {
                                        result?.map((e, _i) => (
                                            
                                    <TableRow key={_i}>
                                    <TableCell className="font-medium">{_i+1}</TableCell>
                                    <TableCell>{e.projectName}</TableCell>
                                    <TableCell>{e.trainingDates.startDate.split('T')[0]}</TableCell>
                                    <TableCell>{e.trainingDates.endDate.split('T')[0]}</TableCell>
                                    <TableCell>
                                        <Link to={`/home/projects/view/${e._id}`}>
                                            <p className='px-3 py-2 bg-black text-white w-max'>View</p>
                                        </Link>
                                    </TableCell>
                                    </TableRow> 
                                        ))
                                    }

                                </TableBody>
                            </Table>

                        </div>
                    ) : <div className='font-light flex justify-center my-'>
                        <p>No Deals In-progress</p>
                    </div>
                }
            </div>
        </div>

    )
}


export default OnGoingPoject