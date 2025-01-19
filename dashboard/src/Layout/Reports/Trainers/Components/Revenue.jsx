import React, {Fragment, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
// import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import axios from "axios";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
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
import * as XLSX from 'xlsx';
import {useToast} from "@/hooks/use-toast";
import api from "@/utils/api";

function Revenue() {
    const {toast} = useToast()
    const [searchQuery,
        setSearchQuery] = useState("");
    const [recommendations,
        setRecommendations] = useState([]);
    const [selectedTrainer,
        setSelectedTrainer] = useState(null);
    const [debouncedQuery,
        setDebouncedQuery] = useState("");
    const [startDate,
        setStartDate] = useState("");
    const [endDate,
        setEndDate] = useState("");
    const [projects,
        setProjects] = useState([]);

    const [id, setId] = useState("")

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300); // Wait 300ms after the last keystroke

        return () => {
            clearTimeout(handler); // Clear timeout if the user types again
        };
    }, [searchQuery]);

    // Fetch recommendations whenever the debouncedQuery changes
    useEffect(() => {
        if (debouncedQuery) {
            fetchRecommendations(debouncedQuery);
        } else {
            setRecommendations([]);
        }
    }, [debouncedQuery]);

    const fetchRecommendations = async(query) => {
        if (query) {
            try {
                const response = await api.get(`/reports/search?query=${query}`);

                const data = await response.data;
                setRecommendations(data);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        }
    };

    const fetchTrainerDetails = async(trainerId) => {
        console.log(trainerId)
        if (trainerId !== "" && trainerId !== undefined || trainerId !== null) {
            try {
                const params = new URLSearchParams();

                if (startDate) 
                    params.append("startDate", startDate);
                if (endDate) 
                    params.append("endDate", endDate);
                
                const response = await api.get(`/reports/trainer/get-revenue/${trainerId}?${params.toString()}`);
                const data = await response.data
                // setSelectedTrainer(data);
                setProjects(data[0].projects)
                console.log(data[0].projects)
            } catch (error) {
                console.error("Error fetching trainer details:", error);
            }
        } else {
            toast({title: "Select Trainer", variant:"primary"})
        }
    };


    const getData = async( ) => {
        console.log(id._id)
        if (id._id !== "" && id._id !== undefined || id._id !== null) {
            try {
                const params = new URLSearchParams();

                if (startDate) 
                    params.append("startDate", startDate);
                if (endDate) 
                    params.append("endDate", endDate);
                
                const response = await api.get(`/reports/trainer/get-revenue/${id._id}?${params.toString()}`);
                const data = await response.data
                // setSelectedTrainer(data);
                setProjects(data[0].projects)
                console.log(data[0].projects)
            } catch (error) {
                console.error("Error fetching trainer details:", error);
            }
        } else {
            toast({title: "Select Trainer", variant:"primary"})
        }
    };

    // console.log(projects)

    const handleDownload = () => {
        // Prepare data for Excel
        const data = projects.map((e, index) => ({
            "S.no": index + 1,
            "Training Name": e
                .projectName
                .toUpperCase(),
            "Company": e.totalAmount,
            "Training Days": e.trainingDays,
            "Revenue": e.totalExpenses,
            "Expenses": e.totalExpenses,
            "Profit": e.totalExpenses
        }));

        // Add a row for totals
        data.push({
            "S.no": "Total",
            "Training Name": "",
            "Company": "",
            "Training Days": projects
                ?.reduce((a, c) => a + c.trainingDays, 0),
            "Revenue": projects
                ?.reduce((a, c) => a + c.amount, 0),
            "Expenses": projects
                ?.reduce((a, c) => a + c.totalExpenses, 0),
            "Profit": projects
                ?.reduce((a, c) => a + c.profit, 0)
        });

        // Create a worksheet
        const worksheet = XLSX
            .utils
            .json_to_sheet(data);

        // Create a workbook and add the worksheet
        const workbook = XLSX
            .utils
            .book_new();
        XLSX
            .utils
            .book_append_sheet(workbook, worksheet, "Revenue");

        // Export to Excel
        XLSX.writeFile(workbook, "Trainer Report");
    };

    return (
        <div className=" mt-5">
            <h2 className="my-4 font-medium">Revenue Report for Trainers</h2>
            <div className="flex justify-start ">
                <div
                    className="flex w-[400px] justify-between items-center border px-2 border-gray-400 rounded-sm">
                    <Input
                        placeholder="Search by name, trainerId, or email..."
                        value={searchQuery}
                        className="border-none rounded-sm"
                        onChange={(e) => {
                        setSearchQuery(e.target.value);
                        fetchRecommendations(e.target.value);
                    }}/>
                    <div
                        onClick={() => {
                        setSearchQuery('');
                        setRecommendations([])
                    }}
                        className="cursor-pointer mt-1">
                        <ion-icon
                            name="close-outline"
                            style={{
                            fontSize: "22px"
                        }}></ion-icon>
                    </div>
                </div>
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
            {recommendations.length > 0 && (
                <div className="mt-2 border rounded-md py-2 px-1 w-[400px]">
                    {recommendations.map((trainer) => (
                        <div
                            key={trainer._id}
                            className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                            onClick={() => {
                            fetchTrainerDetails(trainer._id);
                            setRecommendations([])
                            setId(trainer)
                            setSearchQuery('')

                        }}>
                            {trainer.trainerId}
                            - {trainer.generalDetails.name}
                        </div>
                    ))}
                </div>
            )}

            {projects && projects !== null && projects
                ?.length > 0 && (
                    <div className="my-5">
                        <div>
                            <div className="flex items-center justify-end">
                                <Button onClick={handleDownload}>Download</Button>
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