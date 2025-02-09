import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import Pending from './Components/Pending';
import Revenue from './Components/Revenue';
import Occupany from './Components/Occupany';
// import Pending from './Components/Pending';

function Reports() {
     
    const [selectType, setSelectType] = useState("Occupancy")
    const {user} = useSelector(state => state.auth)

    return (
    <div className='p-4 ml-2'>

        <div className='flex items-center justify-between'>
                <div className='font-semibold text-lg'>
                    Trainers Report
                </div>
                <div>
                    <Select onValueChange={(e) => setSelectType(e)} value={selectType}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Reports"/>
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Occupancy">Occupancy</SelectItem>

                            <SelectItem value="Pending">Pending</SelectItem>
                            {
                                user && user.trainingDetails.trainerType !== "Internal" && <SelectItem value="Revenue">Revenue</SelectItem>
                            }
                            {/* <SelectItem value="Trainer Calendar">Trainer Calendar</SelectItem> */}
                            {/* <SelectItem value="Calendar View">Calendar View</SelectItem> */}
                        </SelectContent>
                    </Select>

                </div>
        </div>
        {
                selectType === "Pending" && <Pending />
            }
             {
                selectType === "Revenue" && <Revenue />
            }

{
                selectType === "Occupancy" && <Occupany />
            }
            {/* {
                selectType === "Calendar View" && <TrainerCalendar />
            }
            {
                selectType === "Revenue" && <Revenue />
            } */}

    </div>
    )

}

export default Reports;