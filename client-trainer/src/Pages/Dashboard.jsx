  import React, { Fragment, useEffect, useState } from 'react'
  import { useSelector } from 'react-redux';
  import CalendarComp from '../Layout/Home/Calendar.jsx'
  import DealsDisplay from '@/Layout/Home/Deals/DealsDisplay.jsx';


  function Dashboard() {
    const [data, setData] = useState()
    const {user} = useSelector((state)=> state.auth)

    useEffect(() => {
      if(user){
          console.log(user)
          setData(user)
        }
    }, [user])
    

    return (
      <div className='mx-auto grid place-content-center'>
        <p className='text-md text-gray-700 mt-4 pb-[-2] font-semibold'>Dashboard</p>
      {/* Calendar Only for the Internal Trainers */}
        {   
            user?.trainingDetails.trainerType === 'Internal' ? 
              <Fragment>
                <div className='w-[80vw] bg-white rounded-md border mt-6 border-generalBorderColor'>
                  <div className="border-b mt-4 pb-4">
                    <span className="text-slate-800 font-semibold flex items-center ml-10">
                      <ion-icon name="calendar-outline" style={{fontSize:"34px", color:"#3e4093"}}></ion-icon>
                      <span className='ml-4 text-xl'>Training dates</span>
                    </span>
                  </div>
                  <CalendarComp  eventsDate={data?.availableDate} /> 
                </div>
              </Fragment>
              : null
        }
        
        <div className='my-10'>
          <div className='w-[80vw] bg-white rounded-md border border-generalBorderColor'>
            <div className="border-b mt-4 pb-4">
              <span className="text-slate-800 font-semibold flex items-center ml-10">
                <ion-icon name="layers-outline" style={{fontSize:"34px", color:"#3e4093"}}></ion-icon>
                <span className='ml-4 text-xl'  >Deals</span>
              </span>
            </div>
            <DealsDisplay />
          </div>
        </div>

      </div>
    )
  }

  export default Dashboard
