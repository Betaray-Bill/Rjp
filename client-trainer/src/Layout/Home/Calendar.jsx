import React, {useState, useEffect} from "react";
// import {Calendar, momentLocalizer} from "react-big-calendar"; import moment
// from "moment"; import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
// import {useDispatch, useSelector} from "react-redux"; import {setCredentials}
// from "@/features/authSlice";
import CalendarDate from "./CalendarDate";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
import timeGridPlugin from "@fullcalendar/timegrid"; // For week/day views
import interactionPlugin from "@fullcalendar/interaction"; // For interaction
import DatePicker from "react-datepicker";
// import React from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import "react-datepicker/dist/react-datepicker.css";
import {Label} from "@/components/ui/Label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
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

// Localizer for react-big-calendar using npm run dev.js const localizer =
// momentLocalizer(moment);

const CalendarComp = ({eventsDate, workingDates}) => {
    const {user} = useSelector((state) => state.auth)
    const queryClient = useQueryClient()
    const {toast} = useToast()
    console.log(eventsDate)
    const events = generateEvents(eventsDate, workingDates);

    const [workingDatesData,
        setWorkingDatesData] = useState(workingDates && workingDates)

    console.log(workingDates)

    const [show,
        setShow] = useState(false)
    const [formValues,
        setFormValues] = useState({
        name: "",
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        // specialTimings: []
    });

    const handleInputChange = (name, value) => {
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSpecialTimingInputChange = (name, value) => {
        setSpecialTimingInput({
            ...specialTimingInput,
            [name]: value
        });
    };

    const handleSubmit = async(e) => {
        //

        e.preventDefault();
        setWorkingDatesData(p => [
            ...p,
            formValues
        ])
        const sendData = [
            ...workingDatesData,
            formValues
        ]
        try {

            const data = await axios.put(`http://localhost:5000/api/trainer/workingDates/${user._id}`, {
                ...formValues
            })
            const res = await data.data

            console.log(res)

            toast({title: "Event Created", description: "New event has been successfully created", variant: "success", duration: 3000})

            queryClient([
                "user", user._id
            ],)

        } catch (err) {
            toast({title: "Error", description: "Failed to create event", variant: "error", duration: 3000})
        }

    }

    const deleteEvent = async(index) => {
        e.preventDefault();

    }

    return (
        <div className="  h-max p-3">
            <div>
                {/* h2 */}
            </div>
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

            <div className="p-4">
                <div className="flex justify-end">
                    <Button className="rounded-none" onClick={() => setShow(p => !p)}>Events</Button>
                </div>

                {show && <div className="mt-6 border p-4 rounded-md">
                    <h2 className="font-semibold my-2">Add Events</h2>
                    <form
                        onSubmit={handleSubmit}
                        className="border border-gray-300  px-3 py-2 rounded-md"
                        style={{
                        marginBottom: "20px"
                    }}>
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-content-center">
                            <div className="flex flex-col">
                                <Label>Title:</Label>
                                <Input
                                    type="text"
                                    value={formValues.title}
                                    className="px-3 py-2 border border-gray-400 rounded-sm mt-1"
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    required/>
                            </div>
                            <div className="flex flex-col">
                                <Label>Start Date:</Label>
                                <DatePicker
                                    selected={formValues.startDate}
                                    onChange={(date) => handleInputChange("startDate", date)}
                                    dateFormat="P"
                                    className="px-3 py-2 border border-gray-400 rounded-sm  mt-1"
                                    required/>
                            </div>
                            <div className="flex flex-col">
                                <Label>End Date:</Label>
                                <DatePicker
                                    selected={formValues.endDate}
                                    onChange={(date) => handleInputChange("endDate", date)}
                                    dateFormat="P"
                                    className="px-3 py-2 border border-gray-400 rounded-sm  mt-1"
                                    required/>
                            </div>
                            <div className="flex flex-col">
                                <Label>Start Time:</Label>
                                <DatePicker
                                    selected={formValues.startTime}
                                    onChange={(time) => handleInputChange("startTime", time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border border-gray-400 rounded-sm  mt-1"
                                    dateFormat="h:mm aa"
                                    required/>
                            </div>
                            <div className="flex flex-col">
                                <Label>End Time:</Label>
                                <DatePicker
                                    selected={formValues.endTime}
                                    onChange={(time) => handleInputChange("endTime", time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border border-gray-400 rounded-sm  m-2"
                                    dateFormat="h:mm aa"
                                    required/>
                            </div>
                        </div>
  
                        <div className="flex items-center mt-5 justify-center">
                            <Button type="submit">Add Event</Button>
                        </div>
                    </form>

                    {workingDatesData.length > 0 && (
                        <div className="mt-6  py-4 rounded-md">
                            <h4 className="font-semibold my-4">Working Dates</h4>
                            <div>
                                {workingDatesData.map((data, index) => (
                                    <div key={index} className="border border-gray-300 rounded-md px-4 py-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                Title : {data
                                                    ?.name}
                                            </div>
                                            <div className="cursor-pointer" onClick={() => deleteEvent(index)}>
                                                <ion-icon
                                                    name="trash-outline"
                                                    style={{
                                                    color: "red"
                                                }}></ion-icon>
                                            </div>
                                        </div>
                                        <div>
                                            <span>From : {moment(data.startDate).format("YYYY-MM-DD")}</span>
                                            <span className="ml-5">End : {moment(data.endDate).format("YYYY-MM-DD")}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )
}

                </div>
}

            </div>
        </div>
    );
};

export default CalendarComp;