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
import axios from 'axios'


function AddProject() {

    const [projectData,
        setProjectData] = useState({
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
            startDate: '',
            endDate: '',
            timing: ''
        },
        modeOfTraining: '',
        employee: [],
        trainers: []
    });

    const [companyData, setCompanyData] = useState([])
    const [companyContactData, setCompanyContactData] = useState([])

    const handleChange = (e) => {
        const {name, value} = e.target;
        console.log(value)
        // Update nested fields if necessary
        if (name.includes('.')) {
            const keys = name.split('.');
            if(keys[0] === 'company'){
                console.log("COmp")
                setProjectData(prevData => ({
                   ...prevData,
                    company: {
                        name: e.target.value,
                        id: companyData.find(c => c.companyName === value)._id
                    }
                }));
                console.log(companyData.find(c => c.companyName === value))
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
        console.log(a)
        setProjectData(prevData => ({
            ...prevData,
            contactDetails: {
                name: a?.contactName,
                contactEmail: a?.contactEmail,
                contactPhoneNumber: a?.contactPhoneNumber
            }
        }));
    }

    // Fetch the DATA of companies and contact Person
    const fetchCompaniesAndContactPerson = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/company/company');
            const data = await response.data
            console.log(data.companies)
            setCompanyData(data.companies);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        console.log("Meow")
        // Fetch All the Company Name and the Contact Person
        fetchCompaniesAndContactPerson()

    }, [])

    const handleCompanySelect = (value) => {
        console.log(value)
        setProjectData(prevData => ({
            ...prevData,
            company: { id: value.is, name: value.companyName }
        }));
    }


    useEffect(() => {

    }, [projectData.company.name])

    console.log(projectData)

    return (
        <div className=''>
            <div className='border-b-[1px] pb-5'>
                <h2 className='font-semibold text-lg'>Create Project</h2>
            </div>

            <div className='mt-8'>
                {/* Project details form */}
                <form>
                    <div>
                        <div>
                            <h2 className='font-semibold'>Project Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-8">
                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Project Name</Label>
                                <Input
                                    type="text"
                                    name="projectName"
                                    value={projectData.projectName}
                                    onChange={handleChange}/>
                            </div>

                            <div className="flex items-center justify-between">
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
                                    console.log(value.target.value)
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
                                <Label className="font-normal mr-4">Domain</Label>
                                <Input
                                    type="text"
                                    name="domain"
                                    value={projectData.domain}
                                    onChange={handleChange}/>
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
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Training Start Date</Label>
                                <Input
                                    type="date"
                                    name="trainingDates.startDate"
                                    value={projectData.trainingDates.startDate}
                                    onChange={handleChange}/>
                                   
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Training End Date</Label>
                                <Input
                                    type="date"
                                    name="trainingDates.endDate"
                                    value={projectData.trainingDates.endDate}
                                    onChange={handleChange}/>
                            </div>

                            <div className="flex items-center justify-between">
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
                    <div className='mt-10'>
                        <div>
                            <h2 className='font-semibold'>Contact Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-8">
                            {/* Other fields for company and contact details */}
                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Contact Name</Label>
                                <select name="contactDetails.contactName" id="" className='w-[300px]' onChange={(e) => {
                                    // console.log(e.target.value)
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
                                <Label className="font-normal mr-4">Contact Email</Label>
                                <Input
                                    type="email"
                                    name="contactDetails.contactEmail"
                                    value={projectData.contactDetails.contactEmail}
                                    onChange={handleChange}/>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="font-normal mr-4">Contact Number</Label>
                                <Input
                                    type="text"
                                    name="contactDetails.contactPhoneNumber"
                                    value={projectData.contactDetails.contactPhoneNumber}
                                    onChange={handleChange}/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            {/* {
                JSON.stringify(projectData)
            } */}
        </div>
    )
}

export default AddProject
