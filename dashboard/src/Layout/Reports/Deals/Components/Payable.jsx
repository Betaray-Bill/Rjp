import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import axios from 'axios';
import React, {Fragment, useEffect, useState} from 'react'
import {useSelector} from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import api from '@/utils/api';

function Payable() {
    const {currentUser} = useSelector(state => state.auth)
    const [startDate,
        setStartDate] = useState("");
    const [endDate,
        setEndDate] = useState("");

    const [expenses,
        setExpenses] = useState([])

    const fetchPaymentDuePayable = async() => {
        // Fetch client data from API
        try {
            const params = new URLSearchParams();

            if (startDate) 
                params.append("startDate", startDate);
            if (endDate) 
                params.append("endDate", endDate);
            
            const response = await api.get(`/reports/payment-due/payable/${currentUser
                ?.employee._id}?${params.toString()}`);
            const data = await response.data;
            console.log(data)
            // setKamData(data);
            setExpenses(data);

        } catch (error) {
            console.error('Error:', error);
        }
    }
    return (
        <div>
            <div className='flex items-center mt-5'>
                {/* <div>Payable</div> */}
                <div className="text-sm mx-r-4">
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
                <Button onClick={fetchPaymentDuePayable}>Search</Button>
            </div>

            {expenses && expenses.length > 0
                ? (
                    <Table className="mt-5">
                        <TableHeader>
                            <TableRow>
                                <TableHead>S.no</TableHead>
                                <TableHead>Project Name</TableHead>
                                <TableHead>Expense Name</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Ageing
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.map((expense, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{expense.projectName}</TableCell>
                                    <TableCell>{expense.expenseName}</TableCell>
                                    <TableCell>{expense.amount}</TableCell>
                                    <TableCell>{new Date(expense.dueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{Math.ceil((new Date() - new Date(expense.dueDate)) / (1000 * 60 * 60 * 24))}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )
                : null
}
        </div>
    )
}

export default Payable