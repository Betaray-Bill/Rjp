import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from 'axios';
import api from '@/utils/api';

function EditEmployee() {

  const {allEmployee} = useSelector(state => state.employee)
  const [searchEmp, setSearchEmp] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(allEmployee);
  console.log(allEmployee)

  useEffect(() => {
    setFilteredUsers(allEmployee)
    console.log("meowe")
  }, [allEmployee])

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

  const [emp, setEmp] = useState()
  const [roleSelected, setRoleSelected] = useState("")


  const handleRoleChange =(e) => {
    console.log(e)
    setRoleSelected(e)
    emp.role.forEach((r) => {
      if(r.name === e){
        alert("Already Appointed with this Role")
        setRoleSelected("e")
      }
    })
  }


  axios.defaults.withCredentials = true;
  const changeRole = async() => {
    let name 
    emp.role.forEach((r) => {
      if(r.name === roleSelected){
        name = r.name
        alert("Already Appointed with this Role")
      }
    })
    try {
      console.log(roleSelected)
      const response = await api.put(`/employee/update-role/${emp._id}`, {roles:[roleSelected]}); // Replace with your API endpoint
      console.log('Roles Adding successful:', response.data);
    } catch (error) {
        console.error('Roles Adding failed:', error);
    }

    // http://bas.rjpinfotek.com:5000//api/employee/update-role/${r._id}

  }


  return (
    <div className='mt-8 border p-4 rounded-md'>
      <h3 className="text-gray-700 font-semibold my-5 text-lg">Edit Employee</h3>

      {/* Search Employee by email */}
      <div className="flex justify-between">
        <div>
          <Label>Search By Email</Label>
          <Input placeholder="Search By email Id..." value={searchEmp} onChange={(e) => handleSearch(e)}/>
          {
              (
                searchEmp !== "" && 
                (
                  <div className=" border mt-1 rounded-md p-1">
                    {
                      filteredUsers.map((e,_i) => (
                        <div key={_i} className="cursor-pointer my-1 hover:bg-gray-200 rounded-md p-2" onClick={() => {
                          setEmp(e)
                          setFilteredUsers([])
                          setSearchEmp("")
                        }}>  
                          <p>{e.email}</p>
                        </div>
                      ))
                    }
                  </div>
                )
              )
            }
        </div>

      </div>

      {/* Print the result */}
      <div className="mt-14 grid grid-cols-1 border-t-[1px] pt-3">
            {
              emp && (
                <Card className="w-max">
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form>
                      <div className="grid w-full items-center gap-4">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Name of your Employee" value={emp.name} readOnly/>
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="Email" value={emp.email} readOnly/>
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="framework">Roles</Label>
                            <Select onValueChange={(e) => handleRoleChange(e)}>
                              <SelectTrigger id="framework">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                <SelectItem value="Manager">Manager</SelectItem>
                                <SelectItem value="Trainer Sourcer">Trainer Sourcer</SelectItem>
                                <SelectItem value="KeyAccounts">KeyAccounts</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="Current Roles">Current Roles</Label>
                            <div className='flex items-start flex-col'>
                              {
                                emp.role?.map((e, i) => (
                                  <span className='flex my-2 py-[3px] px-[12px] rounded-full bg-blue-100 font-light border-black border w-max' key={i}>{e.name}</span>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={changeRole}>Change Roles</Button>
                  </CardFooter>
                </Card>
              )
            }
      </div>


    

    </div>
  )
}

export default EditEmployee
