import {Input} from '@/components/ui/input'
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Link } from 'react-router-dom'

function RemainderSection() {

    const [startDate,
        setStartDate] = useState(new Date().toISOString().split("T")[0])
    const [endDate,
        setEndDate] = useState()

    useEffect(() => {
        if (startDate && endDate && startDate < endDate) {
            fetchData()
        }else{
            console.log("object")
          fetchData()
        }

    }, [startDate, endDate])

    const [data,
        setData] = useState([])

    const fetchData = async() => {
        if (!startDate) 
            return

        try {
            let query = ""
            if(startDate) query = query + `startDate=${startDate}`
            if(endDate) query = query + `&endDate=${endDate}`
            console.log(query)
            const response = await axios.get(`http://localhost:5000/api/project/remainders?${query}`)
            const data = await response.data
            console.log(data)
            setData(data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='mt-5 p-4 '>
            <div className='flex items-center justify-between'>

                <div className='font-semibold flex items-center '>
                    <ion-icon
                        name="time-outline"
                        style={{
                        fontSize: "23px"
                    }}></ion-icon>
                    <span className='ml-2 text-lg'>Remainders</span>
                </div>

                <div className='flex items-center'>
                    <div>
                        <Input
                            type="date"
                            className="w-max"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            onClick={() => fetchData()}/>
                    </div>
                    <div className='mx-4'>
                        <Input
                            type="date"
                            className="w-max"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}/>
                    </div>
                </div>
            </div>
            {data && data.length > 0 ? (
                <Table className="mt-3">
                    <TableHeader>
                        <TableRow>
                            <TableHead>S.no</TableHead>
                            <TableHead>Training</TableHead>
                            <TableHead>Stage</TableHead>
                            <TableHead className="flex items-center">
                                <ion-icon name="calendar-outline"></ion-icon>
                                <span className='ml-1'>Due Date</span>
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>View</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data
                            ?.map((item, _i) => (
                                <TableRow>
                                    <TableCell className="font-medium">{_i + 1}</TableCell>
                                    <TableCell>{item.projectName}</TableCell>
                                    <TableCell className="flex-wrap">{item.stages}</TableCell>
                                    <TableCell>{item
                                            .remainders[0]
                                            .date
                                            .split("T")[0]
                                            .split("-")
                                            .reverse()
                                            .join("-")}
                                    </TableCell>
                                    <TableCell>{item.remainders[0].description}</TableCell>
                                    <TableCell>
                                      <Link to={`/home/projects/view/${item._id}`} target='_blank' className='border border-blue-800 bg-blue-800 text-white px-3 py-2'>Open</Link>
                                    </TableCell>

                                </TableRow>
                            ))
}
                    </TableBody>
                </Table>

            ) : <div className='text-center italic text-gray-600 font-light mt-5'>No Remainders Today</div>
}
        </div>
    )
}

export default RemainderSection
