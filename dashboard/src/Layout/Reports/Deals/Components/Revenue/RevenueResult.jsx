import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Replace with your Table components path
import { Button } from '@/components/ui/button'; // Replace with your Button component path
import * as XLSX from 'xlsx';

const RevenueResult = ({result}) => {


    const handleDownload = () => {
        // Prepare data for Excel
        const data = result.map((e, index) => ({
            "S.no": index + 1,
            // "Company": e.companyName,
            "Project Name": e.projectName,
            "Start Date": new Date(e.startDate).toLocaleDateString(),
            "End Date": new Date(e.endDate).toLocaleDateString(),
            "Company Name": e.companyName,
            "Mode of Training": e.modeOfTraining,
            "₹ Total Amount": e.totalAmount,
            "₹ Expenses": e.totalExpenses,
            "₹ Profit": e.netRevenue,
        }));

        // Add a row for totals
        data.push({
            "S.no": "Total",
            // "Project ID": "",
            "Project Name": "",
            "Start Date": "",
            "End Date": "",
            "Company Name": "",
            "Mode of Training": "",
            "₹ Total Amount": result.reduce((a, c) => a + c.totalAmount, 0),
            "₹ Expenses": result.reduce((a, c) => a + c.totalExpenses, 0),
            "₹ Profit": result.reduce((a, c) => a + c.netRevenue, 0),
        });

        // Create a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create a workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue");

        // Export to Excel
        XLSX.writeFile(workbook, "Revenue_Report.xlsx");
    };

    return (
        <div className="mt-5 px-5">
            {/* <h1 className="text-xl font-bold mb-4 text-center">Revenue Details</h1> */}
            <div className="flex items-center justify-end my-4">
                <Button onClick={handleDownload}>Download</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>S.no</TableHead>
                        {/* <TableHead>Company</TableHead> */}
                        <TableHead>Project Name</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Mode of Training</TableHead>
                        <TableHead>₹ Total Amount</TableHead>
                        <TableHead>₹ Expenses</TableHead>
                        <TableHead>₹ Profit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {result.map((e, index) => (
                        <TableRow key={e.projectId}>
                            <TableCell>{index + 1}</TableCell>
                            {/* <TableCell>{e.companyName}</TableCell> */}
                            <TableCell>{e.projectName}</TableCell>
                            <TableCell>{new Date(e.startDate).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(e.endDate).toLocaleDateString()}</TableCell>
                            <TableCell>{e.companyName}</TableCell>
                            <TableCell>{e.modeOfTraining}</TableCell>
                            <TableCell>₹ {e.totalAmount}</TableCell>
                            <TableCell>₹ {e.totalExpenses}</TableCell>
                            <TableCell>₹ {e.netRevenue}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell className="font-semibold">Total</TableCell>
                        {/* <TableCell></TableCell> */}
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="font-semibold">₹ {result.reduce((a, c) => a + c.totalAmount, 0)}</TableCell>
                        <TableCell className="font-semibold">₹ {result.reduce((a, c) => a + c.totalExpenses, 0)}</TableCell>
                        <TableCell className="font-semibold">₹ {result.reduce((a, c) => a + c.netRevenue, 0)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};

export default RevenueResult;
