import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {TextField} from '@mui/material';
import axios from 'axios';
import React, {useEffect, useState} from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import {Label} from '@/components/ui/label';
import { useQuery, useQueryClient } from 'react-query';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import { Link } from 'react-router-dom';

function SearchBar({domain, id, trainingDates}) {
    const queryClient = useQueryClient();
    const [query,
        setQuery] = useState(domain ? domain : "")
    const [result,
        setResult] = useState([])
    const [isLoading,
        setLoading] = useState(false)
    const [searched,
        setSearched] = useState(false)
    const [startPrice,
        setStartPrice] = useState('');
    const [endPrice,
        setEndPrice] = useState('');
    const [startDate,
        setStartDate] = useState(trainingDates && trainingDates.startDate.split("T")[0]);
    const [endDate,
        setEndDate] = useState(trainingDates && trainingDates.endDate.split("T")[0]);
    const [rating,
        setRating] = useState(null);
    const [mode, setMode] = useState('');
    const [type, setType] = useState('');
    const [filter, setFilter] = useState(false)

    const handleDomainChange = (event) => {
        // dispatch(setSearchDomain(event.target.value))
        setQuery(event.target.value)
    }
    useEffect(() => {
        // setQuery(domain)
        refetch()
    }, [])

    useEffect(() => {
        if(!filter){
            setStartPrice('')
        }
    }, [filter])


    // Search Query
    const fetchSearchResults = async () => {
        let encodedDomain = encodeURIComponent(domain)
        let req_query = `http://localhost:5000/api/trainer/search?domain=${encodedDomain.trim()}`;
        if (startPrice) req_query += `&price[gte]=${Number(startPrice)}`;
        if (endPrice) req_query += `&price[lte]=${Number(endPrice)}`;
        if (mode) req_query += `&mode=${encodeURIComponent(mode)}`;
        if (type) req_query += `&type=${encodeURIComponent(type)}`;
        if (startDate) req_query += `&startDate=${startDate}`;
        if (endDate) req_query += `&endDate=${endDate}`;
        if(rating) req_query += `&rating=${rating}`;
    
        console.log(req_query);
        
        const response = await axios.get(req_query);
        // console.log(response.data)
        return response.data;
    };

      
    const { data, refetch, isError } = useQuery(
        ['searchResults', query],
        fetchSearchResults,
        {
          enabled: false, // Disable automatic fetching
          staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
            cacheTime: 1000 * 60 * 10,
          onSuccess: (data) => {
            setResult(data);
          },
          onError: (error) => {
            // console.log(error);
          },
          onSettled: () => {
            // console.log("Settled");
          }
        }
    );

    const searchHandler = async(event) => {
        event.preventDefault()
        if (query === "" || query.length < 1) {
            alert("Please enter a search")
            setResult([])
            setSearched(true)
            return
        }
        setLoading(true);
        setSearched(true);
        // dispatch(setIsSearching(true))

        try {
            await refetch(); // Trigger the query fetch with the current parameters
        } catch (error) {
            // console.log(error);
        }
          
        setLoading(false);
    }

    // Add Trainer to the Project
    const [selectedTrainers, setSelectedTrainers] = useState([])


    const addTrainerToProject = async(trainer) => {
        // event.preventDefault()
        // console.log(trainer)
        if (selectedTrainers.length === 0){
            console.log("1")
            setSelectedTrainers([...selectedTrainers,trainer])
        }else{ 
            console.log("2")

            for(let i=0; i<selectedTrainers.length; i++) {
            console.log("2")

                if(selectedTrainers[i]._id === trainer._id){
                    alert("Trainer already selected")
                    return
                }
            }            
            console.log("3")

            setSelectedTrainers((prev) => [...prev, trainer])
            // console.log("2", a)

        }
    }

    const deleteSelectedTrainer = async(trainer) => {
        let a = selectedTrainers.filter(t => t._id !== trainer._id)
        setSelectedTrainers(a)
    }
    console.log(selectedTrainers)

    // Submit the changes
    const saveTrainer = async() => {
        try {
            axios.defaults.withCredentials = true;
            let a = []
            selectedTrainers.forEach((e) =>  a.push(e._id))
            console.log(a)
            const trainerSubmit = await axios.put(`http://localhost:5000/api/project/add-trainers/${id}`, {trainers:a})
            const response = await trainerSubmit.data;
            console.log(response)
            setSelectedTrainers([])
            queryClient.invalidateQueries(['ViewProject', id]);
            // refetch()
        } catch (error) {
            console.log(error);
        }
        setSelectedTrainers([])
    }
    const handleReset = () => {
        // dispatch(resetDomainResultsAndSearch())
        setRating(null)
        setStartPrice('')
        setEndPrice('')
        setMode('')
        setType('')
        // setQuery('')
    }

    const getTrainerType = (trainerId) => {
        if (trainerId.startsWith("RJPI")) 
            return "Internal";
        if (trainerId.startsWith("RJPE")) 
            return "External";
        return "Unknown";
    };


    return (
        <div className=''>
            <form onSubmit={searchHandler} className='bg-orange p-3'>

                    <div
                        className='flex items-center  shadow-sm justify-between w-[70vw] lg:w-[60wv] rounded-full py-2 px-5 border border-slate-400'>
                        
                        <div className='flex items-center justify-between w-[70vw] lg:w-[60wv] '>
                            <div className='flex items-center'>
                                <ion-icon
                                    name="search-outline"
                                    style={{
                                    fontSize: "22px",
                                    color: "black"
                                }}></ion-icon>
                                <Input
                                    id="outlined-basic"
                                    onChange={(e) => handleDomainChange(e)}
                                    placeholder="Search Trainers by domain"
                                    value={query ? query : domain}
                                    readOnly={true}
                                    className="min-w-[50vw] ml-4 border-none bg-none"></Input>
                            </div>
                            <Button onClick={searchHandler} className="rounded-3xl">Search</Button>
                        </div>
                    </div>

                        <div className='mt-4 py-2 px-4 flex items-start justify-between'>
                            <div className="flex items-center justify-between cursor-pointer border-gray-200 border px-3 py-[3px] rounded-full"  onClick={() => setFilter(false)}> 
                                <ion-icon name="filter-outline" style={{fontSize:"20px", color:"black"}}></ion-icon>
                                <p className='ml-3'>Filter</p>
                            </div>
                            <div className=" flex items-center">
                                {/* Type of Training Mode */}
                                 <div className='mx-2'>
                                            <Select onValueChange={(e) => {
                                                // console.log(e)
                                                setMode(e)
                                            }} className="rounded-full border-none">
                                                <SelectTrigger className="w-max rounded-full">
                                                    <SelectValue placeholder="Select Training Mode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {/* <SelectItem value="Select Mode">Select Mode</SelectItem> */}
                                                    <SelectItem value="Online Hourly">Online Hourly</SelectItem>
                                                    <SelectItem value="Online Per-day">Online Per-day</SelectItem>
                                                    <SelectItem value="Offline Hourly">Offline Hourly</SelectItem>
                                                    <SelectItem value="Offline Per-Day">Offline Per Day</SelectItem>
                                                </SelectContent>
                                            </Select>
                                </div>
                                {/* PRice Filter */}
                                <div className='border w-max px-4 py-[3px]  rounded-full'>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <span  className="border-none cursor-pointer">Price (₹)</span>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">Rate Per Session</h4>
                                                {/* <p className="text-sm text-muted-foreground">
                                                Set the dimensions for the layer.
                                                </p> */}
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                        <Label>Start Price</Label>
                                                        <input
                                                            type="number"
                                                            value={startPrice}
                                                            onChange={(e) => setStartPrice(e.target.value)}
                                                            className="w-[100px] py-1 px-2 border mt-2 rounded-sm border-gray-700"/>
                                                </div>
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                        <Label>End Price</Label>
                                                        <input
                                                            type="number"
                                                            value={endPrice}
                                                            onChange={(e) => setEndPrice(e.target.value)}
                                                            className="w-[100px] py-1 px-2 border mt-2 rounded-sm border-gray-700"/>
                                                </div>
                                                
                                            </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                
                                                                 {/* Dates */}
                                <div className='border w-max mx-4 px-4 py-[3px]  rounded-full'>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <span  className="border-none cursor-pointer flex items-center"><ion-icon name="calendar-outline" style={{marginRight:"8px"}}></ion-icon> <span>Dates</span></span>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className="grid gap-4">
                                            <div className="space-y-2">
                                                {/* <h4 className="font-medium leading-none">Rate Per Session</h4> */}
                                                {/* <p className="text-sm text-muted-foreground">
                                                Set the dimensions for the layer.
                                                </p> */}
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                        <Label>Start Date</Label>
                                                        <input
                                                            type="date"
                                                            value={startDate}
                                                            onChange={(e) => setStartDate(e.target.value)}
                                                            className="w-max py-1 px-2 border mt-2 rounded-sm border-gray-700"/>
                                                </div>
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                        <Label>End Date</Label>
                                                        <input
                                                            type="date"
                                                            value={endDate}
                                                            onChange={(e) => setEndDate(e.target.value)}
                                                            className="w-max py-1 px-2 border mt-2 rounded-sm border-gray-700"/>
                                                </div>
                                                
                                            </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>


                                <div className='border w-max mx-2 px-4 py-[3px]  rounded-full'>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <span  className="border-none cursor-pointer flex items-center"><ion-icon name="star-outline" style={{marginRight:"8px"}}></ion-icon> <span>Rating</span></span>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-max">
                                            {/* <div className="grid gap-4"> */}
                                            <div className="flex items-center justify-between">
                                                        <Label>Rating</Label>
                                                        <input
                                                            type="number"
                                                            value={rating}
                                                            min={1}
                                                            max={5}
                                                            onChange={(e) => setRating(e.target.value)}
                                                            className="w-max py-1 ml-4 px-2 border mt-2 rounded-sm border-gray-700"/>
                                                {/* </div> */}

                                                
                                            {/* </div> */}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>



                                {/* Type Of Students */}
                                <div className='mx-4'>
                                            <Select onValueChange={(e) => {
                                                console.log(e)
                                                setType(e)
                                            }} className="rounded-full border-none">
                                                <SelectTrigger className="w-max rounded-full">
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Select Type">Select Type</SelectItem>
                                                    <SelectItem value="Lateral">Lateral</SelectItem>
                                                    <SelectItem value="Induction">Induction</SelectItem>
                                                    <SelectItem value="Both">Both</SelectItem>
                                                    {/* <SelectItem value="Select Mode">Select Mode</SelectItem> */}
                                                    {/* <SelectItem value="Online Hourly">Online Hourly</SelectItem>
                                                    <SelectItem value="Online Per-day">Online Per-day</SelectItem>
                                                    <SelectItem value="Offline Hourly">Offline Hourly</SelectItem>
                                                    <SelectItem value="Offline Per Day">Offline Per Day</SelectItem> */}
                                                </SelectContent>
                                            </Select>
                                </div>

                            </div>
                        </div>
                    {/* ) : null
                } */}

            </form>

            <div className='flex justify-between '>
                <h1 className='font-medium text-gray-600'>Search Results for - {query}</h1>
                <p
                    onClick={() => handleReset()}
                    className='bg-blue-100 border  border-blue-700 hover:bg-blue-300 rounded-full py-[4px] px-3 flex items-center cursor-pointer'>
                        <ion-icon name="close-outline"></ion-icon>
                        <span className='ml-1'>Reset</span>
                </p>
            </div>
            
            
            {/* Print th */}
            <div className='flex items-center mt-8 justify-between'>
            {
                selectedTrainers?.map((e, _i) => (
                    <div className='border rounded-full px-2 ml-4 w-max flex items-center' key={_i}>
                        <span className=''>{e.generalDetails.email}</span>
                        <ion-icon name="close-outline" style={{cursor:"pointer", fontSize:"20px", marginLeft:"7px", color:"red"}} onClick={() =>deleteSelectedTrainer(e)}></ion-icon>
                    </div>
                ))
            }
            {
                selectedTrainers.length > 0 ?
                <div className='text-right'>
                    <Button onClick={saveTrainer}>Save</Button>
                </div> : null
            }
            </div>

            {
                result && result.length > 0 && 
                (
                    <div className='mt-6 place-content-center items-start'>
                    { result &&  result?.map((res, _i) => (
                           <div key={_i} className='border my-5 flex items-start justify-between border-gray-200 rounded-md p-3 h-max w-[75vw] min-w-[70vw]'>
                                {/* General Details */}
                                <div className='flex items-start flex-col justify-between'>
                                            <div className='flex items-center'>
                                                <Avatar>
                                                    <AvatarImage src="https://github.com/shadcn.png"/>
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <p className='ml-2 font-medium text-sm'>{res.generalDetails?.name}
                                                    {/* <span>{res?.Rating?.star}</span><ion-icon name="star-outline" style={{color:"gold"}}></ion-icon></span> */}
                                                    </p>

                                                    <div className='flex items-center'>
                                                    <span className='flex items-center ml-2'>
                                                        <span>{res
                                                                ?.Rating
                                                                    ?.star}</span>
                                                        <ion-icon
                                                            name="star-outline"
                                                            style={{
                                                            color: "gold"
                                                        }}></ion-icon>
                                                    </span>
                                                    <span
                                                        className={`ml-2 px-2 py-1 text-xs rounded ${getTrainerType(res.trainerId) === "Internal"
                                                        ? "bg-green-200 text-green-700"
                                                        : "bg-blue-200 text-blue-700"}`}>
                                                        {getTrainerType(res.trainerId)}
                                                        Trainer
                                                    </span>
                                                </div>


                                            </div>
                                            <div>
                                                <p className='text-gray-600 mt-2'>
                                                    ID:
                                                    <span className='text-black text-sm font-semibold'>{res.trainerId}</span>
                                                </p>
                                            </div>

                                </div>
                                        {/* Domain Based Details */}
                                        <div
                                            className='flex flex-col justify-start'>
                                            <div className='flex items-center justify-between'>
                                                <div className=' items-center'>
                                                    <h2 className='text-gray-600 text-sm'>Training Domain</h2>
                                                    <p>
                                                        <span className='text-black font-medium ml-2 text-sm'> {res.trainingDomain[0].domain}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-between '>
                                                <div>
                                                    <h2 className='text-gray-600'>Session Taken</h2>
                                                    <p>
                                                        <span className='text-black font-medium text-sm'>{res.trainingDomain[0].paymentSession}</span>
                                                    </p>
                                                </div>
                                                <div className='ml-4'>
                                                    <h2 className='text-gray-600'>Price</h2>
                                                    <p>
                                                        <span className='text-black font-medium text-sm'>₹{res.trainingDomain[0].price}</span>
                                                    </p>
                                                </div>
                                        </div>


                                        {/* COntact Details */}
                                        <div className=' border-gray-200'>
                                            <div className='flex flex-col items-start gap-[20px]'>
                                                <p className='flex items-center'>
                                                    <ion-icon style={{fontSize:"20px", color:"gray", marginRight:"5px"}}  name="call-outline"></ion-icon>
                                                    <span className='font-medium text-sm'>{res.generalDetails?.phoneNumber}</span>
                                                </p>
                                                <p className='flex  items-center'>
                                                    <ion-icon style={{fontSize:"20px", color:"gray", marginRight:"5px"}}  name="mail-outline"></ion-icon>
                                                    <span className='font-semibold text-sm'>{res.generalDetails?.email}</span>
                                                </p>
                                            </div>
                                        </div>

                               <div className='flex flex-col items-center justify-between' >
                                    <div className='bg-blue-800 text-white text-sm px-3 py-2 cursor-pointer' onClick={() => addTrainerToProject(res)}> 
                                        Add Trainer
                                    </div>
                                    <Link to={`/home/trainer/view/${res._id}`} target='_blank'  className='text-blue-600 text-sm cursor-pointer mt-2'>View</Link>

                               </div>
                           </div>
                       ))
                   }
               </div> 
                )
            }
        </div>
    )
}

export default SearchBar