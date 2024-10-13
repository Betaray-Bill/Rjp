import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CalendarComp from '../Layout/Home/Calendar.jsx'


function Dashboard() {
  const [data, setData] = useState()
  const {user} = useSelector((state)=> state.auth)

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
