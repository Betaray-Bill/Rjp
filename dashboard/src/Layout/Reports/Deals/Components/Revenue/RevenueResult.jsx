import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx';

function RevenueResult({result}) {
    console.log(result)
    const handleDownload = () => {
        // Prepare data for Excel
        const data = result.map((e, index) => ({
            "S.no": index + 1,
            "Training Name": e.projectName.toUpperCase(),
            "₹ Total Amount": e.totalAmount,
            "₹ Expenses": e.totalExpenses,
            "₹ Profit": e.netRevenue,
        }));

        // Add a row for totals
        data.push({
            "S.no": "Total",
            "Training Name": "",
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
        <div className='mt-5'>
            <div className='flex items-center justify-end my-4'>
                <Button onClick={handleDownload}>Download</Button>
            </div>
            <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                    <TableRow>
                        <TableHead>S.no</TableHead>
                        <TableHead>Training Name</TableHead>
                        {/* <TableHead>Owner</TableHead> */}
                        <TableHead>₹ Total Amount</TableHead>
                        <TableHead>₹ Expenses</TableHead>
                        <TableHead>₹ Profit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {result && (result.map((e, _i) => (
                        <TableRow key={_i}>
                            <TableCell>{_i + 1}</TableCell>
                            <TableCell className="font-semibold">{e
                                    .projectName
                                    .toUpperCase()}</TableCell>
                            {/* <TableCell>Credit Card</TableCell> */}
                            <TableCell>₹ {e.totalAmount}</TableCell>
                            <TableCell>₹ {e.totalExpenses}</TableCell>
                            <TableCell>₹ {e.netRevenue}</TableCell>
                        </TableRow>
                    )))
}

                    <TableRow>
                        <TableCell className="font-semibold">Total </TableCell>
                        <TableCell> </TableCell>
                        {/* <TableCell>Credit Card</TableCell> */}
                        <TableCell  className="font-semibold">₹ {result.reduce((a, c) => a+ c.totalAmount, 0)} </TableCell>
                        <TableCell  className="font-semibold">₹ {result.reduce((a, c) => a+ c.totalExpenses, 0)}</TableCell>
                        <TableCell  className="font-semibold">₹ {result.reduce((a, c) => a+ c.netRevenue, 0)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

        </div>
    )
}

export default RevenueResult
