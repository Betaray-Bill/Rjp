import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "react-query";
import api from "@/utils/api";

const localizer = momentLocalizer(moment);

const generateEvents = (eventsDate, workingDates) => {
  const events = [];
  const array = [  ...(workingDates || [])];
  array.forEach((work) => {
    const { startDate, endDate, startTime, endTime, projectName } = work;
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
      const startDateTime = new Date(currentDate);
      const endDateTime = new Date(currentDate);

      startDateTime.setHours(
        new Date(startTime).getHours(),
        new Date(startTime).getMinutes()
      );
      endDateTime.setHours(
        new Date(endTime).getHours(),
        new Date(endTime).getMinutes()
      );

      events.push({
        title: projectName || work.name,
        start: startDateTime,
        end: endDateTime,
        allDay: false,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
  return events;
};

const CalendarComp = ({ eventsDate, workingDates }) => {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [workingDatesData, setWorkingDatesData] = useState(workingDates || []);
  const [formValues, setFormValues] = useState({
    name: "Not Available",
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [show, setShow] = useState(false);

  const events = generateEvents(eventsDate, workingDates);

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (editIndex !== null) {
      // Editing an existing event
      const updatedEvents = [...workingDatesData];
      updatedEvents[editIndex] = formValues;
      setWorkingDatesData(updatedEvents);

      console.log(updatedEvents)

      try {
        await api.put(`/trainer/workingDates/${user._id}`, formValues);
        toast({
          title: "Event Updated",
          description: "Event has been successfully updated",
          variant: "success",
          duration: 3000,
        });
        queryClient.invalidateQueries(["user", user._id]);

        window.location.reload()
      } catch {
        toast({
          title: "Error",
          description: "Failed to update event",
          variant: "error",
          duration: 3000,
        });
      }
    // } 

    // Reset form
    setFormValues({
      name: "Holiday",
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setFormValues(workingDatesData[index]);
    setEditIndex(index);
    setShow(true);
  };

  const handleDelete = async (index) => {
    const updatedEvents = workingDatesData.filter((_, i) => i !== index);
    setWorkingDatesData(updatedEvents);

    try {
      await api.delete(`/trainer/workingDates/${user._id}`, {
        data: { eventId: workingDatesData[index]._id },
      });
      toast({
        title: "Event Deleted",
        description: "Event has been successfully deleted",
        variant: "success",
        duration: 3000,
      });
      queryClient.invalidateQueries(["user", user._id]);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "error",
        duration: 3000,
      });
    }
  };


  const handleEditUploadFunction = async() => {
    const updatedEvents = [...workingDatesData];
      setWorkingDatesData(updatedEvents);

      try {
        await api.put(`/trainer/workingDates/update/${user._id}`, workingDatesData);
        toast({
          title: "Event Created",
          description: "New event has been successfully created",
          variant: "success",
          duration: 3000,
        });
        queryClient.invalidateQueries(["user", user._id]);
      } catch {
        toast({
          title: "Error",
          description: "Failed to create event",
          variant: "error",
          duration: 3000,
        });
      }
  }

  

  return (
    <div className="h-max p-3">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh" }}
        views={["month", "week", "day"]}
        step={15}
        timeslots={4}
      />

      <div className="p-4">
        <div className="flex justify-end">
          <Button className="rounded-none" onClick={() => setShow((prev) => !prev)}>
            {editIndex !== null ? "Edit Event" : "Add Event"}
          </Button>
        </div>

        {show && (
          <form className="border p-4 rounded-md mt-4">
            <h2 className="font-semibold my-2">
              {editIndex !== null ? "Edit Event" : "Add Event"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label>Title:</Label>
                <Input
                  type="text"
                  value={formValues.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={formValues.name === "Not Available" ? true : false}
                  required
                />
              </div>
              <div className="flex flex-col">
                <Label>Start Date:</Label>
                <DatePicker className="border  border-gray-400 rounded-md px-2 py-1 "
                  selected={formValues.startDate}
                  onChange={(date) => handleInputChange("startDate", date)}
                  dateFormat="P"
                  required
                />
              </div>
              <div className="flex flex-col">
                <Label>End Date:</Label>
                <DatePicker className="border  border-gray-400 rounded-md px-2 py-1 "
                  selected={formValues.endDate}
                  onChange={(date) => handleInputChange("endDate", date)}
                  dateFormat="P"
                  required
                />
              </div>
              <div className="flex flex-col">
                <Label>Start Time:</Label>
                <DatePicker className="border  border-gray-400 rounded-md px-2 py-1 "
                  selected={formValues.startTime}
                  onChange={(time) => handleInputChange("startTime", time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  required
                />
              </div>
              <div className="flex flex-col">
                <Label>End Time:</Label>
                <DatePicker className="border  border-gray-400 rounded-md px-2 py-1 "
                  selected={formValues.endTime}
                  onChange={(time) => handleInputChange("endTime", time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-center mt-4">
              {
                editIndex !== null ?  <Button  onClick={handleEditUploadFunction} >Save Changes</Button> : <Button  onClick={handleSubmit} > Add Event</Button>
              }
            </div>
          </form>
        )}

        {workingDatesData.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold my-4">Working Dates</h4>
            <div>
              {workingDatesData.map((data, index) => (
                <div
                  key={index}
                  className="border rounded-md p-4 my-1 flex justify-between items-center"
                >
                  <div>
                    <div>
                      <span className="font-semibold">Title:</span> {data.name}
                    </div>
                    <div>
                      <span>
                        <span className="font-semibold">From:</span>{" "}
                        {moment(data.startDate).format("YYYY-MM-DD")}
                      </span>
                      <span className="ml-4">
                        <span className="font-semibold">To:</span>{" "}
                        {moment(data.endDate).format("YYYY-MM-DD")}
                      </span>
                    </div>
                  </div>
                  {
                    data.name === "Not Available" && (
                      <div className="flex items-center">
                      <Button
                        className="mr-2"
                        onClick={() => handleEdit(index)}
                        variant="secondary"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(index)}
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </div>
                    )
                  }
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarComp;
