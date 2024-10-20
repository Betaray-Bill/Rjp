import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useDispatch, useSelector } from 'react-redux';
import { resetDomainResultsAndSearch, setDomainResults, setIsSearching, setSearchDomain } from '@/features/searchTrainerSlice';

  
function SearchBar() {
    const [query, setQuery] = useState("")
    const [result, setResult] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [startPrice, setStartPrice] = useState('');
    const [endPrice, setEndPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rating, setRating] = useState('asc');

    const dispatch = useDispatch()
    const {searchDomain} = useSelector(state => state.searchTrainer)

    const handleDomainChange = (event) => {
        dispatch(setSearchDomain(event.target.value))
        setQuery(event.target.value)
    }

    axios.defaults.withCredentials = true;
    const searchHandler = async(event) => {
          event.preventDefault()
          if(query === "" || query.length < 1){
            alert("Please enter a search")
            setResult([])
            setSearched(true)
            return
          }
          setLoading(true);
          setSearched(true);
          dispatch(setIsSearching(true))
          // http://localhost:5000/api/trainer/search?price[lte]=5000&price[gte]=200&domain=PMP
          try {
              let req_query = `http://localhost:5000/api/trainer/search?domain=${query}`;
  
              // Append additional filters to the query string if they exist
              if (startPrice) req_query  += `&price[gte]=${startPrice}`;
              if (endPrice) req_query  += `&price[lte]=${endPrice}`;
              // if (startDate) req_query   += `&startDate=${startDate}`;
              // if (endDate) req_query   += `&endDate=${endDate}`;
              // if (rating) req_query  += `&rating=${rating}`;
              console.log(req_query)
              // Send the GET request with the query parameters
              const res = await axios.get(req_query);
              const data = await res.data;
              console.log(data);
              setResult(data);
              dispatch(setDomainResults(data));
                setQuery("")
            dispatch(setIsSearching(false))

          } catch (error) {
              // dispatch(signInFailure(error));
              console.log(error)
          }
          setLoading(false)
    }
  
  return (
    <div className=''>
        <form onSubmit={ searchHandler} className='bg-orange p-3'>
            
            <div className='flex items-center justify-between w-[70vw] lg:w-[60wv] rounded-full py-2 px-5 border border-slate-400'>
                <div className='flex items-center'>
                    <ion-icon name="search-outline" style={{fontSize:"22px", color:"black"}}></ion-icon>
                    <Input id="outlined-basic"
                        onChange={(e) => handleDomainChange(e)} 
                        placeholder="Search Trainers by domain"
                        value={query}
                        className="min-w-[50vw] ml-4 border-none bg-none"
                    ></Input>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger><ion-icon name="filter-outline" style={{fontSize:"22px", color:"black"}}></ion-icon></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Filters</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

            {/* <Button type="submit">Search</Button> */}
        </form>

    </div>
  )
}

export default SearchBar
