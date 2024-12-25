import React, { useState } from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { useNavigate } from 'react-router-dom'
import Pending from './Components/Pending'
import TrainerCalendar from './Components/TrainerCalendar'
// import Revenue from './Components/Revenue/Revenue'
// import TrainingCalendar from './Components/TrainingCalendar/TrainingCalendar'


function Trainers() {
  
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
                    Trainers Report
                </div>
                <div>
                    <Select onValueChange={(e) => setSelectType(e)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Reports"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Revenue">Revenue</SelectItem>
                            {/* <SelectItem value="Trainer Calendar">Trainer Calendar</SelectItem> */}
                            <SelectItem value="Calendar View">Calendar View</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
            </div>

            {/* Display the respective Report from Deals     */}
            {
                selectType === "Pending" && <Pending />
            }
            {
                selectType === "Calendar View" && <TrainerCalendar />
            }
            {/* {
                selectType === "Revenue" && <Revenue />
            }
            {
                selectType === "Training Calendar" && <TrainingCalendar />
            }
            {
                selectType === "Calendar View" && <CalendarView />
            }
  */}

        </div>
  )
}

export default Trainers
