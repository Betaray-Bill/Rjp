import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux';
import Calendar from '../Components/Calendar';
import axios from 'axios';
const dateRanges = [
    { start: "2024-10-01", end: "2024-10-05", Deal: 1 },
    { start: "2024-10-10", end: "2024-10-15", Deal: 2 },
    { start: "2024-11-05", end: "2024-11-09", Deal: 3 },
  ];
function Dashboard() {
  const [data, setData] = useState()
  const {user} = useSelector((state)=> state.auth)

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
            { data && data.type_of_trainer === 'Internal' ? <Calendar dateRanges={dateRanges} /> : null}

    </div>
  )
}

export default Dashboard
