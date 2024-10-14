import React, {useState} from 'react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import axios from 'axios'

function CalendarDate({eventsDate}) {
    const [newEvent, setNewEvent] = useState({
        title: "",
        start: "",
        end: "",
    });

    const [date, setDate] = useState()
    console.log(date)

    // console.log(events, eventsDate)
  const convertToTime = (time) => {
    let val = time.getTime();
    const res = new Date(val);
    console.log(res.toUTCString().split(" ")[4]);
    return res.toUTCString().split(" ")[4];
  };

  // Function to check if the new event overlaps with existing events
  const isOverlapping = (start, end) => {
    console.log(start, end);
    console.log("---------------------------");
    return eventsDate.some((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const newStart = new Date(start);
      const newEnd = new Date(end);

      // New Event Time
      let newStartTime = convertToTime(newStart);
      let newEndTime = convertToTime(newEnd);

      // Old Event time
      let OldStartTime = convertToTime(eventStart);
      let OldEndTime = convertToTime(eventEnd);

      // Check if the new event overlaps with the existing event
      return (
        (newStart < eventEnd &&
          newEnd > eventStart &&
          newStartTime >= OldStartTime &&
          newStartTime < OldEndTime) ||
        (newEnd > OldStartTime && newEndTime <= OldEndTime) || // New end time is within an existing event
        (newStartTime <= OldStartTime && newEnd >= OldEndTime)
        // New event completely overlaps an existing event
      );
    });
  };

  // Handle form submission
  axios.defaults.withCredentials = true;
  const handleSubmit = async(e) => {
    e.preventDefault();

    const { title, start, end } = newEvent;

    if (!title || !start || !end) {
      alert("Please fill all fields.");
      return;
    }

    if (new Date(start) >= new Date(end)) {
      alert("End time must be after the start time.");
      return;
    }

    if (isOverlapping(start, end)) {
      console.log("Event details:", start, end);

      alert(
        "This event overlaps with an existing event. Please choose a different time."
      );
      return;
    }else{
      // post it in the API 
      try{
        const res = await axios.post(`http://localhost:5000/api/trainer/trainingDates/${data._id}`, newEvent)
        console.log(res.data)
        if(res){
        //   getTrainerDetails()
        }
      }catch(err){
        console.log(err)
      }
      // render the state to update it
    }
    setNewEvent({ title: "", start: "", end: "" });
  };

  return (
    <div>

        Calendaer Date Changes
        <Popover Popover>
            <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                >
                    <ion-icon name="calendar-outline" className="mr-2 h-4 w-4" ></ion-icon>
                {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                {date ? format(date, "PPP") : <span>Starting Date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                />
            </PopoverContent>
        </Popover>

        <Popover Popover>
            <PopoverTrigger asChild>
            <Button
                variant={"outline"}
                className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                >
                    <ion-icon name="calendar-outline" className="mr-2 h-4 w-4" ></ion-icon>
                {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                {date ? format(date, "PPP") : <span>Starting Date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                />
            </PopoverContent>
        </Popover>
    </div>
  )
}

export default CalendarDate
