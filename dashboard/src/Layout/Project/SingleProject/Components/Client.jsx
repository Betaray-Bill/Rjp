import {Checkbox} from '@/components/ui/checkbox'
import React, {useState} from 'react'
import Expense from './Expense';

function Client({expenses}) {
    const [isChecked,
        setIsChecked] = useState(false);

    const handleCheckboxChange = (checked) => {
        setIsChecked(checked);
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
                    <Checkbox checked={isChecked} onCheckedChange={handleCheckboxChange}/>

                    <h2 className='text-left text-black mb-[3px] ml-4'>Invoice Sent to Client</h2>
                </div>
            </div>

            {/* Expense */}
            <Expense expensesList={expenses}/>     
        </div>
    )
}

export default Client
