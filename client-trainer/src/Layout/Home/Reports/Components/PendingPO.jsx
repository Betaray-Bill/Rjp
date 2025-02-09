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
    TableRow,
  } from "@/components/ui/table"
import api from '@/utils/api';
  
 
function PendingPO() {
    const [startDate,
        setStartDate] = useState("");
    const [endDate,
        setEndDate] = useState("");
    // const {currentUser} = useSelector(state => state.auth);
    const [projects,
        setProjects] = useState([])
    //
    const {user} = useSelector(state => state.auth)
    console.log(user)
    const submitHandler = async() => {
        const params = new URLSearchParams();

        try {
            if (startDate) 
                params.append("startDate", startDate);
            if (endDate) 
                params.append("endDate", endDate);

            console.log(params.toString())
            const response = await api.get(`/reports/trainer/pending/po/${user._id}/?${params.toString()}`);
            setProjects(response.data);
            console.log(response.data)

        } catch (err) {
                console.error("Error submitting form", err);
                // setError(err.message); setIsLoading(false); resetForm();
                // history.push('/login'); // Redirect to login page if login fails.
            return; // Exit the function if there is an error
        }
    }
    return (
        <div className='mt-2 pt-2'>
            <div className='flex items-center justify-between'>
                <div className='font-semibold'>Pending Purchase Order</div>
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

            <Table className="mt-10">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">S.no</TableHead>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Trainer Name</TableHead>
                        <TableHead>Owner</TableHead>
                        {/* <TableHead>Actions</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects
                        ?.map((e, _i) => (
                            <TableRow key={e.projectId}>
                                <TableCell className="font-medium">{_i + 1}</TableCell>
                                <TableCell>{e.projectName}</TableCell>
                                <TableCell>{e.trainerName}</TableCell>
                                <TableCell>{e.projectOwner
                                        ?.name}</TableCell>
                                <TableCell>
                                    {/* <Button
                                        onClick={() => console.log(`Project ID: ${e.projectId}`)}
                                        className="px-3 py-2 bg-blue-500 text-white rounded">
                                        Action
                                    </Button> */}
                                    {/* <Link to={`/home/project/${e.projectId}`} target='_blank' className='px-3 py-2 bg-blue-300'>View</Link> */}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

        </div>
    )
}

export default PendingPO
