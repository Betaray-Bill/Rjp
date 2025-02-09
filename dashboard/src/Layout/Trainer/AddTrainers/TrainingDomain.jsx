import {Input} from '@/components/ui/input'
import React, {Fragment, useEffect, useState} from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui//button'
import { useDispatch, useSelector } from 'react-redux'
import { setResumeDetails } from '@/features/trainerSlice'
import api from '@/utils/api'

function TrainingDomain({}) {
    const dispatch = useDispatch();
    const { trainerDetails } = useSelector(state => state.trainer)

    // Domain Search States
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [domainsData, setDomainsData] = useState([])
    const [filteredResults, setFilterResults] = useState([])
    const [trainingDomain, setTrainingDomain] = useState([])

    const fetchDomains = async () => {
        try {
            const response = await api.get("/domains");
            setDomainsData(response.data.domains);
            setFilterResults(response.data.domains);
        } catch (error) {
            console.error("Error fetching domains:", error);
        }
    };

    useEffect(() => {
        fetchDomains();
    }, [])

    useEffect(() => {
        dispatch(setResumeDetails({name: "trainingDomain", data: trainingDomain}));
    }, [trainingDomain])

    const handleSearchTerm = (e) => {
        if (e) {
            if (trainingDomain.length == 0) {
                setTrainingDomain([
                    {
                        domain: e,
                        price: Number(),
                        paymentSession: "",
                        type:"",
                    }
                ])
            } else {
                setTrainingDomain([
                    ...trainingDomain,
                    {
                        domain: e,
                        price: Number(),
                        paymentSession: "",
                        type:""
                    }
                ])
            }
        }
    }

    const handleDelete = (index) => {       
        if (index > -1) {
            setTrainingDomain([...trainingDomain.slice(0, index),...trainingDomain.slice(index + 1)])
        }
    }

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        let updatedDomains
        if(name == "price"){
            updatedDomains = trainingDomain.map((domain, i) => 
                i === index ? { ...domain, [name]: Number(value) } : domain
            );
        }else{
            updatedDomains = trainingDomain.map((domain, i) => 
                i === index ? { ...domain, [name]: value } : domain
            );
        }

        setTrainingDomain(updatedDomains)
        dispatch(setResumeDetails({ name: "trainingDomain", data: updatedDomains }));
    }

    // New filtering logic for the updated domain structure
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
    

    return (
        <div className='mb-6 grid place-content-center items-center'>
            <h2 className='text-slate-700 grid place-content-center items-center text-lg py-4 pt-2 font-semibold'>
                Training Domains
            </h2>
            <div className='mt-3'>
                <div className='flex flex-col'>
                    <Popover open={open} onOpenChange={setOpen} className="w-[70vw] md:w-[70vw] justify-start p-2">
                        <PopoverTrigger asChild className='p-6 rounded-full'>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[70vw] justify-between"
                            >
                                {!value ? (
                                    <span className="flex items-center justify-between">
                                        <ion-icon
                                            name="search-outline"
                                            style={{ fontSize: "18px", marginRight: "12px" }}
                                        ></ion-icon>
                                        Select Domain
                                    </span>
                                ) : (
                                    <span className='flex items-center align-middle'>
                                        <h2 className='text-black font-semibold border-r-2 pr-4'>
                                            Results :
                                        </h2>
                                        <div className='flex items-center justify-between align-middle ml-10 text-slate-700'>
                                            <span>{value}</span>
                                            <ion-icon 
                                                name="close-outline" 
                                                style={{ fontSize: "18px", marginLeft: "12px" }} 
                                                onClick={() => {
                                                    setOpen(false);
                                                    setValue('');
                                                    setFilterResults(domainsData);
                                                }}
                                            ></ion-icon>
                                        </div>
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[70vw] p-0">
                            <Command>
                                <Input  
                                    className="w-max min-w-[55vw] m-2 focus:ring-0 focus:ring-offset-0"    
                                    placeholder="Search Domain by..... "
                                    onChange={(e) => getFilteredResults(e.target.value)}
                                />
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    {filteredResults?.map((domainGroup) => (
                                        <CommandGroup key={domainGroup._id}>
                                            {domainGroup?.domains.map((domain) => (
                                                <CommandGroup key={domain._id} heading={domain.name}>
                                                    {domain.subdomains.map((subdomain) => (
                                                        <CommandItem
                                                            key={subdomain}
                                                            value={subdomain}
                                                            onSelect={() => handleSearchTerm(subdomain)}
                                                        >
                                                            {subdomain}
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

                <div className='mt-8 p-3 gap-9'>
                    {trainingDomain?.length > 0 ? <h4>Domain List</h4> : null}
                    {trainingDomain && trainingDomain.map((item, index) => (
                        <div key={index} className="mb-2 mt-4 flex items-start w-[70vw] p-4 rounded-md justify-between border border-slate-100 shadow-md">
                            <div className='flex flex-col'>
                                <Label className="text-lg font-semibold">{index + 1}. {item.domain}</Label>
                                <span className='mt-2 py-2' onClick={() => handleDelete(index)}>
                                    <ion-icon name="trash-outline" style={{color:"red", cursor:"pointer"}}></ion-icon>
                                </span>
                            </div>
                            <div className='flex items-start justify-between '>
                                <div className='flex flex-col items-start justify-between mr-10'>
                                    <Label className="text-md font-medium text-slate-700">Enter Type</Label>
                                    <select name="type" id="" className='w-max' value={item.type} onChange={(e) => handleChange(e, index)}>
                                        <option value="Select Type">Select Type</option>
                                        <option value="Lateral">Lateral</option>
                                        <option value="Induction">Induction</option>
                                        <option value="Both">Both</option>
                                    </select>
                                </div>
                                {trainerDetails && trainerDetails.trainingDetails.trainerType !== "Internal" ? 
                                    <Fragment>
                                        <div>
                                            <Label className="text-md font-medium text-slate-700">Enter Price (₹)</Label>
                                            <Input 
                                                type="number" 
                                                placeholder="Enter Price(Rupees)"  
                                                name="price" 
                                                className="w-[200px]" 
                                                onChange={(e) => handleChange(e, index)}
                                            />
                                        </div>
                                        <div className='flex flex-col items-start justify-between ml-10'>
                                            <Label className="text-md font-medium text-slate-700">Enter Mode</Label>
                                            <select 
                                                name="paymentSession" 
                                                id="" 
                                                className='w-max' 
                                                value={item.paymentSession}  
                                                onChange={(e) => handleChange(e, index)}
                                            >
                                                <option value="Select Mode">Select Mode</option>
                                                <option value="Online Hourly">Online Hourly</option>
                                                <option value="Online Per-day">Online Per-day</option>
                                                <option value="Offline Hourly">Offline Hourly</option>
                                                <option value="Offline Per-Day">Offline Per Day</option>
                                            </select>
                                        </div>
                                    </Fragment>
                                : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TrainingDomain