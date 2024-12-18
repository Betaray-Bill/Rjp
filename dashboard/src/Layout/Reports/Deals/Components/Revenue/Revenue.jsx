import React, {Fragment, useEffect, useState} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import axios from 'axios'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import RevenueResult from './RevenueResult'

function Revenue() {
    const [option,
        setOption] = useState("")

    const [companyData,
        setCompanyData] = useState([])

    const [startDate,
        setStartDate] = useState("");
    const [endDate,
        setEndDate] = useState("");
    const [company, setCompany] = useState("")
    const [result, setResult] = useState([])

    useEffect(() => {
        if (option === "Client") {
            // Fetch client data
            fetchCompany()
        }
    }, [option])

    const fetchCompany = async() => {
        // Fetch client data from API
        try {
            const response = await axios.get('http://localhost:5000/api/company/getAll-company');
            const data = await response.data;
            console.log(data)
            setCompanyData(data);

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const submitHandler = async() => {
        // Fetch client data from API
        try {
            const params = new URLSearchParams();

            if (company && company !== "All") 
                params.append("company", company);
            if (startDate) 
                params.append("startDate", startDate);
            if (endDate) 
                params.append("endDate", endDate);
            
            const response = await axios.get(`http://localhost:5000/api/reports/get-revenue/company/${company}?${params.toString()}`);
            const data = await response.data;
            console.log(data)
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className='border-t pt-2 mt-5'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-black text-lg font-semibold'>Revenue</h1>
                </div>
                <div>
                    <div>
                        <Select onValueChange={(e) => {setOption(e); setResult([])}}>
                            <SelectTrigger className="w-max min-w-[150px]">
                                <SelectValue placeholder="Select Option"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Client">Client</SelectItem>
                                <SelectItem value="Key Accounts Manager">Key Accounts Manager</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>
                </div>
            </div>

            <div className='flex items-center justify-start mt-5'>

                {option === "Client" && <div className="mx-2">
                    <Select onValueChange={(e) => setCompany(e)} value={company}>
                        <SelectTrigger className="w-max min-w-[150px]">
                            <SelectValue placeholder="Select Client"/>
                        </SelectTrigger>
                        <SelectContent>
                            {companyData && companyData
                                ?.map((company) => (
                                    <SelectItem value={company.companyName}>{company.companyName}</SelectItem>

                                ))
}
                        </SelectContent>
                    </Select>
                </div>
}
                {option && (
                    <Fragment>
                        <div className="mx-2">
                            <Input
                                className="w-max"
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}/>
                        </div>

                        <div className="mx-2">
                            <Input
                                className="w-max"
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}/>
                        </div>

                        <div className="mx-2">
                            <Button onClick={submitHandler}>Submit</Button>
                        </div>
                    </Fragment>
                )
}
            </div>

            {
                result && result.length > 0 && <RevenueResult result={result} />
            }
        </div>
    )
}

export default Revenue
