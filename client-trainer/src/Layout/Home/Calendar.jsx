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
const events = [
    {
      title: 'My Event',
      start: new Date(),
      end: new Date('2024-10-31T14:59:00-05:00')
    }
  ]
const CalendarComp = ({eventsDate}) => {
    console.log(eventsDate)
    const [dates,
        setDates] = useState([])

    const formatDateTOCalendar = (date) => {
        eventsDate.forEach(date => {
            setDates(prev => [
                ...prev, {
                    start: new Date(date.start),
                    end: new Date(date.end),
                    title: date.title
                }
            ]);
        })
    }

    useEffect(() => {
        setDates([])
        if (eventsDate) {
            formatDateTOCalendar(eventsDate)
        }
    }, [eventsDate
            ?.length])

    const [data,
        setData] = useState()
    const {user} = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    axios.defaults.withCredentials = true;
    const getTrainerDetails = async() => {
        //console.log(data?._id)

        try {
            const res = await axios.get(`http://localhost:5000/api/trainer/details/${data._id}`)
            console.log(res.data)
            setData(res.data)
            dispatch(setCredentials(res.data))
        } catch (err) {
            console.log("Error fetching the data")
        }
    }

    // const [events, setEvents] = useState([]);
    const [newEvent,
        setNewEvent] = useState({title: "", start: "", end: ""});
    // console.log(events, eventsDate)
    const convertToTime = (time) => {
        let val = time.getTime();
        const res = new Date(val);
        console.log(res.toUTCString().split(" ")[4]);
        return res
            .toUTCString()
            .split(" ")[4];
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
            return ((newStart < eventEnd && newEnd > eventStart && newStartTime >= OldStartTime && newStartTime < OldEndTime) || (newEnd > OldStartTime && newEndTime <= OldEndTime) || // New end time is within an existing event
                    (newStartTime <= OldStartTime && newEnd >= OldEndTime)
            // New event completely overlaps an existing event
            );
        });
    };

    // Handle form submission
    axios.defaults.withCredentials = true;
    const handleSubmit = async(e) => {
        e.preventDefault();

        const {title, start, end} = newEvent;

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

            alert("This event overlaps with an existing event. Please choose a different time.");
            return;
        } else {
            // post it in the API
            try {
                const res = await axios.post(`http://localhost:5000/api/trainer/trainingDates/${data._id}`, newEvent)
                console.log(res.data)
                if (res) {
                    getTrainerDetails()
                }
            } catch (err) {
                console.log(err)
            }
            // render the state to update it
        }
        setNewEvent({title: "", start: "", end: ""});
    };

    const handleSelectEvent = (event) => {
        console.log("Event details:", event);
        alert(`Event Title: ${event.title}\nStart: ${event.start}\nEnd: ${event.end}`);
    }

    // Update the State
    useEffect(() => {
        getTrainerDetails()
        setData(user)
    }, [])

    return (
        <div>

            {/* <h1 className="text-slate-700">Training Dates</h1> */}

            {/* Event Form */}
            {/* <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="Start Date and Time"
          value={newEvent.start}
          onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="End Date and Time"
          value={newEvent.end}
          onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
        />
        <button type="submit">Add Event</button>
      </form> */}
            {/* <CalendarDate  eventsDate={eventsDate}/> */}

            {/* Calendar */}
            <Calendar
                localizer={localizer}
                events={events}
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