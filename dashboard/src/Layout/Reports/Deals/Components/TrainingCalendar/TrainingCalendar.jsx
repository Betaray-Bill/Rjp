import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import axios from 'axios';
import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Link } from 'react-router-dom';

function TrainingCalendar() {
    const [startDate,
        setStartDate] = useState("");
    const [endDate,
        setEndDate] = useState("");
    const {currentUser} = useSelector(state => state.auth);
    const [projects,
        setProjects] = useState([])
    //
    const submitHandler = async() => {
        const params = new URLSearchParams();

        try {
            if (startDate) 
                params.append("startDate", startDate);
            if (endDate) 
                params.append("endDate", endDate);
            
            const response = await axios.get(`http://localhost:5000/api/reports/calendar-view/${currentUser.employee._id}?${params.toString()}`);
            setProjects(response.data);

        } catch (err) {
            console.error("Error submitting form", err);
            // setError(err.message); setIsLoading(false); resetForm();
            // history.push('/login'); // Redirect to login page if login fails.
            return; // Exit the function if there is an error
        }
    }

    return (
        <div className='mt-5 border-t pt-2'>
            <div className='flex items-center justify-between'>
                <div className='font-semibold text-lg'>TrainingCalendar</div>
                <div className='flex items-center '>
                    <div className="text-sm mx-4">
                        {/* <Label htmlFor="startDate">Start Date</Label> */}
                        <Input
                            className="w-max"
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}/>
                    </div>
                    <div className="text-sm mx-4">
                        {/* <Label htmlFor="endDate">End Date</Label> */}
                        <Input
                            className="w-max"
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}/>
                    </div>
                    <Button onClick={submitHandler}>Search</Button>
                </div>
            </div>

            {projects && projects.length > 0 && (
                <Table className="mt-10">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">S.no</TableHead>
                            <TableHead>Training Name</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Start</TableHead>
                            <TableHead>End</TableHead>
                            <TableHead>View</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects
                            ?.map((e, _i) => (
                                <TableRow>
                                    <TableCell className="font-medium">{_i+1}</TableCell>
                                    <TableCell>{e.projectName}</TableCell>
                                    <TableCell>{e.company.name}</TableCell>
                                    <TableCell>{e.ownerDetails[0].name}</TableCell>
                                    <TableCell >{e.trainingDates.startDate.split("T")[0].split("-").reverse().join("-")}</TableCell>
                                    <TableCell >{e.trainingDates.endDate.split("T")[0].split("-").reverse().join("-")}</TableCell>
                                    <TableCell>
                                        <Link to={`/home/projects/view/${e._id}`} target='_blank' className='px-3 py-2 bg-blue-300'>View</Link>
                                    </TableCell>
                                </TableRow>
                            ))
}
                    </TableBody>
                </Table>

            )
}
        </div>
    )
}

export default TrainingCalendar
