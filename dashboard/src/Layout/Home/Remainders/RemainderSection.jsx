import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Link } from 'react-router-dom'
import api from '@/utils/api'
import { useSelector } from 'react-redux';

function RemainderSection() {

  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState()
  const { currentUser } = useSelector(state => state.auth);

  const [data, setData] = useState([])
  const [showAll, setShowAll] = useState(false);  // State to toggle "Show More"

  useEffect(() => {
    if (startDate && endDate && startDate < endDate) {
      fetchData()
    } else {
      fetchData()
    }
  }, [startDate, endDate])

  const fetchData = async () => {
    if (!startDate) return

    try {
      let query = ""
      if (startDate) query = query + `startDate=${startDate}`
      if (endDate) query = query + `&endDate=${endDate}`
      console.log(query)
      const response = await api.get(`/project/remainders/${currentUser.employee._id}?${query}`)
      const data = await response.data
      console.log(data)
      setData(data)
    } catch (error) {
      console.error(error)
    }
  }

  // Function to toggle showAll state
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className='mt-5 p-4 '>
      <div className='flex items-center justify-between'>
        <div className='font-semibold flex items-center '>
          <ion-icon name="time-outline" style={{ fontSize: "23px" }}></ion-icon>
          <span className='ml-2 text-lg'>Reminders</span>
        </div>
        <div className='flex items-center'>
          <div>
            <Input
              type="date"
              className="w-max"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onClick={() => fetchData()} />
          </div>
          <div className='mx-4'>
            <Input
              type="date"
              className="w-max"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
      </div>
      {data && data.length > 0 ? (
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              {/* <TableHead>S.no</TableHead> */}
              <TableHead>Training</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="flex items-center">
                <ion-icon name="calendar-outline"></ion-icon>
                <span className='ml-1'>Due Date</span>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.flatMap((item, _i) => {
              // Limit the number of reminders shown based on the showAll state
              const remindersToShow = showAll ? item.remainders : item.remainders.slice(0, 5);
              return (
                <>
                  {remindersToShow.map((reminder, index) => (
                    <TableRow key={`${_i}-${index}`}>
                      {/* <TableCell className="font-medium">{_i + 1}</TableCell> */}
                      <TableCell>{item.projectName}</TableCell>
                      <TableCell>{reminder.stages}</TableCell>
                      <TableCell>{reminder.date.split("T")[0].split("-").reverse().join("-")}</TableCell>
                      <TableCell>{reminder.description}</TableCell>
                      <TableCell>
                        <Link to={`/home/projects/view/${item._id}`} target='_blank' className='border border-blue-800 bg-blue-800 text-white px-3 py-2'>Open</Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Show the "Show More" button if there are more than 5 reminders */}
                  {!showAll && item.remainders.length > 5 && (
                    <TableRow key={`show-more-${_i}`} colSpan={6} className="text-center">
                      <TableCell colSpan={6} className="cursor-pointer text-blue-600" onClick={toggleShowAll}>
                        Show More
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )
            })}
          </TableBody>
        </Table>
      ) : <div className='text-center italic text-gray-600 font-light mt-5'>No Reminders Today</div>}
    </div>
  )
}

export default RemainderSection
