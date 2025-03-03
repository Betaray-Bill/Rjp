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
  
import {useDispatch, useSelector} from 'react-redux';
import {resetDomainResultsAndSearch, setDomainResults, setIsSearching, setSearchDomain} from '@/features/searchTrainerSlice';
import {Label} from '@/components/ui/label';
import {    useQuery } from 'react-query';
import api from '@/utils/api';
import DatePicker from 'react-datepicker';

function SearchBar({domainSearch}) {
    const [query,
        setQuery] = useState("")
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
        setStartDate] = useState('');
    const [endDate,
        setEndDate] = useState('');
        const [startTime,
            setStartTime] = useState('');
            const [endTime,
        setEndTime] = useState('');
    const [rating,
        setRating] = useState(null);
    const [mode, setMode] = useState('');
    const [type, setType] = useState('');
    const [isNot, setIsNot] = useState(false);
        // onValueChange={field.onChange} defaultValue={field.value}
    const dispatch = useDispatch()
    const {searchDomain} = useSelector(state => state.searchTrainer)

    const [filter, setFilter] = useState(false)
    
    const handleReset = () => {
        dispatch(resetDomainResultsAndSearch())
        setRating(null)
        setStartPrice('')
        setEndPrice('')
        setStartDate('')
        setEndDate('')
        setMode('')
        setType('')
        setQuery('')
    }

    const {currentUser} = useSelector(state => state.auth)


    useEffect(() => {
        if(query === ""){
            setStartPrice('')
            setEndPrice('')
            setMode('')
        }
    }, [query])

    const handleDomainChange = (event) => {
        dispatch(setSearchDomain(event.target.value))
        setQuery(event.target.value)
        // setIsNot(false)
    }

    useEffect(() => {
        if(!filter){
            setStartPrice('')
        }
    }, [filter])

    useEffect(() => {
        if(domainSearch){
            setSearchDomain(domainSearch)
        }
    }, [domainSearch])
    console.log(currentUser)
    // Search Query
    const fetchSearchResults = async () => {
        const q = {};
        
        let req_query = `/trainer/search/${currentUser?.employee._id}?domain=${encodeURIComponent(query.trim())}`;
        
        if (startPrice) req_query += `&price[gte]=${Number(startPrice)}`;
        if (endPrice) req_query += `&price[lte]=${Number(endPrice)}`;
        if (mode) req_query += `&mode=${encodeURIComponent(mode)}`;
        if (type) req_query += `&type=${encodeURIComponent(type)}`;
        if (startDate) req_query += `&startDate=${startDate}`;
        if (endDate) req_query += `&endDate=${endDate}`;
        if(rating) req_query += `&rating=${rating}`;
            if (startTime) req_query += `&startTime=${startTime}`;
            if (endTime) req_query += `&endTime=${endTime}`;
    
        console.log(req_query);
        
        try {
            const response = await api.get(req_query);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching search results:", error);
            throw error;
        }
    };

    console.log("Dates ", startDate, endDate);

      
    const { data, refetch, isError, is } = useQuery(
        ['searchResults', query],
        fetchSearchResults,
        {
          enabled: false, // Disable automatic fetching
          onSuccess: (data) => {
            setResult(data);
            dispatch(setDomainResults(data));
            dispatch(setIsSearching(false));
            console.log(data);

            if(data?.length < 0 || data === undefined ){
                setIsNot(true)
            }else{
                setIsNot(false)
            }
          },
          onError: (error) => {
            console.log(error);
          },
          onSettled: () => {
            console.log("Settled");
            setIsNot(false)

          }
        }
    );
    axios.defaults.withCredentials = true;
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
        dispatch(setIsSearching(true))

        try {
            await refetch(); // Trigger the query fetch with the current parameters
        } catch (error) {
            console.log(error);
        }
          
        setLoading(false);

    }

    console.log(startTime)

    return (
        <div className=''>
            <form onSubmit={searchHandler} className='bg-orange p-3'>

                    <div
                        className='flex items-center  shadow-sm justify-between w-[70vw] lg:w-[60wv] rounded-lg py-2 px-5 border border-slate-400'>
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
                                    value={query}
                                    className="min-w-[50vw] ml-4 border-none bg-none"></Input>
                            </div>
                            <Button onClick={searchHandler}>Search</Button>
                        </div>
                        
    

                    </div>
                    <Button type="submit" className="hidden">Search</Button>
                {/* {
                    filter ?
                    ( */}
                        <div className='mt-4 py-2 px-4 flex items-start justify-between'>
                            <div className="flex items-center justify-between cursor-pointer px-3 py-[3px] rounded-full"  onClick={() => setFilter(false)}> 
                                <ion-icon name="filter-outline" style={{fontSize:"20px", color:"black"}}></ion-icon>
                                <p className='ml-3'>Filter</p>
                            </div>
                            <div className=" flex items-center">
                                {/* Type of Training Mode */}
                                <div className='mx-4'>
                                            <Select onValueChange={(e) => {
                                                console.log(e)
                                                setMode(e)
                                            }} className="rounded-full border-none" value={mode}>
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
                                                <h4 className="font-medium leading-none">Price Per Session</h4>
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
                                                <div>
                                <Label>Start Time:</Label>
                                {/* <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /> */}
                                <DatePicker
                                    // selected={formValues.startTime}
                                    name="startTime"
                                    selected={startTime}
                                    onChange={(date) => setStartTime(date)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border border-gray-400 mt-1 rounded-md ml-2 w-max "
                                    dateFormat="h:mm aa"
                                    required/>
                            </div>
                            <div>
                                <Label>End Time:</Label>
                                {/* <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /> */}

                                <DatePicker
                                    // selected={formselecteds.endTime}
                                    name="trainingDates.endTime"
                                    onChange={(date) => setEndTime(date)}

                                    selected={endTime}
                                    // onChange={(date) => handleDateChange(date, "trainingDates.endTime")}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border border-gray-400 mt-1 rounded-md ml-2 w-max "
                                    dateFormat="h:mm aa"
                                required/>
                            </div>
                                                
                                            </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                 {/* Rating */}
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
                                            }} className="rounded-full border-none" value={type}>
                                                <SelectTrigger className="w-max rounded-full">
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Select Type">Select Type</SelectItem>
                                                    <SelectItem value="Lateral">Lateral</SelectItem>
                                                    <SelectItem value="Induction">Induction</SelectItem>
                                                    <SelectItem value="Both">Both</SelectItem>
                                                </SelectContent>
                                            </Select>
                                </div>

                            </div>
                        </div>
                    {/* ) : null
                } */}

            </form>

            <div className='flex justify-between '>
                <h1 className='font-medium text-black-600'>Search Results for - {searchDomain} {mode}</h1>
                <p
                    onClick={() => handleReset()}
                    className='bg-blue-100 border  border-blue-700 hover:bg-blue-300 rounded-full py-[4px] px-3 flex items-center cursor-pointer'>
                        <ion-icon name="close-outline"></ion-icon>
                        <span className='ml-1'>Reset</span>
                </p>
            </div>
                        
            {
                isNot ?
                <div className='w-full grid text-center place-content-center mt-10'>
                    <img 
                        className='w-[20vw]'
                        src="https://cdni.iconscout.com/illustration/premium/thumb/no-results-found-illustration-download-in-svg-png-gif-file-formats--document-not-data-delete-folder-result-empty-state-pack-website-development-illustrations-4503302.png?f=webp" alt="" />
                    <p className='font-semibold'>No Result Found</p>
                </div> : null
            }

        </div>
    )
}

export default SearchBar