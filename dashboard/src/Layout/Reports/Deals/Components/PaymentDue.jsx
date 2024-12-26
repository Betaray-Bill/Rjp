import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import axios from 'axios';
import React, {Fragment, useEffect, useState} from 'react'
import {useSelector} from 'react-redux';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import Payable from './Payable';
import Receivable from './Receivable';

function PaymentDue() {
    const [type, setType] = useState('')

    return (
        <div>
            <div className='mt-5 border-t pt-2'>
                <div className='flex items-center justify-between'>
                    <div className='font-semibold text-lg'>Payment Due</div>
                    <div>
                        <Select onValueChange={(e) => setType(e)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Due"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Payable">Payable</SelectItem>
                                <SelectItem value="Receivable">Receivable</SelectItem>
                                {/* <SelectItem value="Training Calendar">Training Calendar</SelectItem>
                            <SelectItem value="Payment Due">Payment Due</SelectItem> */}
                            </SelectContent>
                        </Select>

                    </div>
                </div>
            </div>

            {/* Display the respective Report from Deals     */}
            {
                type === "Payable" && <Payable />
            }

            {
                type === "Receivable" && <Receivable />
            }

        </div>
    )
}

export default PaymentDue
