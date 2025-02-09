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
import { useQueryClient } from 'react-query'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from '@/utils/api'
// import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
// import {Label} from '@/components/ui/label'
// import {Button} from '@/components/ui//button'

function AddProject() {
    const {toast} = useToast() 
    const navigate = useNavigate()
    // Emp Selector
    const {allEmployee} = useSelector(state => state.employee)
    const {currentUser} = useSelector(state => state.auth)
    const queryClient = useQueryClient();
    const [selectedDomain, setSelectedDomain] = useState("");
    const [domainsData, setDomainsData] = useState([]);
    const fetchDomains = async () => {
        // setLoading(true);
        try {
          const response = await api.get("/domains");
        //   setDomains(response.data.domains);
        setDomainsData(response.data.domains);
        } catch (error) {
          console.error("Error fetching domains:", error);
        }
        // setLoading(false);
      };
    const dispatch = useDispatch()

    useEffect(() => {
        fetchDomains()
    }, [])
    
    // Domain Search States
    const [open,
        setOpen] = useState(false)
    const [value,
        setValue] = useState("")
    const [specialTimingInput,
            setSpecialTimingInput] = useState({date: null, startTime: null, endTime: null});
    
    
    const [projectData,
        setProjectData] = useState({
        projectName: '',
        amount:null,
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
            startDate: null,
            endDate: null,
            startTime: null,
            endTime: null,
            specialTimings: []
        },
        modeOfTraining: '',
        employees: [],
        trainers: []
    });
    console.log(projectData)

    const [companyData, setCompanyData] = useState([])
    const [companyContactData, setCompanyContactData] = useState([])

    // const handleDateChange = (e) => {
    //     const {name, value} = e.target;
    //     console.log(name, value);
    //     const keys = name.split('.');

    //     setProjectData(prevData => ({
    //         ...prevData,
    //         [keys[0]]: {
    //             ...prevData.trainingDates,
    //             [keys[1]]: value
    //         }
    //     }));
    // }
    console.log(projectData)

    const handleDateChange = (value, name) => {
        // console.log(e)
        // const { name, value } = e.target;
        console.log(value, name)
        const keys = name.split('.');
    
        setProjectData((prevData) => {
            const updatedField = { ...prevData[keys[0]], [keys[1]]: value };
            return { ...prevData, [keys[0]]: updatedField };
        });
    };

    const handleSpecialTimingInputChange = (field, value) => {
        setSpecialTimingInput((prevInput) => ({
            ...prevInput,
            [field]: value,
        }));

     
    };
    console.log('domain ', domainsData)

    const getFilteredResults = (searchTerm) => {
        setValue(searchTerm);
    
        if (!searchTerm) {
            setFilterResults(domainsData);
            return;
        }
    
        const lowercasedTerm = searchTerm.toLowerCase();
    
        const filteredDomains = domainsData
            .map(domainGroup => {
                const filteredDomainsList = domainGroup.domains
                    .map(domain => {
                        // Check if the search term matches the domain name
                        if (domain.name.toLowerCase() === lowercasedTerm) {
                            return domain;
                        }
    
                        // Check if the search term matches any subdomain
                        const subdomainMatch = domain.subdomains.some(
                            subdomain => subdomain.toLowerCase().includes(lowercasedTerm)
                        );
    
                        // If subdomain matches or the domain name includes the search term, return the full domain
                        if (domain.name.toLowerCase().includes(lowercasedTerm) || subdomainMatch) {
                            return {
                                ...domain,
                                subdomains: domain.subdomains // Return full subdomain list
                            };
                        }
    
                        return null;
                    })
                    .filter(domain => domain !== null);
    
                if (filteredDomainsList.length > 0) {
                    return {
                        ...domainGroup,
                        domains: filteredDomainsList
                    };
                }
                return null;
            })
            .filter(group => group !== null);
    
        setFilterResults(filteredDomains);
    };
    
    
    const addSpecialTiming = () => {
        setProjectData((prevData) => ({
            ...prevData,
            trainingDates: {
                ...prevData.trainingDates,
                specialTimings: [
                    ...prevData.trainingDates.specialTimings,
                    specialTimingInput,
                ],
            },
        }));
        setSpecialTimingInput({ date: null, startTime: null, endTime: null }); // Reset special timing input
    };
    
    

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
            const response = await api.get('/company/company');
            const data = await response.data
            console.log(data.companies)
            setCompanyData(data.companies);
        } catch (error) {
            // console.error('Error:', error);
        }
    }

    useEffect(() => {
        // Fetch All the Company Name and the Contact Person
        fetchCompaniesAndContactPerson()

    }, [])


    // console.log(projectData)
  
    // const getFilteredResults = (searchTerm) => {
    //     setValue(searchTerm)
    //     // console.log(searchTerm)
    //     if (!searchTerm) return [];
    //     // console.log("searchTerm", searchTerm)
    //     const lowercasedTerm = searchTerm.toLowerCase();

    //     const a = domains   
    //         .map((domain) => {
    //             const filteredSubtopics = domain.subtopics
    //                 .map((subtopic) => {
    //                     // Include subtopic if its name or topic matches, or any of its points match
    //                     const matchesSubtopic = subtopic.subtopic.toLowerCase().includes(lowercasedTerm);
    //                     const matchesTopic = domain.topic.toLowerCase().includes(lowercasedTerm);

    //                     // Filter points that match the search term
    //                     const filteredPoints = subtopic.points.filter((point) =>
    //                         point.toLowerCase().includes(lowercasedTerm)
    //                     );

    //                     // If subtopic or topic matches, include all points; otherwise, include only filtered points
    //                     if (matchesSubtopic || matchesTopic || filteredPoints.length > 0) {
    //                         return { ...subtopic, points: matchesSubtopic || matchesTopic ? subtopic.points : filteredPoints };
    //                     }

    //                     return null;
    //                 })
    //                 .filter((subtopic) => subtopic !== null);

    //             // Include the domain if it has any matching subtopics
    //             if (filteredSubtopics.length > 0) {
    //                 return { ...domain, subtopics: filteredSubtopics };
    //             }

    //             return null;
    //         })
    //         .filter((domain) => domain !== null);

    //     // console.log("A ", a)
    //     setFilterResults(a);
    // };

    const [filteredResults, setFilterResults] = useState(domains);
    // console.log(domains)

    // EMPLOYEE
    const {project} = useSelector(state => state.project)

    // console.log(project)
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

    // console.log(projectData.contactDetails)


    // Submit the Form
    

    const handleSubmit = async(e) => {
        e.preventDefault()
        // console.log(projectData)
        // Submit the form data to the server
        // if(projectD)
        try{
            const result = await api.post(`/project/create/${currentUser.employee._id}`, projectData)
            const response = await result.data;
            // if(response.data?.project._id){
            //     navigate(`home/projects/view/${response.data?.project._id}`)
            // }
            console.log(response.project._id)
            // navigate(`/home/projects/view/${response.project._id}`)
            setProjectData({
                projectName: '',
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
                    startDate: null,
                    endDate: null,
                    startTime: null,
                    endTime: null,
                    specialTimings: []
                },
                modeOfTraining: '',
                employee: [],
                trainers: []
            })
            queryClient.invalidateQueries(['projects', currentUser.employee._id ])

            toast({
                title: "Project Created",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
            
            navigate(`/home/projects/view/${response.project._id}`)

        }catch(err){
            console.error('Error:', err);
            if (err.response) {
                toast({
                    title: "Project Not Created",
                    variant:"destructive",
                    description: `${err.response.data.message}`,
                })
                // setError(err.response.data.message); // Backend error message
            } else {
                // setError('An unexpected error occurred.');
                toast({
                    title: "Project Not Created",
                    variant:"destructive",
                    description: 'An unexpected error occurred'
                    // description: "Friday, February 10, 2023 at 5:57 PM",
                })
            }
           
        }
    }



    return (
        <div className=''>
            <div className='border-b-[1px] pb-5'>
                <h2 className='font-semibold text-lg'>Create Deal</h2>
            </div>
            <div className='mt-8'>
                {/* Deal details form */}
                <form onSubmit={handleSubmit}>
                    <div className='border rounded-md py-5 px-3'>
                        <div>
                            <h2 className='font-semibold '>Deal Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-8">
                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Deal Name <span className='text-red-600'>*</span></Label>
                                <Input
                                    type="text"
                                    name="projectName"
                                    value={projectData.projectName}
                                    onChange={handleChange}/>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Company Name <span className='text-red-600'>*</span></Label>
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

                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Training Technology <span className='text-red-600'>*</span></Label>
                                <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between"
                >
                    {!selectedDomain ? (
                        <span className="flex items-center text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Select Domain
                        </span>
                    ) : (
                        <span className="flex items-center justify-between w-full">
                            <span>{selectedDomain}</span>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDomain("");
                                    setValue("");
                                    // console.log(e)
                                }}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <div className="flex flex-col">
                    <Input
                        className="flex m-2 border rounded"
                        placeholder="Search domains..."
                        value={value}
                        onChange={(e) => getFilteredResults(e.target.value)}
                    />
                    <div className="max-h-[300px] overflow-y-auto">
                        {filteredResults.length === 0 ? (
                            <div className="p-2 text-sm text-gray-500">No results found.</div>
                        ) : (
                            filteredResults.map((domainGroup) => (
                                <div key={domainGroup._id}>
                                    {domainGroup?.domains?.map((domain) => (
                                        <div key={domain._id}>
                                            <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 bg-gray-100">
                                                {domain.name}
                                            </div>
                                            {domain.subdomains.map((subdomain) => (
                                                <button
                                                    key={subdomain}
                                                    className="w-full px-2 py-1.5 text-sm text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                                    onClick={() => {
                                                        setSelectedDomain(subdomain);
                                                        setOpen(false);
                                                        setValue("");
                                    console.log(subdomain)
                                    setProjectData({...projectData, domain:subdomain})

                                                    }}
                                                >
                                                    {subdomain}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={projectData.description}
                                    onChange={handleChange}/>
                            </div>

                            <div className="flex items-center justify-between">
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
                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>


                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Amount (₹)</Label>
                                <Input
                                    type="text"
                                    name="amount"
                                    value={projectData.amount}
                                    onChange={handleChange}/>
                            </div>
                        </div>
                    </div>

                     
                    <div className='mt-10 border rounded-md py-5 px-3'>
                        <div>
                            <h2 className='font-semibold '>Training Dates</h2>
                        </div>
                        <div className="grid grid-cols-4 gap-8 mt-8">
                            <div className="flex flex-col">
                                <Label>Training start Date</Label>
                                    <DatePicker
                                    // selected={formValues.startDate}
                                    // onChange={(date) => handleInputChange("startDate", date)}
                                    dateFormat="dd/MM/yyyy"
                                    name="trainingDates.startDate"
                                    selected={projectData.trainingDates.startDate}
                                     onChange={(date) => handleDateChange(date, "trainingDates.startDate")}
                                    className="px-3 py-2 border border-gray-400 mt-1 rounded-md"
                                    />
                                   
                            </div>

                            <div className="flex flex-col">
                                <Label>Training End Date</Label>
                                 <DatePicker
                                    // selected={formValues.endDate}
                                    name="trainingDates.endDate"
                                    selected={projectData.trainingDates.endDate}
                                     onChange={(date) => handleDateChange(date, "trainingDates.endDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="px-3 py-2 border border-gray-400 mt-1 rounded-md ml-2"
                                    />
                            </div>
                            <div>
                                <Label>Start Time:</Label>
                                <DatePicker
                                    // selected={formValues.startTime}
                                    name="trainingDates.startTime"
                                    selected={projectData.trainingDates.startTime}
                                    onChange={(date) => handleDateChange(date, "trainingDates.startTime")}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border border-gray-400 mt-1 rounded-md ml-2"
                                    dateFormat="h:mm aa"
                                    />
                            </div>
                            <div>
                                <Label>End Time:</Label>
                                <DatePicker
                                    // selected={formselecteds.endTime}
                                    name="trainingDates.endTime"
                                    selected={projectData.trainingDates.endTime}
                                    onChange={(date) => handleDateChange(date, "trainingDates.endTime")}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border border-gray-400 mt-1 rounded-md ml-2"
                                    dateFormat="h:mm aa"
                                    />
                            </div>

                            {/* <div className="flex items-center ">
                                <Label className="font-normal mr-4">Training Timing</Label>
                                <Input
                                    type="text"
                                    name="trainingDates.timing"
                                    value={projectData.trainingDates.timing}
                                    onChange={handleChange}/>
                            </div> */}
                        </div>
                        <div className="  mt-10">
                            <h4 className="font-semibold my-4">Special Timings</h4>
                            <div className="grid grid-cols-3">
                                <div>
                                    <Label>Date:</Label>
                                    <DatePicker
                                        className="px-3 py-2 border border-gray-400 mt-1 rounded-md ml-2"
                                        selected={specialTimingInput.date}
                                        onChange={(date) => handleSpecialTimingInputChange("date", date)}
                                        dateFormat="dd/MM/yyyy"/>
                                </div>
                                <div>
                                    <Label>Start Time:</Label>
                                    <DatePicker
                                        className="px-3 py-2 border border-gray-400 mt-1 rounded-md ml-2"
                                        selected={specialTimingInput.startTime}
                                        onChange={(time) => handleSpecialTimingInputChange("startTime", time)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"/>
                                </div>
                                <div>
                                    <Label>End Time:</Label>
                                    <DatePicker
                                        className="px-3 py-2 border border-gray-400 mt-1 rounded-md ml-2"
                                        selected={specialTimingInput.endTime}
                                        onChange={(time) => handleSpecialTimingInputChange("endTime", time)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"/>
                                </div>
                            </div>
                            <div className="mt-8">
                                <Button type="button" onClick={addSpecialTiming}>
                                    Add Special Timing
                                </Button>
                            </div>
                            <ul>
                                {/* {formValues
                                    .specialTimings
                                    .map((special, index) => (
                                        <li key={index}>
                                            {moment(special.date).format("YYYY-MM-DD")}
                                            |{" "} {moment(special.startTime).format("h:mm A")}
                                            -{" "} {moment(special.endTime).format("h:mm A")}
                                        </li>
                                    ))} */}
                            </ul>
                        </div>
                    </div>


                    {/* Company Contact Details */}
                    <div className='mt-10 border rounded-md py-5 px-3'>
                        <div>
                            <h2 className='font-semibold '>Contact Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-8">
                            {/* Other fields for company and contact details */}
                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Contact Name <span className='text-red-600'>*</span></Label>
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

                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Contact Email <span className='text-red-600'>*</span></Label>
                                <Input
                                    type="email"
                                    name="contactDetails.contactEmail"
                                    value={projectData.contactDetails.contactEmail}
                                    onChange={handleChange}/>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Contact Number <span className='text-red-600'>*</span></Label>
                                <Input
                                    type="text"
                                    name="contactDetails.contactPhoneNumber"
                                    value={projectData.contactDetails.contactPhoneNumber}
                                    onChange={handleChange}/>
                            </div>
                        </div>
                    </div>

       
                    <div className='flex justify-center my-10'>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProject
