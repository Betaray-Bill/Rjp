import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/utils/api';
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"


function Occupany() {
     
    const [startDate,
        setStartDate] = useState("");
    const [endDate,
        setEndDate] = useState("");
    const [projects,
        setProjects] = useState([]); 

    const {user} = useSelector(state => state.auth)


    const getData = async( ) => {
        // console.log(id._id)
        // if (id._id !== "" && id._id !== undefined || id._id !== null) {
            try {
                const params = new URLSearchParams();

                if (startDate) 
                    params.append("startDate", startDate);
                if (endDate) 
                    params.append("endDate", endDate);
                
                const response = await api.get(`/reports/trainer/occupancy/${user._id}?${params.toString()}`);
                const data = await response.data
                // setSelectedTrainer(data);
                setProjects(data)
                console.log(data )
            } catch (error) {
                console.error("Error fetching trainer details:", error);
            }
    };
    return (
        <div className=' mt-3 pt-2'>
            <div className='flex items-center justify-between mt-2'>
                <div className='font-semibold text-lg'>Occupancy</div>
                <div className="flex justify-start ">
                
                <Fragment>
                    <div className="mx-2">
                        <Input
                            className="w-max"
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}/>
                    </div>

                    <div className="mx-2">
                        <Input
                            className="w-max"
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}/>
                    </div>

                    <div className="mx-2">
                        <Button onClick={getData}>Submit</Button>
                    </div>

                </Fragment>
            </div>
            </div>

             {/* Table to display projects */}
      <div className="mt-5">
        {projects && projects?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Project Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow key={index}>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{project.domain}</TableCell>
                  <TableCell>
                    {new Date(project.trainingDates.startDate).toISOString().split('T')[0]} 
                  </TableCell>
                  <TableCell>
                  {new Date(project.trainingDates.endDate).toISOString().split('T')[0]} 

                  </TableCell>
                  <TableCell>{project.totalHours}</TableCell>
                  <TableCell>{project.companyName}</TableCell>
                  <TableCell>{project.projectOwner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-gray-500">No projects found.</div>
        )}
        </div>
        </div>

    )
}


export default Occupany