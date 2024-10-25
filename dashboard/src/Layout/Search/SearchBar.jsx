import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {TextField} from '@mui/material';
import axios from 'axios';
import React, {useEffect, useState} from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import {useDispatch, useSelector} from 'react-redux';
import {resetDomainResultsAndSearch, setDomainResults, setIsSearching, setSearchDomain} from '@/features/searchTrainerSlice';
import {Label} from '@/components/ui/label';
import { useMutation } from 'react-query';

function SearchBar() {
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
    const [trainingTyp, setTrainingType] = useState('');
        // onValueChange={field.onChange} defaultValue={field.value}
    const dispatch = useDispatch()
    const {searchDomain} = useSelector(state => state.searchTrainer)

    const [filter, setFilter] = useState(false)

    const handleDomainChange = (event) => {
        dispatch(setSearchDomain(event.target.value))
        setQuery(event.target.value)
    }

    useEffect(() => {
        if(!filter){
            setStartPrice('')
        }
    }, [filter])

    // Mutation
    const searchMutation = useMutation((query) => {
        return axios.get(query)
        },
        {
        onSuccess: (data) => {
            setResult(data.data);
            dispatch(setDomainResults(data.data));
            dispatch(setIsSearching(false))
            console.log(data.data)

        },
        onSettled: () => {
          console.log("Settled")
        },
        onError: (error) => {
          console.log(error);
        }
      })
    

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
        // http://localhost:5000/api/trainer/search?price[lte]=5000&price[gte]=200&domai
        // n=PMP
        try {
            let req_query = `http://localhost:5000/api/trainer/search?domain=${query.trim()}`;

            // Append additional filters to the query string if they exist
            if (startPrice) 
                req_query += `&price[gte]=${startPrice}`;
            if (endPrice) 
                req_query += `&price[lte]=${endPrice}`;
            if(trainingTyp){
                req_query += `&type=${trainingTyp}`;
            }
            // if (startDate) req_query   += `&startDate=${startDate}`; if (endDate)
            // req_query   += `&endDate=${endDate}`; if (rating) req_query  +=
            // `&rating=${rating}`;
            console.log(req_query)
            // Send the GET request with the query parameters
            searchMutation.mutate(req_query)


        } catch (error) {
            // dispatch(signInFailure(error));
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <div className=''>
            <form onSubmit={searchHandler} className='bg-orange p-3'>

                    <div
                        className='flex items-center  shadow-sm justify-between w-[70vw] lg:w-[60wv] rounded-lg py-2 px-5 border border-slate-400'>
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
                        
                        <div className="hover:bg-gray-200 cursor-pointer rounded p-2"> 
                            <ion-icon name="filter-outline" style={{fontSize:"22px", color:"black"}} onClick={() => {
                                if(filter){
                                    setFilter(false)
                                }else{
                                    setFilter(true)
                                }
                            }}></ion-icon>
                        </div>

                    </div>
                    <Button type="submit" className="hidden">Search</Button>
                {
                    filter ?
                    (
                        <div className='mt-4 border border-gray-400 py-2 px-4 rounded-lg shadow-md'>
                            <div className="flex items-center cursor-pointer border-black border px-2 bg-blue-200 w-max rounded-md"  onClick={() => setFilter(false)}> 
                                <ion-icon name="close-outline" style={{fontSize:"22px", color:"black"}}></ion-icon>
                                <span>Filter</span>
                            </div>
                            <div className="mt-4 flex items-start">
                                {/* PRice Filter */}
                                <div className='border w-max p-3 rounded-md'>
                                    <h3 className='font-semibold'>Rate (₹)</h3>
                                    <div className='flex mt-3'>
                                        <div className="flex flex-col">
                                            <Label className="text-gray-900 font-light">Start Price</Label>
                                            <input
                                                type="number"
                                                value={startPrice}
                                                onChange={(e) => setStartPrice(e.target.value)}
                                                className="w-[100px] py-1 px-2 border mt-2 rounded-sm border-gray-700"/>
                                        </div>
                                        <div className="flex flex-col ml-3">
                                            <Label className="text-gray-900 font-light">Ending Price</Label>
                                            <input
                                                type="number"
                                                value={endPrice}
                                                onChange={(e) => setEndPrice(e.target.value)}
                                                className="w-[100px] py-1 px-2 border mt-2 rounded-sm border-gray-700"/>
                                        </div>
                                    </div>
                                </div>

                                {/* Type of Training Mode */}
                                <div className='p-3 rounded-md mx-4 border '>
                                    <h3 className='font-semibold'>Type of Training Mode</h3>
                                    <div className='flex mt-3'>
                                        <Select onValueChange={(e) => {
                                            console.log(e)
                                            setTrainingType(e)
                                        }} >
                                            <SelectTrigger className="w-max">
                                                <SelectValue placeholder="Select Training Mode" />
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
                                </div>
                            </div>
                        </div>
                    ) : null
                }

            </form>

        </div>
    )
}

export default SearchBar