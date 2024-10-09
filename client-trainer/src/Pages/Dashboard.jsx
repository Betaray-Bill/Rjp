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
    // Dates
    const [date, setDate] = useState({
        start: new Date(),
        end: new Date()
    })


    // console.log(date.start, date.end)
    axios.defaults.withCredentials = true;
    const handleDate = async(e) => {
      e.preventDefault()
      console.log(date)
      try{
        const res = await axios.post(`http://localhost:5000/api/trainer/trainingDates/${data._id}`, date)
        console.log(res.data)
        if(res){
        //   getTrainerDetails()
  
        }
      }catch(err){
        console.log(err)
      }
    }

    function convertDate(dateStr) {
        // Check if dateStr is a string, and then convert it to a Date object
        const date = new Date(dateStr);
      
        // Verify that 'date' is a valid Date object
        if (isNaN(date.getTime())) {
          throw new Error('Invalid Date');
        }
      
        // Extract day, month, and year from the Date object
        const day = date.getUTCDate(); // For local time, use date.getDate()
        const month = date.getUTCMonth() + 1; // Months are zero-indexed, so add 1
        const year = date.getUTCFullYear(); // For local time, use date.getFullYear()
      
        // Format the date as DD/MM/YYYY
        const formattedDate = `${day}/${month}/${year}`;
      
        return formattedDate;
    }
  

  return (
    <div>
        
      {
          data && (
            data.type_of_trainer === 'Internal' ? 
            (
              <div>
                <h3>Internal Trainer</h3>
                <p>Welcome {data.name}</p>
                <p>Trainer ID: {data._id}</p>
                <p>Type: {data.type_of_trainer}</p>
                <div>
                  <h3>Training Period</h3>
                  <form onSubmit={handleDate}>
                    <div>
                      <label htmlFor="">Start</label>
                      <input type="date" name="start" id="" onChange={(e) => setDate({...date, [e.target.name]:e.target.value})}/>
                    </div>
                    <div>
                      <label htmlFor="">End</label>
                      <input type="date" name="end" id="" onChange={(e) => setDate({...date, [e.target.name]:e.target.value})}/>
                    </div>
                    <button>Submit</button>
                  </form>
                </div>
                {/* DateRanfg */}
              </div>
            ):null
          ) 
      }

    {/* Calendar Only for the Internal Trainers */}
    { 
        data && 
        data.type_of_trainer === 'Internal' ? 
        <Fragment>
          <div className="section">
              <h2>Available Dates</h2>
              {user.availableDate.map((date, index) => (
                <div key={index} className='section' style={{width:"400px"}}>
                  <div className="key-value">
                    <strong>Start Date:</strong> {date.startDate ? convertDate(date.startDate) : 'N/A'}
                  </div>
                  <div className="key-value">
                    <strong>End Date:</strong> {date.endDate ? convertDate(date.endDate) : 'N/A'}
                  </div>
                </div>
              ))}
          </div>
          <CalendarComp  /> 
        </Fragment>: null
        }

    </div>
  )
}

export default Dashboard
