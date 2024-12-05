import React, {useState, useEffect} from "react";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {setCredentials} from "@/features/authSlice";
import CalendarDate from "./CalendarDate";

// Localizer for react-big-calendar using moment.js
const localizer = momentLocalizer(moment);

const CalendarComp = () => {
    // console.log(eventsDate)
    const [dates,
        setDates] = useState([])


    const [data,
        setData] = useState()
    const {user} = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    console.log(user.projects)
    axios.defaults.withCredentials = true;


    // Handle form submission
    axios.defaults.withCredentials = true;
 
    const handleSelectEvent = (event) => {
        console.log("Event details:", event);
        alert(`Event Title: ${event.title}\nStart: ${event.start}\nEnd: ${event.end}`);
    }

    const allocateDate = () => {
        let a =[]
        for(let i = 0; i <user.projects.length; i++) {
            let obj = {}
            obj.title = user.projects[i].projectName
            obj.start = new Date(user.projects[i].trainingDates?.startDate)
            obj.end = new Date(user.projects[i].trainingDates?.endDate)
            a.push(obj)
        }

        console.log(a)
        
        setDates(a)
    }

    // Update the State
    useEffect(() => {
        // getTrainerDetails()
        setData(user)
        allocateDate()
    }, [])

    return (
        <div>

            {/* Calendar */}
            <Calendar
                localizer={localizer}
                events={dates}
                startAccessor="start"
                onSelectEvent={handleSelectEvent}
                endAccessor="end"
                style={{
                height: 500,
                margin: "50px"
            }}/>
        </div>
    );
};

export default CalendarComp;