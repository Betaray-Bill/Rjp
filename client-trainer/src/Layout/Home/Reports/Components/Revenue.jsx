import React, {Fragment, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
// import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import axios from "axios";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {Button} from '@/components/ui/button'
// import * as XLSX from 'xlsx';
// import {useToast} from "@/hooks/use-toast";
import api from "@/utils/api";
import { useSelector } from "react-redux";

function Revenue() {
 
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
                
                const response = await api.get(`/reports/trainer/get-revenue/${user._id}?${params.toString()}`);
                const data = await response.data
                // setSelectedTrainer(data);
                setProjects(data[0].projects)
                console.log(data[0].projects)
            } catch (error) {
                console.error("Error fetching trainer details:", error);
            }
    };

    // console.log(projects)

    // const handleDownload = () => {
    //     // Prepare data for Excel
    //     const data = projects.map((e, index) => ({
    //         "S.no": index + 1,
    //         "Training Name": e
    //             .projectName
    //             .toUpperCase(),
    //         "Company": e.totalAmount,
    //         "Training Days": e.trainingDays,
    //         "Revenue": e.totalExpenses,
    //         "Expenses": e.totalExpenses,
    //         "Profit": e.totalExpenses
    //     }));

    //     // Add a row for totals
    //     data.push({
    //         "S.no": "Total",
    //         "Training Name": "",
    //         "Company": "",
    //         "Training Days": projects
    //             ?.reduce((a, c) => a + c.trainingDays, 0),
    //         "Revenue": projects
    //             ?.reduce((a, c) => a + c.amount, 0),
    //         "Expenses": projects
    //             ?.reduce((a, c) => a + c.totalExpenses, 0),
    //         "Profit": projects
    //             ?.reduce((a, c) => a + c.profit, 0)
    //     });

    //     // Create a worksheet
    //     const worksheet = XLSX
    //         .utils
    //         .json_to_sheet(data);

    //     // Create a workbook and add the worksheet
    //     const workbook = XLSX
    //         .utils
    //         .book_new();
    //     XLSX
    //         .utils
    //         .book_append_sheet(workbook, worksheet, "Revenue");

    //     // Export to Excel
    //     XLSX.writeFile(workbook, "Trainer Report");
    // };

    return (
        <div className=" mt-5">
            <h2 className="my-4 font-medium">Revenue Report for Trainers</h2>
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
            {projects && projects !== null && projects
                ?.length > 0 && (
                    <div className="my-5">
                        <div>
                            <div className="flex items-center justify-end">
                                {/* <Button onClick={handleDownload}>Download</Button> */}
                            </div>
                        </div>
                        <Table>
                            {/* Table Header */}
                            <TableHeader>
                                <TableRow>
                                    <TableCell>S.No</TableCell>
                                    <TableCell>Project Name</TableCell>
                                    <TableCell>Company</TableCell>
                                    <TableCell>Training Days</TableCell>
                                    <TableCell>Revenue</TableCell>
                                    <TableCell>Expenses</TableCell>
                                    <TableCell>Profit</TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody>
                                {projects
                                    ?.map((project, index) => (
                                        <TableRow key={project.projectId}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{project.projectName}</TableCell>
                                            <TableCell>{project.company}</TableCell>
                                            <TableCell>{project.trainingDays}</TableCell>
                                            <TableCell>{project.amount
}</TableCell>
                                            <TableCell>{project.totalExpenses
}</TableCell>
                                            <TableCell>{project.profit
}</TableCell>
                                        </TableRow>
                                    ))}
                                <TableRow className="font-semibold">
                                    <TableCell>Total
                                    </TableCell>
                                    <TableCell></TableCell>

                                    <TableCell></TableCell>

                                    <TableCell>{projects
                                            ?.reduce((a, c) => a + c.trainingDays, 0)}</TableCell>

                                    <TableCell>{projects
                                            ?.reduce((a, c) => a + c.amount, 0)}</TableCell>
                                    <TableCell>{projects
                                            ?.reduce((a, c) => a + c.totalExpenses, 0)}</TableCell>
                                    <TableCell>{projects
                                            ?.reduce((a, c) => a + c.profit, 0)}</TableCell>

                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )
}

        </div>
    )
}

export default Revenue