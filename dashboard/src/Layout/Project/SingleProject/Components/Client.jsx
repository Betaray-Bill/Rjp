import {Checkbox} from '@/components/ui/checkbox'
import React, {useState} from 'react'
import Expense from './Expense';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {useQueryClient} from 'react-query';
import {useToast} from '@/hooks/use-toast';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function Client({expenses, clientDetails}) {
    const projectId = useParams()
    const queryClient = useQueryClient()
    const {toast} = useToast()
    const [isChecked,
        setIsChecked] = useState(clientDetails.invoiceSent);

    const [data,setData] = useState({
        amount:clientDetails.amount ? clientDetails.amount : "",
        dueDate: clientDetails.dueDate ? new Date(clientDetails.dueDate) : ""
    })

    const handleCheckboxChange = async(checked) => {
        setIsChecked(checked);
        try {
            const response = await axios.put(`http://localhost:5000/api/project/update-client-invoice/project/${projectId.projectId}`, {

            })
            const result = await response.data
            console.log(result)
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]);
            toast({title: "Remainder saved successfully", variant: "success", duration: 2000})
            // alert("Remainder saved successfully!"); setDate(""); setRemarks("");
            // setIsCompleted(false); if (onSuccess) onSuccess(result);
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving the remainder.");
        } finally {
            setLoading(false);
        }

        console.log(checked)
    };

    const handleSubmitChange = async() => {
        // setIsChecked(checked);

        try {
            const response = await axios.put(`http://localhost:5000/api/project/update-client-amount/project/${projectId.projectId}`, {
                ...data
            })
            const result = await response.data
            console.log(result)
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]);
            toast({title: "Remainder saved successfully", variant: "success", duration: 2000})
            // alert("Remainder saved successfully!"); setDate(""); setRemarks("");
            // setIsCompleted(false); if (onSuccess) onSuccess(result);
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving the remainder.");
        } finally {
            setLoading(false);
        }

        // console.log(checked)
    };
    return (
        <div
            className='border my-5 rounded-md px-4 py-2 drop-shadow-sm border-gray-300'>
            <div className='font-semibold text-md my-4'>
                Client
            </div>

            {/* Invoice Sent */}
            <div className='border border-gray-300 rounded-md my-2 px-3 font-semibold py-2'>
                <div className='flex items-center justify-start'>
                    {isChecked
                        ? <ion-icon
                                name="checkmark-done-outline"
                                style={{
                                color: "green",
                                fontSize: "22px"
                            }}></ion-icon>
                        : <Checkbox
                            checked={isChecked}
                            onCheckedChange={handleCheckboxChange}
                            className=""/>
}

                    <h2 className='text-left text-black mb-[3px] ml-4'>Invoice Sent to Client</h2>
                </div>
            </div>

            <div className='border border-gray-300 rounded-md my-2 px-3 font-semibold py-2'>
                <div className='flex items-center'>
                    <div>
                        <Label>Amount</Label>
                        <Input type="text" value={data.amount} name="amount" onChange={(e) => setData({...data, amount:e.target.value})}/>
                    </div>
                    <div className='ml-4'>
                        <Label>Due Date</Label>
                        <Input type="date" value={new Date(data?.dueDate) ? new Date(data?.dueDate) : null}  onChange={(e) => setData({...data, dueDate:e.target.value})}/>
                    </div>
                </div>
                <Button className="mt-3" onClick={handleSubmitChange}>Submit</Button>
            </div>

            {/* Expense */}
            <Expense expensesList={expenses}/>
        </div>
    )
}

export default Client
