import React, {useState} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import PendingPO from './PendingPO'
import PendingPayment from './PendingPayment'

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

                </div>
            </div>

            {selectType === "Purchase Order" && <PendingPO />
}

            {selectType === "Payment" && <PendingPayment />
}   
        </div>

    )
}

export default Pending
