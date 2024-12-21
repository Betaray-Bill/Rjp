import {Checkbox} from '@/components/ui/checkbox'
import React, {useState} from 'react'
import Expense from './Expense';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { useToast } from '@/hooks/use-toast';

function Client({expenses, invoiceSentClient}) {
    const projectId = useParams()
    const queryClient = useQueryClient()
    const {toast} = useToast()
    const [isChecked,
        setIsChecked] = useState(invoiceSentClient);

    const handleCheckboxChange = async(checked) => {
        setIsChecked(checked);
        try {
            const response = await axios.put(`http://localhost:5000/api/project/update-client-invoice/project/${projectId.projectId}`)
            const result = await response.data
            console.log(result)
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]);
            toast({
                title: "Remainder saved successfully", variant: "success",
                duration: 2000
            })
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
    return (
        <div
            className='border my-5 rounded-md px-4 py-2 drop-shadow-sm border-gray-300'>
            <div className='font-semibold text-md my-4'>
                Client
            </div>

            {/* Invoice Sent */} 
            <div className='border border-gray-300 rounded-md my-2 px-3 font-semibold py-2'>
                <div className='flex items-center justify-start'>
                   {
                    invoiceSentClient ? <ion-icon name="checkmark-done-outline" style={{color:"green", fontSize:"22px"}}></ion-icon> : <Checkbox checked={isChecked} onCheckedChange={handleCheckboxChange} className=""/>
                   }

                    <h2 className='text-left text-black mb-[3px] ml-4'>Invoice Sent to Client</h2>
                </div>
            </div>

            {/* Expense */}
            <Expense expensesList={expenses}/>     
        </div>
    )
}

export default Client
