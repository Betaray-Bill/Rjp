// import React, {useState} from 'react' 
// import PendingPO from './PendingPO'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PendingPO from './PendingPO'
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import axios from 'axios';
import React, {useState} from 'react'
import {useSelector} from 'react-redux';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import PendingPayment from './PaymentPending';


function Pending() {
    const [selectType,
        setSelectType] = useState("")

 
    return (
        <div className='border-t mt-3 pt-2'>
            <div className='flex items-center justify-between mt-2'>
                <div className='font-semibold text-lg'>Pending</div>
                <div>
                    <Select onValueChange={(e) => setSelectType(e)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Pending"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                            <SelectItem value="Payment">Payment</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* <select name="" className='border p-2' id="" onChange={(e) => setSelectType(e)}>
                        <option value="Purchase Order">Purchase Order</option>
                        <option value="Payment">Payment</option>
                    </select> */}

                </div>
            </div>
        

         {selectType === "Purchase Order" && <PendingPO />
} 
{/* <PendingPO /> */}
            {selectType === "Payment" && <PendingPayment />
}   
 
        </div>

    )
}

export default Pending
