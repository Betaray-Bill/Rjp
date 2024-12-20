import React, {Fragment, useEffect, useState} from 'react'
import Column from './Components/Column';
import axios from 'axios';
import {useQuery, useQueryClient} from 'react-query';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import CardProject from '@/Layout/Project/Pipeline/Components/CardProject';
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"

// Example usage console.log(StagesEnum.TRAINING_REQUIREMENT); // Output:
// "Training Requirement"

function PipeLine() {
    const [companyData,
        setCompanyData] = useState([]);
    const [companyId,
        setCompanyId] = useState("");
    const [startDate,
        setStartDate] = useState("");
    const [endDate,
        setEndDate] = useState("");
    const [projects,
        setProjects] = useState([]);
    const [isLoading,
        setIsLoading] = useState(false);
    const [error,
        setError] = useState(null);

    const {currentUser} = useSelector(state => state.auth);

    // const {toast} = Fetch Companies
    const fetchCompaniesAndContactPerson = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/company/company');
            const data = await response.data;
            setCompanyData(data.companies);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchCompaniesAndContactPerson();
    }, []);

    // Fetch Projects API
    const fetchProjects = async() => {
        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (companyId && companyId !== "All") 
                params.append("companyId", companyId);
            if (startDate) 
                params.append("startDate", startDate);
            if (endDate) 
                params.append("endDate", endDate);
            const response = await axios.get(`http://localhost:5000/api/project/projects-employees/${currentUser.employee._id}?${params.toString()}`);
            setProjects(response.data.projects);
            
         
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyFilter = () => {
        fetchProjects(); // Trigger data fetch when Apply Filter is clicked
    };

    if (isLoading) 
        return <div>Loading...</div>;
    if (error) 
        return <div>Error: {error.message}</div>;
    
    return (
        <Fragment>
            <div className='mb-3 '>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">
                            <div className='px-2 py-2 w-max flex items-center cursor-pointer'>
                                <ion-icon name="funnel-outline"></ion-icon>
                                <span className='ml-1 font-medium'>Filter</span>
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none text-sm">Filter By Client and Dates</h4>
                            </div>
                            <div className="grid gap-2">
                                <div>
                                    <select
                                        name="company"
                                        className='w-max text-sm'
                                        onChange={(e) => setCompanyId(e.target.value)}
                                        value={companyId}>
                                        <option value="All">All Company</option>
                                        {companyData.map(company => (
                                            <option key={company._id} value={company._id}>
                                                {company.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4 text-sm">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                      className="w-max"
                                        type="date"
                                        id="startDate"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}/>
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4 text-sm">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                      className="w-max"
                                        type="date"
                                        id="endDate"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}/>
                                </div>
                                <div>
                                    <Button
                                        variant="outline"
                                        className='w-max bg-blue-700 text-white'
                                        onClick={handleApplyFilter}>
                                        Apply Filter
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className='overflow-x-auto overflow-y-hidden'>
                <div className='flex space-x-6 w-[max]'>
                    {projects && projects.map((e, index) => (<Column key={index} index={index} stage={e.name} projects={e.projects}/>))}
                </div>
            </div>
        </Fragment>
    )
}

export default PipeLine
