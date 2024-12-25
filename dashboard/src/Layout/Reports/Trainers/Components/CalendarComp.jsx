import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import axios from "axios";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import {Label} from "@/components/ui/Label";
// import {Input} from "@/components/ui/input";
// import {Button} from "@/components/ui/button";
import {useSelector} from "react-redux";
import {useToast} from "@/hooks/use-toast";
import {useQueryClient} from "react-query";



// Localizer for React Big Calendar
const localizer = momentLocalizer(moment);

const generateEvents = (eventsDate, workingDates) => {
    const events = []
    console.log(eventsDate)
    let array = []
    if (eventsDate && workingDates) {
        console.log(1)
        array = [
            ...eventsDate,
            ...workingDates
        ]
    } else if (eventsDate) {
        console.log(2)
        array = [...eventsDate]
    } else {
        console.log(3)
        array = [...workingDates]
    }
    // let array =else if [...eventsDate, ...workingDates]
    console.log(array)
    array
        ?.forEach((work) => {
            const {
                startDate,
                endDate,
                startTime,
                endTime,
                specialTimings,
                projectName
            } = work;

            // Add regular intervals
            let currentDate = new Date(startDate);
            const lastDate = new Date(endDate);

            while (currentDate <= lastDate) {
                const startDateTime = new Date(currentDate);
                const endDateTime = new Date(currentDate);

                startDateTime.setHours(new Date(startTime).getHours(), new Date(startTime).getMinutes());
                endDateTime.setHours(new Date(endTime).getHours(), new Date(endTime).getMinutes());

                events.push({
                    title: projectName
                        ? projectName
                        : work.name,
                    start: startDateTime,
                    end: endDateTime,
                    allDay: false
                });

                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Add special timings
            specialTimings
                ?.forEach((special) => {
                    const {date, startTime: specialStart, endTime: specialEnd} = special;

                    const specialStartDateTime = new Date(date);
                    const specialEndDateTime = new Date(date);

                    specialStartDateTime.setHours(new Date(specialStart).getHours(), new Date(specialStart).getMinutes());
                    specialEndDateTime.setHours(new Date(specialEnd).getHours(), new Date(specialEnd).getMinutes());

                    events.push({title: projectName, start: specialStartDateTime, end: specialEndDateTime, allDay: false});
                });
        });

    return events;
};

function CalendarComp({
    eventsDate,
    workingDates
}) {
    const events = generateEvents(eventsDate, workingDates);
    
    console.log(events)
  return (
    <div>
      <div className="h-max p-3">
                <div style={{
                    padding: "20px"
                }}>

                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{
                        height: "80vh"
                    }}
                        views={["month", "week", "day"]}
                        step={15}
                        timeslots={4}/>
                </div>
            </div>
    </div>
  )
}

export default CalendarComp
