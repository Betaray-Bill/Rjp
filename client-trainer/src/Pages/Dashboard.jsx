import React, { Fragment, useEffect, useState } from 'react'

import { useSelector } from 'react-redux';
import CalendarComp from '../Components/Calendar.jsx';
import axios from 'axios';
const dateRanges = [
    { start: "2024-10-01", end: "2024-10-05", Deal: 1 },
    { start: "2024-10-10", end: "2024-10-15", Deal: 2 },
    { start: "2024-11-05", end: "2024-11-09", Deal: 3 },
  ];
function Dashboard() {
  const [data, setData] = useState()
  const {user} = useSelector((state)=> state.auth)
  const formatDate = (isoDate) => {
    if (!isoDate) return null; // Handle null or undefined dates
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    };

  const formattedDateRanges = user.availableDate.map(range => ({
        ...range,
        startDate: formatDate(range.startDate),
        endDate: formatDate(range.endDate)
    }));

  useEffect(() => {
    if(user){
        console.log(user)
        setData(user)
      }
  })
  

  return (
    <div>
    {/* Calendar Only for the Internal Trainers */}
    { 
        data && 
        data.type_of_trainer === 'Internal' ? 
        <Fragment>
          <CalendarComp  eventsDate={data?.availableDate} /> 
        </Fragment>: null
        }

    </div>
  )
}

export default Dashboard


          {/* <div className="section">
              <h2>Available Dates</h2>
              {user.availableDate.map((date, index) => (
                <div key={index} className='section' style={{width:"400px"}}>
                  <div className="key-value">
                    <strong>Start Date:</strong> {date.start ? convertDate(date.start) : 'N/A'}
                  </div>
                  <div className="key-value">
                    <strong>End Date:</strong> {date.end ? convertDate(date.end) : 'N/A'}
                  </div>
                </div>
              ))}
          </div> */}