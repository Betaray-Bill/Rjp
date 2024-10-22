import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSelector } from 'react-redux';


function EditEmployee() {

  const {allEmployee} = useSelector(state => state.employee)
  const [searchEmp, setSearchEmp] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(allEmployee);

  const handleSearch = (e) => {
    let email = e.target.value
    console.log(email)
    setSearchEmp(e.target.value)
    const filtered = allEmployee.filter(user => {
        let ue = user.email.slice(0, email.length).toLowerCase()
        if(email.toLowerCase() === ue){
          console.log(ue + "  " + email)
          return user
        }
      }
      // user.email.toLowerCase().includes(email.toLowerCase())
    );

    console.log(filtered)
    setFilteredUsers(filtered)
  }


  return (
    <div className='mt-8 border p-4 rounded-md'>
      <h3 className="text-gray-700 font-semibold my-5 text-lg">Edit Employee</h3>

      {/* Search Employee by email */}
      <div className="flex justify-between">
        <div>
          <Label>Search By Email</Label>
          <Input placeholder="Search By email Id..." value={searchEmp} onChange={(e) => handleSearch(e)}/>
        </div>
{/* 
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Options" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Add Role">Add Role</SelectItem>
              <SelectItem value="Change Details">Change Details</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {/* Print the result */}
      <div className="mt-14 grid grid-cols-1">
        {
         (
            searchEmp && 
            (
              filteredUsers.map((e,_i) => (
                <div key={_i} className="border mt-4 rounded-md p-3">  
                  <p>{e.email}</p>
                </div>
              ))
            )
          )
        }
      </div>


    

    </div>
  )
}

export default EditEmployee
