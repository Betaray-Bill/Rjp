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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  
import {useDispatch, useSelector} from 'react-redux';
import {resetDomainResultsAndSearch, setDomainResults, setIsSearching, setSearchDomain} from '@/features/searchTrainerSlice';
import {Label} from '@/components/ui/label';
import { useMutation, useQuery } from 'react-query';

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
    const [rating,
        setRating] = useState('asc');
    const [mode, setMode] = useState('');
    const [type, setType] = useState('');
        // onValueChange={field.onChange} defaultValue={field.value}
    const dispatch = useDispatch()
    const {searchDomain} = useSelector(state => state.searchTrainer)

    const [filter, setFilter] = useState(false)
    
    const handleReset = () => {
        dispatch(resetDomainResultsAndSearch())
        setRating('asc')
        setStartPrice('')
        setEndPrice('')
        setMode('')
        setType('')
        setQuery('')
    }



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

    // Search Query
    const fetchSearchResults = async () => {
        const q = {};
        
        let req_query = `http://localhost:5000/api/trainer/search?domain=${encodeURIComponent(query)}`;
        
        if (startPrice) req_query += `&price[gte]=${Number(startPrice)}`;
        if (endPrice) req_query += `&price[lte]=${Number(endPrice)}`;
        if (mode) req_query += `&mode=${encodeURIComponent(mode)}`;
        if (type) req_query += `&type=${encodeURIComponent(type)}`;

    
        console.log(req_query);
        
        try {
            const response = await axios.get(req_query);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching search results:", error);
            throw error;
        }
    };

      
    const { data, refetch, isError } = useQuery(
        ['searchResults', query],
        fetchSearchResults,
        {
          enabled: false, // Disable automatic fetching
          onSuccess: (data) => {
            setResult(data);
            dispatch(setDomainResults(data));
            dispatch(setIsSearching(false));
            console.log(data);
          },
          onError: (error) => {
            console.log(error);
          },
          onSettled: () => {
            console.log("Settled");
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
                                            <span  className="border-none cursor-pointer">Rate (₹)</span>
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
                                                </SelectContent>
                                            </Select>
                                </div>

                            </div>
                        </div>
                    {/* ) : null
                } */}

            </form>

            <div className='flex justify-between '>
                <h1 className='font-medium text-black-600'>Search Results for - {searchDomain}</h1>
                <p
                    onClick={() => handleReset()}
                    className='bg-blue-100 border  border-blue-700 hover:bg-blue-300 rounded-full py-[4px] px-3 flex items-center cursor-pointer'>
                        <ion-icon name="close-outline"></ion-icon>
                        <span className='ml-1'>Reset</span>
                </p>
            </div>

        </div>
    )
}

export default SearchBar