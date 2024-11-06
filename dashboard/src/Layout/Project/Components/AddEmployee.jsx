import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'

function AddEmployee() {
    const {allEmployee} = useSelector(state => state.employee)
    const {project} = useSelector(state => state.project)

    console.log(project)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [employees, setEmployees] = useState([])
    const [selectedEmployees, setSelectedEmployees] = useState([])

    useEffect(() => {
        if(allEmployee){
            // setEmployees(allEmployee)
        }
    }, [])

    const handleSearchEmployee = (searchTerm) => {
        const filteredEmployees = allEmployee.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setEmployees(filteredEmployees)
        // console.log(filteredEmployees)
    }

    const handleSelectedEmployee = (emp) => {
        if(selectedEmployees.includes(emp)){
            setSelectedEmployees(selectedEmployees.filter(e => e.id!== emp.id))
        } else {
            setSelectedEmployees([...selectedEmployees, emp])
        }

        setSearchTerm("")
    }

    const handleDeleteSelectedEmployee = (emp) => {
        // console.log(emp)
        let a = selectedEmployees.filter(e => e._id !== emp._id)
        // console.log(a)
        setSelectedEmployees(a)
    }

  return (
    <div className='mt-8'>
        
        {/* Search Employees - add btn*/}
        <div className='relative'>
            <div className='flex items-center justify-between'>
                <div className='border px-2 w-max flex items-center rounded-md'>
                    <ion-icon name="search-outline" style={{fontSize:"20px", marginRight:"10px"}}></ion-icon>
                    <Input
                        placeholder="Search emails..."
                        value={searchTerm}
                        // onChange={(eve
                            // table.getColumn("email")?.setFilterValue(event.target.value)
                        onChange={(e) => {
                            handleSearchEmployee(event.target.value)
                            setSearchTerm(event.target.value)
                        }}
                        className="max-w-lg border-none"
                    />
                </div>
                <div className="flex items-center">
                    <ion-icon name="checkmark-done-outline" style={{fontSize:"20px", color:"#4CAF50"}}></ion-icon>
                    <span>Selected {selectedEmployees.length} Employees</span>
                </div>
            </div>

            {
                (employees.length > 0 && searchTerm !== "") && (
                    <div className='absolute w-max z-50 bg-white border rounded-md mt-[4px] mb-10 shadow-md'>
                        <div className="ml-2">
                            <div className='flex items-center my-2 cursor-pointer px-2 justify-between'>
                                        <Table>
                                            <TableCaption>A list of your recent invoices.</TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px]">S.no</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                            {
                                                employees.map((emp, _i) => (
                                                    <TableRow key={_i} className="hover:bg-gray-100">
                                                        <TableCell className="font-medium">{_i+1}</TableCell>
                                                        <TableCell>{emp.name}</TableCell>
                                                        <TableCell>{emp.email}</TableCell>
                                                        <TableCell>
                                                            {
                                                                emp.role?.map((role, _j) => (
                                                                    <span className='border px-[12px] mx-2 bg-blue-200 rounded-full'>{role.name}</span>
                                                                ))
                                                            }
                                                        </TableCell>
                                                        <Button className="rounded-none" onClick={() => handleSelectedEmployee(emp)}>Add +</Button>
                                                    </TableRow>
                                                ))
                                            }
                                                
                                            </TableBody>
                                        </Table>
                                        
                            </div>
                        </div>
                    </div>
                )
            }
        </div>

        {
            (selectedEmployees && selectedEmployees.length > 0) && 
                <div className='mt-10'>
                    <Table>
                        <TableCaption>Selected Employees for the Training.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">S.no</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                selectedEmployees.map((emp, _i) => (
                                    <TableRow key={_i} className="hover:bg-gray-100">
                                        <TableCell className="font-medium">{_i+1}</TableCell>
                                        <TableCell>{emp.name}</TableCell>
                                        <TableCell>{emp.email}</TableCell>
                                        <TableCell>
                                            {
                                                emp.role?.map((role, _j) => (
                                                    <span className='border px-[12px] mx-2 bg-blue-200 rounded-full'>{role.name}</span>
                                                ))
                                            }
                                        </TableCell>
                                        <TableCell className="rounded-none cursor-pointer" onClick={() => handleDeleteSelectedEmployee(emp)}>
                                            <ion-icon name="trash-outline" style={{fontSize:"24px", color:"red"}}></ion-icon>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            
                        </TableBody>
                    </Table>
                </div>
        }

    </div>
  )
}

export default AddEmployee
