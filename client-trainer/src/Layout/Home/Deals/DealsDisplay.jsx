import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import DealCard from './DealCard'
import { Link, Navigate } from 'react-router-dom'

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

          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2'>
            {
              user && user?.projects
              .map((deal, index) => (
                <Link to={`/home/project/${deal._id}`} key={index}>
                  <DealCard deal={deal} />
                </Link>
              ))}
          </div>

    </div>
  )
}

export default DealsDisplay
