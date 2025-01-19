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
import CalendarComp from "./CalendarComp";
import api from "@/utils/api";



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


const TrainerCalendar = () => {
    const [searchQuery,
        setSearchQuery] = useState("");
    const [recommendations,
        setRecommendations] = useState([]);
    const [selectedTrainer,
        setSelectedTrainer] = useState(null);
    const [debouncedQuery,
        setDebouncedQuery] = useState("");

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300); // Wait 300ms after the last keystroke

        return () => {
            clearTimeout(handler); // Clear timeout if the user types again
        };
    }, [searchQuery]);

    // Fetch recommendations whenever the debouncedQuery changes
    useEffect(() => {
        if (debouncedQuery) {
            fetchRecommendations(debouncedQuery);
        } else {
            setRecommendations([]);
        }
    }, [debouncedQuery]);

    const fetchRecommendations = async(query) => {
      if(query){
        try {
            const response = await api.get(`/reports/search?query=${query}`);

            const data = await response.data;
            setRecommendations(data);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }

      }
    };

    const fetchTrainerDetails = async(trainerId) => {
        try {
            const response = await api.get(`/reports/trainer/${trainerId}`);
            const data = await response.data
            setSelectedTrainer(data);
        } catch (error) {
            console.error("Error fetching trainer details:", error);
        }
    };

    return (
        <div className=" mt-10">

            <div className="flex justify-start ">
                <div className="flex w-[400px] justify-between items-center border px-2 border-gray-400 rounded-sm"> 
                    <Input
                        placeholder="Search by name, trainerId, or email..."
                        value={searchQuery}
                        className="border-none rounded-sm"
                        onChange={(e) => {
                        setSearchQuery(e.target.value);
                        fetchRecommendations(e.target.value);
                    }}/>
                    <div onClick={() => {
                      setSearchQuery('')
                      setRecommendations([])
                    }} className="cursor-pointer mt-1"><ion-icon name="close-outline" style={{fontSize:"22px"}}></ion-icon></div>
                </div>
            </div>
            {recommendations.length > 0 && (
                <div className="mt-2 border rounded-md py-2 px-1 w-[400px]">
                    {recommendations.map((trainer) => (
                        <div
                            key={trainer._id}
                            className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                            onClick={() =>{ 
                              fetchTrainerDetails(trainer.trainerId); 
                              setRecommendations([])
                              setSearchQuery('')
                            }}>
                            {trainer.trainerId}
                            - {trainer.generalDetails.name}
                        </div>
                    ))}
                </div>
            )}
            {selectedTrainer && (
                <div className="mt-8">
                    <p>Name: <span className="font-semibold">{selectedTrainer.generalDetails.name}</span></p>
                    <p>Trainer ID: <span className="font-semibold">{selectedTrainer.trainerId}</span></p>
                    <h3 className="text-lg font-semibold mt-10">Calendar</h3>
                    <CalendarComp eventsDate={selectedTrainer.projects.map(e => e.trainingDates)} workingDates={selectedTrainer.workingDates}/>
                    {/* {selectedTrainer
                        .projects
                        .map((project) => (
                            <div key={project._id} className="mt-2 p-2 border rounded">
                                <p className="font-bold">{project.projectName}</p>
                                <div>
                                    <p>Training Dates:</p>
                                    <ul className="list-disc list-inside">
                                        <li>
                                            Start: {new Date(project.trainingDates.startDate).toLocaleDateString()}
                                            -{" "} {project.trainingDates.startTime}
                                        </li>
                                        <li>
                                            End: {new Date(project.trainingDates.endDate).toLocaleDateString()}
                                            -{" "} {project.trainingDates.endTime}
                                        </li>
                                    </ul>
                                </div>
                                {project.trainingDates.specialTimings.length > 0 && (
                                    <div className="mt-2">
                                        <p>Special Timings:</p>
                                        <ul className="list-disc list-inside">
                                            {project
                                                .trainingDates
                                                .specialTimings
                                                .map((timing, index) => (
                                                    <li key={index}>
                                                        {new Date(timing.date).toLocaleDateString()}
                                                        - {timing.startTime}
                                                        to{" "} {timing.endTime}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))} */}
                </div>
            )}

            {/* <div className="h-max p-3">
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
                        // timeslots={4}
                    />
                </div>
            </div> */}
        </div>
    );
};

export default TrainerCalendar;