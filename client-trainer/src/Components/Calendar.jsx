import React, { useState, useEffect } from "react";
import '../App.css'
function Calendar({ dateRanges }) {
    console.log(dateRanges)
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    const getDaysInMonth = (month, year) => {
      return new Date(year, month + 1, 0).getDate();
    };
  
    const firstDayOfMonth = (month, year) => {
      return new Date(year, month, 1).getDay();
    };
  
    const handleNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prevYear) => prevYear + 1);
      } else {
        setCurrentMonth((prevMonth) => prevMonth + 1);
      }
    };
  
    const handlePrevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prevYear) => prevYear - 1);
      } else {
        setCurrentMonth((prevMonth) => prevMonth - 1);
      }
    };
  
    // Check if the current date (day, month, year) is between any date range
    const getDateRangeColors = (day, month, year) => {
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0)
      for (let range of dateRanges) {
        const startDate = new Date(range.startDate);
        const endDate = new Date(range.endDate); 
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        if (currentDate >= startDate && currentDate <= endDate) {
          
        console.log("Dates ", startDate, endDate)
          return "highlight"; // Return the highlight CSS class if the date is in the range
        }
      }
      return "";
    };


    const [deal, setDeal] = useState("");
    const hoverDeal = (e, month, year) => {
      // console.log(e, month, year);
      const currentDate = new Date(year, month, e);
      currentDate.setHours(0, 0, 0, 0)
  
      for (let range of dateRanges) {
        const startDate = new Date(range.startDate);
        const endDate = new Date(range.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        if (currentDate >= startDate && currentDate <= endDate) {
          console.log("yeas ", range.startDate);
          setDeal(range.startDate);
          return;
        }
      }
    };
  
    const renderDays = () => {
      const daysInMonth = getDaysInMonth(currentMonth, currentYear);
      const firstDay = firstDayOfMonth(currentMonth, currentYear);
      const days = [];
  
      // Empty days before the first day of the current month
      for (let i = 0; i < firstDay; i++) {
        days.push(<div className="empty" key={`empty-${i}`} />);
      }
  
      for (let day = 1; day <= daysInMonth; day++) {
        const colorClass = getDateRangeColors(day, currentMonth, currentYear);
        days.push(
          <div
            key={day}
            className={`day ${colorClass}`}
            onClick={() => hoverDeal(day, currentMonth, currentYear)}
          >
            {day}
          </div>
        );
      }
  
      return days;
    };
  


  return (
    <div className="calendar-container">
        <div>{deal && <div>Deal is {deal}</div>}</div>
        <div className="header">
        <button onClick={handlePrevMonth}>{"<"}</button>
        <div>{`${new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
        })} ${currentYear}`}</div>
        <button onClick={handleNextMonth}>{">"}</button>
        </div>
        <div className="days-of-week">
        {daysOfWeek.map((day, index) => (
            <div key={index} className="day-of-week">
            {day}
            </div>
        ))}
        </div>
        <div className="days">{renderDays()}</div>
  </div>
  )
}

export default Calendar
