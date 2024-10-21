import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {TextField} from '@mui/material';
import axios from 'axios';
import React, {useState} from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
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

    const dispatch = useDispatch()
    const {searchDomain} = useSelector(state => state.searchTrainer)

    const handleDomainChange = (event) => {
        dispatch(setSearchDomain(event.target.value))
        setQuery(event.target.value)
    }

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
            let req_query = `http://localhost:5000/api/trainer/search?domain=${query}`;

            // Append additional filters to the query string if they exist
            if (startPrice) 
                req_query += `&price[gte]=${startPrice}`;
            if (endPrice) 
                req_query += `&price[lte]=${endPrice}`;
            
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
                    className='flex items-center justify-between w-[70vw] lg:w-[60wv] rounded-lg py-2 px-5 border border-slate-400'>
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
                    {/* <DropdownMenu>
                    <DropdownMenuTrigger><ion-icon name="filter-outline" style={{fontSize:"22px", color:"black"}}></ion-icon></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Filters</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>

                        </DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}

                </div>

                <div>
                    <h3 className='font-semibold'>Rate</h3>
                    <div className='flex items-center'>
                        <div>
                            <Label className="text-gray-900 font-light">Start Price</Label>
                            <Input
                                type="number"
                                value={startPrice}
                                onChange={(e) => setStartPrice(e.target.value)}
                                className="w-[100px]"/>
                        </div>
                        <div className='ml-8'>
                            <Label className="text-gray-900 font-light">Ending Price</Label>
                            <Input
                                type="number"
                                value={endPrice}
                                onChange={(e) => setEndPrice(e.target.value)}
                                className="w-[100px]"/>
                        </div>
                    </div>
                </div>

                <Button type="submit">Search</Button>
            </form>

        </div>
    )
}

export default SearchBar
