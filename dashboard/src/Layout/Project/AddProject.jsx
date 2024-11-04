import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import React, {useEffect, useState} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import axios, { all } from 'axios'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { domains } from '@/utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import AddEmployee from './Components/AddEmployee'
import { setCredentials } from '@/features/projectSlice'
import { useToast } from '@/hooks/use-toast'
import { setDomainResults } from '@/features/searchTrainerSlice'
import { useNavigate } from 'react-router-dom'
// import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
// import {Label} from '@/components/ui/label'
// import {Button} from '@/components/ui//button'

function AddProject() {
    const {toast} = useToast() 
    const navigate = useNavigate()
    // Emp Selector
    const {allEmployee} = useSelector(state => state.employee)
    const {currentUser} = useSelector(state => state.auth)
    

    const dispatch = useDispatch()
    
    // Domain Search States
    const [open,
        setOpen] = useState(false)
    const [value,
        setValue] = useState("")

    const [projectData,
        setProjectData] = useState({
        projectName: '',
        projectOwner:currentUser && currentUser.employee._id,
        company: {
            name: '',
            id: ''
        },
        contactDetails: {
            contactName: '',
            contactEmail    : '',
            contactPhoneNumber: ''
        },
        domain: '',
        description: '',
        trainingDates: {
            startDate: '',
            endDate: '',
            timing: ''
        },
        modeOfTraining: '',
        employees: [],
        trainers: []
    });

    const [companyData, setCompanyData] = useState([])
    const [companyContactData, setCompanyContactData] = useState([])

    const handleChange = (e) => {
        const {name, value} = e.target;
        // console.log(value)
        // Update nested fields if necessary
        if (name.includes('.')) {
            const keys = name.split('.');
            if(keys[0] === 'company'){
                // console.log("COmp")
                setProjectData(prevData => ({
                   ...prevData,
                    company: {
                        name: e.target.value,
                        id: companyData.find(c => c.companyName === value)._id
                    }
                }));
                // console.log(companyData.find(c => c.companyName === value))
                setCompanyContactData(companyData.find(c => c.companyName === value).contact_details)
            }else{
                setProjectData(prevData => ({
                    ...prevData,
                    [keys[0]]: {
                        ...prevData[keys[0]],
                        [keys[1]]: value
                    }
                }));
            }
        } else {
            setProjectData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }

        
    };

    const handleContactChange = value => {
        let a = companyContactData.find(c => c.contactName === value)
        // console.log(a)
        setProjectData(prevData => ({
            ...prevData,
            contactDetails: {
                name: a?.contactName,
                contactEmail: a?.contactEmail,
                contactPhoneNumber: a?.contactPhoneNumber
            }
        }));

        dispatch(setCredentials({ ...projectData}))
    }

    // Fetch the DATA of companies and contact Person
    const fetchCompaniesAndContactPerson = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/company/company');
            const data = await response.data
            // console.log(data.companies)
            setCompanyData(data.companies);
        } catch (error) {
            // console.error('Error:', error);
        }
    }

    useEffect(() => {
        // Fetch All the Company Name and the Contact Person
        fetchCompaniesAndContactPerson()

    }, [])

    useEffect(() => {

    }, [projectData.company.name])

    // console.log(projectData)
  
    const getFilteredResults = (searchTerm) => {
        setValue(searchTerm)
        // console.log(searchTerm)
        if (!searchTerm) return [];
        // console.log("searchTerm", searchTerm)
        const lowercasedTerm = searchTerm.toLowerCase();

        const a = domains   
            .map((domain) => {
                const filteredSubtopics = domain.subtopics
                    .map((subtopic) => {
                        // Include subtopic if its name or topic matches, or any of its points match
                        const matchesSubtopic = subtopic.subtopic.toLowerCase().includes(lowercasedTerm);
                        const matchesTopic = domain.topic.toLowerCase().includes(lowercasedTerm);

                        // Filter points that match the search term
                        const filteredPoints = subtopic.points.filter((point) =>
                            point.toLowerCase().includes(lowercasedTerm)
                        );

                        // If subtopic or topic matches, include all points; otherwise, include only filtered points
                        if (matchesSubtopic || matchesTopic || filteredPoints.length > 0) {
                            return { ...subtopic, points: matchesSubtopic || matchesTopic ? subtopic.points : filteredPoints };
                        }

                        return null;
                    })
                    .filter((subtopic) => subtopic !== null);

                // Include the domain if it has any matching subtopics
                if (filteredSubtopics.length > 0) {
                    return { ...domain, subtopics: filteredSubtopics };
                }

                return null;
            })
            .filter((domain) => domain !== null);

        // console.log("A ", a)
        setFilterResults(a);
    };

    const [filteredResults, setFilterResults] = useState(domains);
    console.log(domains)

    // EMPLOYEE
    const {project} = useSelector(state => state.project)

    console.log(project)
    // const [open, setOpen] = useState(false)
    // const [valueEmp, setValueEmp] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [employees, setEmployees] = useState([])
    const [selectedEmployees, setSelectedEmployees] = useState([])


    const handleSearchEmployee = (searchTerm) => {
        const filteredEmployees = allEmployee.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setEmployees(filteredEmployees)
        // console.log(filteredEmployees)
    }

    const handleSelectedEmployee = (emp) => {
        if(selectedEmployees.includes(emp)){
            setSelectedEmployees(selectedEmployees.filter(e => e.id!== emp.id))
            let empl = selectedEmployees.map(e => e._id);
            empl.push(emp._id)
            setProjectData(prevData => ({
                ...prevData,
                employees: empl
            }));
    
        } else {
            setSelectedEmployees([...selectedEmployees, emp])
            let empl = selectedEmployees.map(e => e._id);
            empl.push(emp._id)
            setProjectData(prevData => ({
                ...prevData,
                employees: empl
            }));
        }

        setSearchTerm("")
    }

    const handleDeleteSelectedEmployee = (emp) => {
        // console.log(emp)
        let a = selectedEmployees.filter(e => e._id !== emp._id)
        // console.log(a)
        setProjectData(prevData => ({
            ...prevData,
            employees: a.map(e => e._id)
        }));

        setSelectedEmployees(a)
    }

    console.log(projectData.contactDetails)


    // Submit the Form
    

    const handleSubmit = async(e) => {
        e.preventDefault()
        // console.log(projectData)
        // Submit the form data to the server
        try{
            const result = await axios.post(`http://localhost:5000/api/project/create/${currentUser.employee._id}`, projectData)
            const response = await result.data;
            // if(response.data?.project._id){
            //     navigate(`home/projects/view/${response.data?.project._id}`)
            // }
            console.log(response.project._id)
            navigate(`view/${response.project._id}`)
            // setProjectData({
            //     projectName: '',
            //     company: {
            //         name: '',
            //         id: ''
            //     },
            //     contactDetails: {
            //         contactName: '',
            //         contactEmail    : '',
            //         contactPhoneNumber: ''
            //     },
            //     domain: '',
            //     description: '',
            //     trainingDates: {
            //         startDate: '',
            //         endDate: '',
            //         timing: ''
            //     },
            //     modeOfTraining: '',
            //     employee: [],
            //     trainers: []
            // })
            toast({
                title: "Project Created",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })

        }catch(err){
            console.error('Error:', err);
        }
    }



    return (
        <div className=''>
            <div className='border-b-[1px] pb-5'>
                <h2 className='font-semibold text-lg'>Create Project</h2>
            </div>

            <div className='mt-8'>
                {/* Project details form */}
                <form onSubmit={handleSubmit}>
                    <div className='border rounded-md py-5 px-3'>
                        <div>
                            <h2 className='font-semibold '>Project Information</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-8 mt-8">
                            <div className="flex items-center justify-start">
                                <Label className="font-normal mr-4">Project Name</Label>
                                <Input
                                    type="text"
                                    name="projectName"
                                    value={projectData.projectName}
                                    onChange={handleChange}/>
                            </div>

                            <div className="flex items-center justify-start">
                                <Label className="font-normal mr-4">Company Name</Label>
                                {/* <Select
                                    name="company.name"
                                    onValueChange={(value) => handleChange(value)
                                }>
                                    <SelectTrigger className="w-[300px]">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            companyData && companyData.map((company, index) => (
                                             <SelectItem key={index} value={company}>{company.companyName}</SelectItem>
                                            ))
                                        }

                                    </SelectContent>
                                </Select> */}
                                <select name="company.name" className='w-[300px]' id="" onChange={(value) => {
                                    handleChange(value)
                                    // console.log(value.target.value)
                                }}>
                                     <option value="">Select Company</option>
                                     {
                                          companyData && companyData.map((company, index) => (
                                             <option key={index} value={company.companyName}>{company.companyName}</option>
                                            ))
                                        }
                                </select>
                            </div>

                            <div className="flex items-center justify-start">
                                <Label className="font-normal mr-4">Domain</Label>
                                {/* <Input
                                    type="text"
                                    name="domain"
                                    value={projectData.domain}
                                    onChange={handleChange}/> */}
                                <Popover open={open} onOpenChange={setOpen} >
                                    <PopoverTrigger asChild className='p-2 rounded-md w-max min-w-[300px]:'>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="justify-start"
                                        >
                                            {!projectData.domain ? (
                                                <span className="flex items-center justify-start">
                                                    <ion-icon
                                                        name="search-outline"
                                                        style={{ fontSize: "18px", marginRight: "12px" }}
                                                    ></ion-icon>
                                                    Select Domain
                                                </span>
                                            ) : (
                                                <span className='flex items-center align-middle'>
                                                    <div className='flex items-center justify-start  text-slate-900'>
                                                        <span>{projectData.domain}</span>
                                                        <ion-icon name="close-outline" style={{ fontSize: "18px", marginLeft: "12px" }} onClick={
                                                            () => {
                                                                setOpen(false);
                                                                setValue('');
                                                                setFilterResults(domains);
                                                            }
                                                        }></ion-icon>
                                                    </div>
                                                </span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className=" p-0">
                                        <Command>
                                            <Input  className="w-max m-2 focus:ring-0 focus:ring-offset-0"    
                                                placeholder="Search Domain by..... "
                                                onChange={(e) => getFilteredResults(e.target.value)}
                                                value={value}
                                            />
                                            <CommandList>
                                                <CommandEmpty>No results found.</CommandEmpty>
                                                {filteredResults?.map((domain) => (
                                                    <CommandGroup key={domain.topic} heading={domain.topic}>
                                                        {domain.subtopics.map((subtopic) => (
                                                            <CommandGroup key={subtopic.subtopic} heading={subtopic.subtopic}>
                                                                {subtopic.points.map((point) => (
                                                                    <CommandItem
                                                                        key={point}
                                                                        value={point}
                                                                        onSelect={() => {
                                                                            // console.log("object", point)
                                                                            setProjectData(prevData => ({
                                                                                ...prevData,
                                                                                domain: point
                                                                            }))
                                                                            setOpen(false);
                                                                            setValue()
                                                                        }}
                                                                    >
                                                                        {point}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        ))}
                                                    </CommandGroup>
                                                ))}
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex items-center justify-start">
                                <Label className="font-normal mr-4">Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={projectData.description}
                                    onChange={handleChange}/>
                            </div>

                            <div className="flex items-center justify-start">
                                <Label className="font-normal mr-4">Mode of Training</Label>
                                <Select
                                    name="modeOfTraining"
                                    onValueChange={(value) => setProjectData(prevData => ({
                                    ...prevData,
                                    modeOfTraining: value
                                }))}>
                                    <SelectTrigger className="w-[300px]">
                                        <SelectValue placeholder={projectData.modeOfTraining || "Select Mode"}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Virtual">Virtual</SelectItem>
                                        <SelectItem value="In-Person">In-Person</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-start">
                                <Label className="font-normal mr-4">Training start Date</Label>
                                <Input
                                    type="date"
                                    name="trainingDates.startDate"
                                    value={projectData.trainingDates.startDate}
                                    onChange={handleChange}/>
                                   
                            </div>

                            <div className="flex items-center justify-start">
                                <Label className="font-normal mr-4">Training End Date</Label>
                                <Input
                                    type="date"
                                    name="trainingDates.endDate"
                                    value={projectData.trainingDates.endDate}
                                    onChange={handleChange}/>
                            </div>

                            <div className="flex items-center justify-start">
                                <Label className="font-normal mr-4">Training Timing</Label>
                                <Input
                                    type="text"
                                    name="trainingDates.timing"
                                    value={projectData.trainingDates.timing}
                                    onChange={handleChange}/>
                            </div>
                        </div>
                    </div>


                    {/* Company Contact Details */}
                    <div className='mt-10 border rounded-md py-5 px-3'>
                        <div>
                            <h2 className='font-semibold '>Contact Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-8">
                            {/* Other fields for company and contact details */}
                            <div className="flex items-center justify-start">
                                <Label className="font-normal mr-4">Contact Name</Label>
                                <select name="contactDetails.contactName" id="" className='w-[300px]' onChange={(e) => {
                                    console.log(e.target.value)
                                    handleContactChange(e.target.value)
                                }}>
                                    <option value="">Contact Name</option>
                                    {
                                        companyContactData && companyContactData?.map((item, _i) => (
                                             <option key={_i} value={item.contactName}>{item.contactName}</option>
                                        ))
                                    }
                                </select>
                                {/* <Input
                                    type="text"
                                    name="contactDetails.name"
                                    value={projectData.contactDetails.name}
                                    onChange={handleChange}/> */}
                            </div>

                            <div className="flex items-center justify-start">
                                <Label className="font-normal mr-4">Contact Email</Label>
                                <Input
                                    type="email"
                                    name="contactDetails.contactEmail"
                                    value={projectData.contactDetails.contactEmail}
                                    onChange={handleChange}/>
                            </div>

                            <div className="flex items-center justify-start">
                                <Label className="font-normal mr-4">Contact Number</Label>
                                <Input
                                    type="text"
                                    name="contactDetails.contactPhoneNumber"
                                    value={projectData.contactDetails.contactPhoneNumber}
                                    onChange={handleChange}/>
                            </div>
                        </div>
                    </div>

                    {/* Employee Adding Section */}
                    <div className='mt-10 border rounded-md py-5 px-3'>
                        <div>
                            <h2 className='font-semibold '>Employees Information</h2>
                        </div>
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
                    </div>

                    <div className='flex justify-center my-10'>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </div>
            {
                JSON.stringify(projectData)
            }
        </div>
    )
}

export default AddProject
