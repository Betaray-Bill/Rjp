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

function RevenueResult({result}) {
    return (
        <div className='mt-5'>
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
                        <TableRow>
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
