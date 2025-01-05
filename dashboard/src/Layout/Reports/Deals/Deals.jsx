import React, { useState } from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { useNavigate } from 'react-router-dom'
import Revenue from './Components/Revenue/Revenue'
import TrainingCalendar from './Components/TrainingCalendar/TrainingCalendar'
import PaymentDue from './Components/PaymentDue'
import Forecast from './Components/Forecast'

function Deals() {
    const navigate = useNavigate()
    const [selectType, setSelectType] = useState("")
    return (
        <div className=''>
            <div>
                <button onClick={() => navigate(-1)} className='flex items-center mt-2 mb-4'>
                    <ion-icon name="arrow-back-outline"></ion-icon>
                    <span className='ml-2'>Go Back</span>
                </button>
            </div>
            <div className='flex items-center justify-between'>
                <div className='font-semibold text-lg'>
                    Deals
                </div>
                <div>
                    <Select onValueChange={(e) => setSelectType(e)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Reports"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Revenue">Revenue</SelectItem>
                            <SelectItem value="Forecast">Forecast</SelectItem>
                            <SelectItem value="Training Calendar">Training Calendar</SelectItem>
                            <SelectItem value="Payment Due">Payment Due</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
            </div>

            {/* Display the respective Report from Deals     */}

            {
                selectType === "Revenue" && <Revenue />
            }
            {
                selectType === "Training Calendar" && <TrainingCalendar />
            }
            {
                selectType === "Payment Due" && <PaymentDue />
            }

            {
                selectType === "Forecast" && <Forecast />
            }

        </div>
    )
}

export default Deals