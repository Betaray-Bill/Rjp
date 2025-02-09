import {Input} from '@/components/ui/input'
import React, {useEffect, useState} from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui//button'
import {domains} from '@/utils/constant'
import {useQueryClient} from 'react-query'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import api from '@/utils/api'

function TrainingDomains() {
    // const a = domains
    const {toast} = useToast()
    const dispatch = useDispatch();
    const [isEdit,
        setIsEdit] = useState(false)
   // Domain Search States
   const [open,
    setOpen] = useState(false)
    const [value,
    setValue] = useState("")

    const queryClient = useQueryClient()
    const [trainingDomain,
        setTrainingDomain] = useState([])

    const {user} = useSelector(state => state.auth)
    console.log(user && user.trainingDomain)
    // const {trainerDetails} = useSelector(state => state.trainer)
    const [domainsData, setDomainsData] = useState([])


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
        console.log("dataa ", user.trainingDomain)
        setTrainingDomain(user.trainingDomain)
        fetchDomains()
        // dispatch(setResumeDetails({name: "trainingDomain", data: data}));
    }, [user.trainingDomain])

    const handleSearchTerm = (e) => {
        console.log(e)
        if (e) {

            if (trainingDomain
                ?.length == 0) {
                setTrainingDomain([
                    {
                        domain: e,
                        price: Number(),
                        paymentSession: ""
                    }
                ])
            } else {
                setTrainingDomain([
                    ...trainingDomain, {
                        domain: e,
                        price: Number(),
                        paymentSession: ""
                    }
                ])
            }
            console.log("2")
        }

    }
    // console.log(trainingDomain)
    const handleDelete = (index) => {
        if (index > -1) {
            setTrainingDomain([
                ...trainingDomain.slice(0, index),
                ...trainingDomain.slice(index + 1)
            ])
        }
    }

    const [trainingDetails,
        setTrainingDetails] = useState({domain: "", price: null, paymentSession: ""})

    const handleChange = (event, index) => {
        const {name, value} = event.target;
        console.log(name, value)
        let updatedDomains
        if (name == "price") {
            updatedDomains = trainingDomain.map((domain, i) => i === index
                ? {
                    ...domain,
                    [name]: Number(value)
                }
                : domain);
        } else {
            updatedDomains = trainingDomain.map((domain, i) => i === index
                ? {
                    ...domain,
                    [name]: value
                }
                : domain);
        }

        setTrainingDomain(updatedDomains)
        // dispatch(setResumeDetails({ name: "trainingDomain", data: updatedDomains }));
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
    
    const [filteredResults,
        setFilterResults] = useState(domains);
    // console.log(domains)

    const submitHandler = async(e) => {
        // e.preventDefault()
        console.log("object")
        // /trainer/updateResume/671f1f348706010ba634eb92/resum
        // e/671f1f348706010ba634eb8f
        // console.log(`/trainer/updateResume/671f1f348706010ba
        // 6 34eb92/resume/${data._id}`)
        try {
            const res = await api.put(`/trainer/update/${user._id}`, {trainingDomain:trainingDomain}  )
            const response = await res.data;
            queryClient.invalidateQueries(["user", user._id])

            // console.log("object ", trainerDetails) console.log(resume) const res = await
            // axios.put(`/trainersourcer/update-profile/${trainerI
            // d.id}`, {trainingDomain: trainingDomain}) console.log(generalDetails) const
            // data = res.data console.log(data)
            // queryClient.invalidateQueries(["getTrainerById", trainerId.id])
            // setIsEdit(false)
            toast({
                title: "Training Domains Updated",
                description: "Your training domains have been successfully updated",
                variant: "success",
                duration: 3000,
            })
            setIsEdit(false)
        } catch (e) {
            console.error(e)
            // setError('Failed to submit the resume')
        }

    }

    return (
        <div className='grid place-content-center mb-10'>
            <div className='w-[90vw] lg:w-[80vw]  mt-8 p-6 bg-white rounded-md'>
                <div className='flex items-center justify-between'>
                    <h2 className='font-semibold text-md'>Training Domains</h2>
                    <div>
                        {!isEdit
                            ? (
                                <Button
                                    onClick={() => setIsEdit(true)}
                                    className="flex rounded-none items-center bg-blue-900 border border-black">
                                    {/* <ion-icon name="pencil-outline"></ion-icon> */}
                                    Edit / Add Domain
                                </Button>
                            // </Button>
                            )
                            : (
                            // onClick={submitHandler} 
                            <div>
                                <Button className = "rounded-none bg-white border mx-5 hover:bg-red-200 border-red-600 text-red-600" onClick={() => setIsEdit(false)}> Cancel </Button>
                                <Button className = "rounded-none" onClick={submitHandler} > Submit </Button>
                                {/* <Button className = "rounded-none bg-white border mx-5 hover:bg-red-200 border-red-600 text-red-600" onClick={() => setIsEdit(false)}> Cancel </Button> */}
                            </div>
                        )}
                    </div>

                </div>

                <div className='mt-5'>
            {
                isEdit && 
                // <div className='bg-white mt-10 rounded-md p-5'>
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
                                            {domainGroup?.domains?.map((domain) => (
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
                // </div>


             }
                </div>

            </div>


            <div className='bg-white mt-10 rounded-md'>
                {/* {user.trainingDetails?.trainerType} */}
                <div className='mt-4 p-3 gap-9'>
                    {/* Get all the Listed Domains selected by the user */}
                    {trainingDomain
                        ?.length > 0
                            ? <h4 className='font-semibold underline'>Domain List</h4>
                            : null
}
                    {trainingDomain && trainingDomain
                        ?.map((item, index) => (
                            <div
                                key={index}
                                className="mb-2 mt-4 flex items-start w-[80vw] p-4 rounded-md justify-between border border-slate-200 ">
                                <div className='flex flex-col'>
                                    <Label className="text-md font-semibold">{index + 1}. {item.domain}</Label>
                                    {
                                        isEdit && <span className='mt-2 py-2' onClick={() => handleDelete(index)}>
                                        <ion-icon
                                            name="trash-outline"
                                            style={{
                                            color: "red",
                                            cursor: "pointer"
                                        }}></ion-icon>
                                    </span>
                                    }
                                </div>
                                <div className='flex items-start justify-between w-max'>

                                    <div className='flex flex-col items-start justify-between ml-10'>
                                        <Label className="text-md font-medium text-slate-700">Trainer Type</Label>

                                        <Select
                                            
                                            disabled={!isEdit}
                                            onValueChange={(value) => handleChange({
                                            target: {
                                                name: "type",
                                                value
                                            }
                                        }, index)}
                                            value={item.type}>
                                            <SelectTrigger className="border-black border w-max">
                                                <SelectValue placeholder="Select Type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {/* <SelectItem value="Select Mode">Select Mode</SelectItem> */}
                                                <SelectItem value="Lateral">Lateral</SelectItem>
                                                <SelectItem value="Induction">Induction</SelectItem>
                                                <SelectItem value="Both">Both</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {user.trainingDetails
                                        ?.trainerType?.trim() !== "Internal" && <div className='ml-8'>
                                            <Label className="text-md font-medium text-slate-700">Enter Price (₹)</Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter Price(Rupees)"
                                                value={item.price
                                                ? item.price
                                                : ""}
                                                name="price"
                                                readOnly={!isEdit}
                                                className="w-[200px] border border-black"
                                                onChange={(e) => handleChange(e, index)}/>
                                        </div>
}
                                    {user.trainingDetails
                                        ?.trainerType?.trim() !== "Internal" && <div className='flex flex-col items-start justify-between ml-10'>

                                            <Label className="text-md font-medium text-slate-700">Enter Mode</Label>
                                                                                        
                                            <Select 
                                                disabled={!isEdit} 
                                                onValueChange={(value) => handleChange({ target: { name: "paymentSession", value } }, index)}
                                                value={item.paymentSession}
                                            >
                                                <SelectTrigger className="w-max border-black border">
                                                    <SelectValue placeholder="Select Mode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Select Mode">Select Mode</SelectItem>
                                                    <SelectItem value="Online Hourly">Online Hourly</SelectItem>
                                                    <SelectItem value="Online Per-day">Online Per-day</SelectItem>
                                                    <SelectItem value="Offline Hourly">Offline Hourly</SelectItem>
                                                    <SelectItem value="Offline Per Day">Offline Per Day</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
}
                                </div>
                            </div>
                        ))
}
                    {/* ask for its price per session day/hour */}
                </div>

            </div>
        </div>
    )
}

export default TrainingDomains
