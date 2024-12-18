import React from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { useNavigate } from 'react-router-dom'

function Deals() {
    const navigate = useNavigate()
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
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Reports"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Revenue">Revenue</SelectItem>
                            <SelectItem value="Deals Status">Deals Status</SelectItem>
                            <SelectItem value="Forecast">Forecast</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
            </div>

            {/* Display the respective Report from Deals */}

        </div>
    )
}

export default Deals
