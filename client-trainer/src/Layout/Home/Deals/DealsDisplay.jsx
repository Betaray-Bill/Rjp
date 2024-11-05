import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function DealsDisplay() {
  const {user}  = useSelector(state => state.auth)
  console.log(user.projects)
  const [deals,setDeals] = useState( [{
    name: "Deal 1",
    description: "Description for Deal 1",
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-10-10"),
    status: "Completed",
    priority: "High"
  },
  {
    name: "Deal 2",
    description: "Description for Deal 2",
    startDate: new Date("2024-10-05"),
    endDate: new Date("2024-10-15"),
    status: "In Progress",
    priority: "Medium"
  },
  {
    name: "Deal 3",
    description: "Description for Deal 3",
    startDate: new Date("2024-10-20"),
    endDate: new Date("2024-10-30"),
    status: "Upcoming",
    priority: "Low"
  },
  {
    name: "Deal 4",
    description: "Description for Deal 4",
    startDate: new Date("2024-09-20"),
    endDate: new Date("2024-09-30"),
    status: "Completed",
    priority: "Medium"
  },
  {
    name: "Deal 5",
    description: "Description for Deal 5",
    startDate: new Date("2024-10-12"),
    endDate: new Date("2024-10-22"),
    status: "In Progress",
    priority: "High"
  },
  {
    name: "Deal 6",
    description: "Description for Deal 5",
    startDate: new Date("2024-10-12"),
    endDate: new Date("2024-10-22"),
    status: "In Progress",
    priority: "High"
  }])

  const icons = {
    "Completed":<ion-icon name="checkmark-done-outline"></ion-icon>,
    "In Progress": <ion-icon name="sync-outline"></ion-icon>,
    "Upcoming": <ion-icon name="calendar-outline"></ion-icon>
  }
  // ['<ion-icon name="checkmark-done-outline"></ion-icon>', '']

  return (
    <div className='p-4 ml-2'>
      {/* {["In Progress", "Upcoming", "Completed"].map((status) => (
        <div key={status} className='py-2'>
          <h3 className='text-lg font-medium ml-2 mt-5 flex items-start border-b pb-3 mb-3'><span className='text-buttonPrimary pr-3' style={{fontSize:"20px"}}>
            {icons[status]}</span> <span>{status} Deals</span>
          </h3> */}
          <div className='grid grid-cols-3'>
            {
              user && user.projects
              .map((deal, index) => (
                <div key={index} className='border rounded-md p-4 m-2  hover:shadow-md transition-shadow transition-ease-in-out cursor-pointer'>
                  <h4 className='font-semibold'>{deal.projectName}</h4>
                  {/* <p>Project: {deal.projectName}</p> */}
                  <p>Domain: {deal.domain}</p>
                  <p>Mode: {deal.modeOfTraining}</p>
                  <p>Start Date: {new Date(deal.trainingDates?.startDate).toDateString()}</p>
                  <p>End Date: {new Date(deal.trainingDates?.endDate).toDateString()}</p>
                  {/* <hr /> */}
                </div>
              ))}
          </div>
        {/* </div>
      ))} */}
      {/* Show Current Deals */}

      {/* Show Upcoming Deals */}

      {/* Show Completed Deals */}
      
    </div>
  )
}

export default DealsDisplay
