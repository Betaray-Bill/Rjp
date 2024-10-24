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
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui//button'
import { domains } from '@/utils/constants'
import { useDispatch } from 'react-redux'
import { setResumeDetails } from '@/features/trainerSlice'

function TrainingDomain() {
    const dispatch = useDispatch();

    // Domain Search States
    const [open,
        setOpen] = useState(false)
    const [value,
        setValue] = useState("")

    const [trainingDomain,
        setTrainingDomain] = useState([])

    const handleSearchTerm = (e) => {
        console.log(e)
        if (e) {

                if (trainingDomain.length == 0) {
                    setTrainingDomain([
                        {
                            domain: e,
                            price: Number(),
                            paymentSession: ""
                        }
                    ])
                } else {
                    setTrainingDomain([
                        ...trainingDomain,
                        {
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
            setTrainingDomain([...trainingDomain.slice(0, index),...trainingDomain.slice(index + 1)])
        }
    }

    const [trainingDetails,
        setTrainingDetails] = useState({
            domain: "",
            price: Number(),
            paymentSession: ""
        })

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        console.log(name, value)
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

    const getFilteredResults = (searchTerm) => {
        setValue(searchTerm)
        console.log(searchTerm)
        if (!searchTerm) return [];
        console.log("searchTerm", searchTerm)
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

        console.log("A ", a)
        setFilterResults(a);
    };

    const [filteredResults, setFilterResults] = useState(domains);
    // console.log(domains)


    return (
        <div className='mb-6 grid place-content-center items-center'>
            <h2
                className='text-slate-700 grid place-content-center items-center text-lg py-4 pt-2 font-semibold'>Training Domains</h2>
            <div className='mt-3'>
                <div className='flex flex-col'>
                    {/* <Label htmlFor="trainingDomain" className="mb-3">Training Domain</Label> */}
                    {/* <Popover
                        open={open}
                        onOpenChange={setOpen}
                        className="w-[70vw] justify-start p-2">
                        <PopoverTrigger asChild className='p-6 rounded-full'>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[70vw] justify-between">
                                {!value
                                    ? ((
                                        <span className="flex items-center justify-between">
                                            <ion-icon
                                                name="search-outline"
                                                style={{
                                                fontSize: "18px",
                                                marginRight: "12px"
                                            }}></ion-icon>
                                            Select Domain
                                        </span>
                                    ))
                                    : (
                                        <span className='flex items-center align-middle'>
                                            <h2 className='text-black font-semibold border-r-2 pr-4'>Results :
                                            </h2>
                                            <div className='flex items-center align-middle ml-10 text-slate-700'>
                                                <span>{value}</span>
                                                <ion-icon
                                                    style={{
                                                    fontSize: "18px",
                                                    marginRight: "12px"
                                                }}></ion-icon>
                                            </div>
                                        </span>
                                    )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[70vw] p-0">
                            <Command>
                                <CommandInput placeholder="Search subtopic..."/>
                                <CommandList>
                                    <CommandEmpty>No subtopic found.</CommandEmpty>
                                    {domains[0]
                                        .subtopics
                                        .map((subtopic) => (
                                            <CommandGroup key={subtopic.subtopic} heading={subtopic.subtopic}>
                                                {subtopic
                                                    .points
                                                    .map((point) => (
                                                        <CommandItem
                                                            key={point}
                                                            value={point}
                                                            onSelect={(currentValue) => {
                                                            handleSearchTerm(currentValue)
                                                            setValue(currentValue)
                                                            setOpen(false);
                                                        }}>
                                                            {point}
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        ))}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover> */}

                    <Popover open={open} onOpenChange={setOpen} className="w-[60vw] md:w-[60vw] justify-start p-2">
                        <PopoverTrigger asChild className='p-6 rounded-full'>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[60vw] justify-between"
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
                                        <div className='flex items-center justify-between  align-middle ml-10 text-slate-700'>
                                            <span>{value}</span>
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
                        <PopoverContent className="w-[60vw] p-0">
                            <Command>
                                <Input  className="w-max min-w-[60vw] p-2 focus:ring-0 focus:ring-offset-0"    
                                    placeholder="Search Domain by..... "
                                    onChange={(e) => getFilteredResults(e.target.value)}
                                    // value={value}
                                />
                                <CommandList>
                                    {/* <CommandEmpty>No results found.</CommandEmpty> */}
                                    {filteredResults?.map((domain) => (
                                        <CommandGroup key={domain.topic} heading={domain.topic}>
                                            {domain.subtopics.map((subtopic) => (
                                                <CommandGroup key={subtopic.subtopic} heading={subtopic.subtopic}>
                                                    {subtopic.points.map((point) => (
                                                        <CommandItem
                                                            key={point}
                                                            value={point}
                                                            onSelect={() => handleSearchTerm(point)}
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


                {/* Training Domain based cards with price - hourly or daily  */}

                <div className='mt-8 p-3 gap-9'>
                    {/* Get all the Listed Domains selected by the user */}
                    {
                        trainingDomain.length > 0 ? <h4>Domain List</h4> : null
                    }
                    {
                        trainingDomain && trainingDomain.map((item, index) => (
                        <div key={index} className="mb-2 mt-4 flex items-start w-[70vw] p-4 rounded-md justify-between border border-slate-100 shadow-md">
                            <div className='flex flex-col'>
                                <Label className="text-lg font-semibold">{index + 1}. {item.domain}</Label>
                                <span className='mt-2 py-2' onClick={() => handleDelete(index)}><ion-icon name="trash-outline" style={{color:"red", cursor:"pointer"}}></ion-icon></span>
                            </div>
                            <div className='flex items-start justify-between ml-10'>
                                <div>
                                    <Label className="text-md font-medium text-slate-700">Enter Price (₹)</Label>
                                    <Input type="number" placeholder="Enter Price(Rupees)" name="price" className="w-[200px]" onChange={(e) =>  handleChange(e, index)}/>
                                </div>
                                <div className='flex flex-col items-start justify-between ml-10'>
                                    <Label className="text-md font-medium text-slate-700">Enter Mode</Label>
                                    <select name="paymentSession" id="" className='w-max'  onChange={(e) =>  handleChange(e, index)}>
                                        <option value="Select Mode">Select Mode</option>
                                        <option value="Hourly">Hourly</option>
                                        <option value="Per Day">Per Day</option>
                                    </select>
                                </div>
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

export default TrainingDomain
