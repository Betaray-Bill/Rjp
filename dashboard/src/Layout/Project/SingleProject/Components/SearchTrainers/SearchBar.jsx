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

function SearchBar({domain, id}) {
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
        setStartDate] = useState('');
    const [endDate,
        setEndDate] = useState('');
    const [rating,
        setRating] = useState('asc');
    const [trainingTyp, setTrainingType] = useState('');

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
        let req_query = `http://localhost:5000/api/trainer/search?domain=${domain.trim()}`;
        if (startPrice) req_query += `&price[gte]=${Number(startPrice)}`;
        if (endPrice) req_query += `&price[lte]=${Number(endPrice)}`;
        if (trainingTyp) req_query += `&type=${trainingTyp}`;
        // console.log(req_query);
        
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
            console.log("2", a)

        }
    }

    const deleteSelectedTrainer = async(trainer) => {
        let a = selectedTrainers.filter(t => t._id !== trainer._id)
        setSelectedTrainers(a)
    }
    console.log(selectedTrainers)

    // Submit the changes
    const saveTrainer = async() => {
        // event.preventDefault()
        // console.log(trainer)
        // console.log("Submit Handler")
        try {
            // console.log("1")
            // console.log(trainerDetails)
            // trainerMutation.mutate(trainerDetails)
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
    }
    
    return (
        <div className=''>
            <form onSubmit={searchHandler} className='bg-orange p-3'>

                    <div
                        className='flex items-center  shadow-sm justify-between w-[70vw] lg:w-[60wv] rounded-full py-2 px-5 border border-slate-400'>
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
                                className="min-w-[50vw] ml-4 border-none bg-none"></Input>
                        </div>
                    </div>
                    <Button type="submit" className="hidden">Search</Button>
                {/* {
                    filter ?
                    ( */}
                        <div className='mt-4 py-2 px-4 flex items-start justify-between'>
                            <div className="flex items-center justify-between cursor-pointer border-gray-200 border px-3 py-[3px] rounded-full"  onClick={() => setFilter(false)}> 
                                <ion-icon name="filter-outline" style={{fontSize:"20px", color:"black"}}></ion-icon>
                                <p className='ml-3'>Filter</p>
                            </div>
                            <div className=" flex items-center">
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
                                {/* Type of Training Mode */}
                                <div className='ml-4'>
                                            <Select onValueChange={(e) => {
                                                // console.log(e)
                                                setTrainingType(e)
                                            }} className="rounded-full border-none">
                                                <SelectTrigger className="w-max rounded-full">
                                                    <SelectValue placeholder="Select Training Mode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {/* <SelectItem value="Select Mode">Select Mode</SelectItem> */}
                                                    <SelectItem value="Online Hourly">Online Hourly</SelectItem>
                                                    <SelectItem value="Online Per-day">Online Per-day</SelectItem>
                                                    <SelectItem value="Offline Hourly">Offline Hourly</SelectItem>
                                                    <SelectItem value="Offline Per Day">Offline Per Day</SelectItem>
                                                </SelectContent>
                                            </Select>
                                </div>
                            </div>
                        </div>
                    {/* ) : null
                } */}

            </form>
            {
                selectedTrainers.length > 0 ?
                <div className='text-right'>
                    <Button onClick={saveTrainer}>Save</Button>
                </div> : null
            }
            
            {/* Print th */}
            {
                selectedTrainers?.map((e, _i) => (
                    <div className='border rounded-full px-2 ml-4 w-max inline-block' key={_i}>
                        <span className=''>{e.generalDetails.email}</span>
                        <ion-icon name="close-outline" onClick={() =>deleteSelectedTrainer(e)}></ion-icon>
                    </div>
                ))
            }

            {
                result && result.length > 0 && 
                (
                    <div className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-[25px] place-content-center items-start'>
                    { result &&  result?.map((res, _i) => (
                           <div key={_i} className='border border-gray-200 rounded-md p-3 h-max w-[30vw]'>
                               {/* <h2>{res.generalDetails.name}</h2> */}
                               {/* General Details */}
                               <div className='flex items-center justify-between my-4'>
                                   <div className='flex items-center'>
                                       <Avatar>
                                           <AvatarImage src="https://github.com/shadcn.png"/>
                                           <AvatarFallback>CN</AvatarFallback>
                                       </Avatar>
                                       <p className='ml-2 font-medium'>{res.generalDetails?.name}</p>
                                   </div>
                                   <div>
                                       <p className='text-gray-600'>
                                           ID:
                                           <span className='text-black font-semibold'>{res.trainerId}</span>
                                       </p>
                                   </div>

                               </div>
                               {/* Domain Based Details */}
                               <div
                                   className='my-5 border p-2 rounded-md border-gray-200'>
                                   <div className='flex items-center justify-between'>
                                       <div>
                                           <h2 className='text-gray-600'>Training Domain</h2>
                                           <p>
                                               <span className='text-black font-semibold '>{res.trainingDomain[0].domain}</span>
                                           </p>
                                       </div>
                                       <div>
                                           <h2 className='text-gray-600'>Price</h2>
                                           <p>
                                               <span className='text-black font-semibold'>₹{res.trainingDomain[0].price}</span>
                                           </p>
                                       </div>
                                   </div>
                                   <div className='mt-6'>
                                       <h2 className='text-gray-600'>Session Taken</h2>
                                       <p>
                                           <span className='text-black font-semibold'>{res.trainingDomain[0].paymentSession}</span>
                                       </p>
                                   </div>
                               </div>

                               {/* COntact Details */}
                               <div className='my-5  border p-2 rounded-md border-gray-200'>
                                   <div>
                                       <h2 className='text-gray-600'>Contact Details</h2>
                                   </div>
                                   <div className='grid grid-cols-2 gap-[20px] mt-2'>
                                       <p className='flex flex-col'>
                                           <span className='text-gray-600'>phone Number</span>
                                           <span className='font-semibold'>{res.generalDetails?.phoneNumber}</span>
                                       </p>
                                       <p className='flex flex-col items-start'>
                                           <span className='text-gray-600'>Whatsapp Number</span>
                                           <span className='font-semibold'>{res.generalDetails?.phoneNumber}</span>
                                       </p>
                                       <p className='flex flex-col items-start'>
                                           <span className='text-gray-600'>Email Id</span>
                                           <span className='font-semibold'>{res.generalDetails?.email}</span>
                                       </p>
                                   </div>
                               </div>

                               <div className='flex items-center justify-between' >
                                <span className='text-blue-600 cursor-pointer'>View More...</span>
                                
                                {/* {
                                    !selectedTrainers.includes(res._id) ? 
                                    ( */}
                                        <div className='bg-blue-800 text-white px-3 py-2 cursor-pointer' onClick={() => addTrainerToProject(res)}> 
                                            Add Trainer
                                        </div>
                                {/* //     ) : (
                                //         <div className='flex items-center'>
                                //             <ion-icon name="checkmark-done-outline" style={{fontSize:"20px", color:"#4CAF50"}}></ion-icon>
                                //             <span className='text-green-700 font-semibold'>Added</span>
                                //         </div>
                                //     )
                                // } */}
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