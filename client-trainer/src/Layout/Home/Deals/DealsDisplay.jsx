import React, { useState } from 'react'

function DealsDisplay() {

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
  }])

  const icons = {
    "Completed":<ion-icon name="checkmark-done-outline"></ion-icon>,
    "In Progress": <ion-icon name="sync-outline"></ion-icon>,
    "Upcoming": <ion-icon name="calendar-outline"></ion-icon>
  }
  // ['<ion-icon name="checkmark-done-outline"></ion-icon>', '']

  return (
    <div className=' p-4 ml-2'>
      {["Completed", "In Progress", "Upcoming"].map((status) => (
        <div key={status} className='py-2'>
          <h3 className='text-lg font-medium ml-2 mt-5 flex items-center'><span className='text-buttonPrimary pr-3' style={{fontSize:"20px"}}>
            {icons[status]}</span> <span>{status} Deals</span>
          </h3>
          <div className='grid grid-cols-3'>
          {deals
            .filter((deal) => deal.status === status)
            .map((deal, index) => (
              <div key={index} className='border rounded-md p-4 m-2'>
                <h4 className='font-semibold'>{deal.name}</h4>
                <p>{deal.description}</p>
                <p>Start Date: {deal.startDate.toDateString()}</p>
                <p>End Date: {deal.endDate.toDateString()}</p>
                <p>Priority: {deal.priority}</p>
                {/* <hr /> */}
              </div>
            ))}
          </div>
          {/* <hr className='mt-4 border-gray-600' /> */}
        </div>
      ))}
      {/* Show Current Deals */}

      {/* Show Upcoming Deals */}

      {/* Show Completed Deals */}
      
    </div>
  )
}

export default DealsDisplay
