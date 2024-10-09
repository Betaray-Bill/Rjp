import React, { useState, useEffect } from "react";
import '../App.css'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Localizer for react-big-calendar using moment.js
const localizer = momentLocalizer(moment);

const CalendarComp = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
  });

  const convertToTime = (time) => {
    let val = time.getTime();
    const res = new Date(val);
    console.log(res.toUTCString().split(" ")[4]);
    return res.toUTCString().split(" ")[4];
  };

  const convertDate = (date) => {
    const formattedDate =
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2);

    return formattedDate;
  };

  // Function to check if the new event overlaps with existing events
  const isOverlapping = (start, end) => {
    console.log(start, end);
    console.log("---------------------------");
    return events.some((event) => {
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

      // Dayes
      // let startDay = convertDate(start)
      // let endDay = convertDate(end)
      // let OldstartDay = convertDate(event.start)
      // let OldendDay = convertDate(event.end)

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
  const handleSubmit = (e) => {
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
    }

    // Add the new event if all checks pass
    setEvents([
      ...events,
      { ...newEvent, start: new Date(start), end: new Date(end) },
    ]);
    setNewEvent({ title: "", start: "", end: "" });
  };

  const handleSelectEvent = (event) => {
    console.log("Event details:", event);
    alert(
      `Event Title: ${event.title}\nStart: ${event.start}\nEnd: ${event.end}`
    );
  };

  return (
    <div className="App">
      <h1>React Big Calendar with Event Form</h1>

      {/* Event Form */}
      <form onSubmit={handleSubmit}>
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
      </form>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        onSelectEvent={handleSelectEvent}
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
      />
    </div>
  );
};

export default CalendarComp ;
