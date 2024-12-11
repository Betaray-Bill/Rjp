import React, {useState, useEffect} from "react";
// import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
// import {useDispatch, useSelector} from "react-redux"; import {setCredentials}
// from "@/features/authSlice";
import CalendarDate from "./CalendarDate";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
import timeGridPlugin from "@fullcalendar/timegrid"; // For week/day views
import interactionPlugin from "@fullcalendar/interaction"; // For interaction
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Label} from "@/components/ui/Label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

// Localizer for react-big-calendar using npm run dev.js const localizer =
// momentLocalizer(moment);

const CalendarComp = ({eventsDate}) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Transform the eventsDate into FullCalendar events
        const transformedEvents = eventsDate?.flatMap((event) => {
            const { startDate, endDate, projectName, specialTimings } = event;
            console.log(event)
            const eventInstances = [];
            const currentDate = moment(startDate);

            while (currentDate.isSameOrBefore(moment(endDate), "day")) {
                const isSpecialDate = specialTimings.find((special) =>
                    moment(special.date).isSame(currentDate, "day")
                );

                const eventStart = isSpecialDate
                    ? moment(isSpecialDate.date)
                          .set({
                              hour: moment(isSpecialDate.startTime).hours(),
                              minute: moment(isSpecialDate.startTime).minutes(),
                          })
                          .toISOString()
                    : moment(currentDate)
                          .set({
                              hour: moment(startDate).hours(),
                              minute: moment(startDate).minutes(),
                          })
                          .toISOString();

                const eventEnd = isSpecialDate
                    ? moment(isSpecialDate.date)
                          .set({
                              hour: moment(isSpecialDate.endTime).hours(),
                              minute: moment(isSpecialDate.endTime).minutes(),
                          })
                          .toISOString()
                    : moment(currentDate)
                          .set({
                              hour: moment(endDate).hours(),
                              minute: moment(endDate).minutes(),
                          })
                          .toISOString();

                eventInstances.push({
                    title: `${projectName} (${moment(eventStart).format(
                        "h:mm A"
                    )} - ${moment(eventEnd).format("h:mm A")})`,
                    start: eventStart,
                    end: eventEnd,
                    extendedProps: {
                        projectName,
                        startDate: eventStart,
                        endDate: eventEnd,
                    },
                });

                currentDate.add(1, "day");
            }

            return eventInstances;
        });

        setEvents(transformedEvents);
    }, [eventsDate]);

    const handleEventClick = (info) => {
        const { extendedProps } = info.event;
        alert(`Project: ${extendedProps.projectName}\nStart: ${moment(extendedProps.startDate).format("LLLL")}\nEnd: ${moment(extendedProps.endDate).format("LLLL")}`);
    };
    const [show,
        setShow] = useState(false)

    // console.log(events)
    return (
        <div className="  h-max p-3">
            <div>
                {/* h2 */}
            </div>
            <div className="h-max p-3">
            <div style={{ padding: "20px" }}>
                <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={events}
                    slotMinTime="00:00:00"
                    slotMaxTime="24:00:00"
                    height="100vh"
                    eventClick={handleEventClick}
                />
            </div>
        </div>

            {/* <div className="p-4">
                <div className="flex justify-end">
                    <Button className="rounded-none" onClick={() => setShow(p => !p)}>Add Events</Button>
                </div>

                {show && <div className="mt-6 border p-4 rounded-md">
                    <form
                        onSubmit={handleSubmit}
                        style={{
                        marginBottom: "20px"
                    }}>
                        <div className="grid grid-cols-3 gap-4 place-content-center">
                            <div className="flex items-center">
                                <Label>Title:</Label>
                                <Input
                                    type="text"
                                    value={formValues.title}
                                    className="px-3 py-2 border border-gray-400 rounded-sm ml-3"
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    required/>
                            </div>
                            <div>
                                <Label>Start Date:</Label>
                                <DatePicker
                                    selected={formValues.startDate}
                                    onChange={(date) => handleInputChange("startDate", date)}
                                    dateFormat="P"
                                    className="px-3 py-2 border border-gray-400 rounded-sm  ml-2"
                                    required/>
                            </div>
                            <div>
                                <Label>End Date:</Label>
                                <DatePicker
                                    selected={formValues.endDate}
                                    onChange={(date) => handleInputChange("endDate", date)}
                                    dateFormat="P"
                                    className="px-3 py-2 border border-gray-400 rounded-sm  ml-2"
                                    required/>
                            </div>
                            <div>
                                <Label>Start Time:</Label>
                                <DatePicker
                                    selected={formValues.startTime}
                                    onChange={(time) => handleInputChange("startTime", time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border border-gray-400 rounded-sm  ml-2"
                                    dateFormat="h:mm aa"
                                    required/>
                            </div>
                            <div>
                                <Label>End Time:</Label>
                                <DatePicker
                                    selected={formValues.endTime}
                                    onChange={(time) => handleInputChange("endTime", time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border border-gray-400 rounded-sm  ml-2"
                                    dateFormat="h:mm aa"
                                    required/>
                            </div>
                        </div>
                        <div className="  mt-10">
                            <h4 className="font-semibold my-4">Exceptional Date and Timings</h4>
                            <div className="grid grid-cols-3 gap-5">
                                <div>
                                    <Label>Date:</Label>
                                    <DatePicker
                                        className="px-3 py-2 border border-gray-400 ml-2 rounded-sm  "
                                        selected={specialTimingInput.date}
                                        onChange={(date) => handleSpecialTimingInputChange("date", date)}
                                        dateFormat="P"/>
                                </div>
                                <div>
                                    <Label>Start Time:</Label>
                                    <DatePicker
                                        className="px-3 py-2 border border-gray-400 ml-2 rounded-sm  "
                                        selected={specialTimingInput.startTime}
                                        onChange={(time) => handleSpecialTimingInputChange("startTime", time)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"/>
                                </div>
                                <div>
                                    <Label>End Time:</Label>
                                    <DatePicker
                                        className="px-3 py-2 border border-gray-400 ml-2 rounded-sm  "
                                        selected={specialTimingInput.endTime}
                                        onChange={(time) => handleSpecialTimingInputChange("endTime", time)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"/>
                                </div>
                                <div className="">
                                    <Button type="button" onClick={addSpecialTiming} className="">
                                        Add Special Timing
                                    </Button>
                                </div>
                            </div>
                            <ul>
                                {formValues
                                    .specialTimings
                                    .map((special, index) => (
                                        <li key={index}>
                                            {moment(special.date).format("YYYY-MM-DD")}
                                            |{" "} {moment(special.startTime).format("h:mm A")}
                                            -{" "} {moment(special.endTime).format("h:mm A")}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div className="flex items-center justify-center"> 
                            <Button type="submit">Add Event</Button>
                        </div>
                    </form>

                </div>
}

            </div> */}
        </div>
    );
};

export default CalendarComp;