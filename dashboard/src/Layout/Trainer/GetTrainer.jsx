import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setAllEmp } from '@/features/employeeSlice';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import SingleTrainerCell from './Components/SingleTrainerCell';
import api from '@/utils/api';
import { Input } from '@/components/ui/input';

function GetTrainer() {
    const [trainer, setTrainer] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState(''); // New search query state

    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.auth);
    const queryClient = useQueryClient();
    const [trainers, setTrainers] = useState([]);

    const getAll = async (page, limit, searchQuery = '') => {
        const token = localStorage.getItem('empToken');
        // console.log("Token is", token);
        const response = await api.get(`/trainersourcer/getTrainer/${currentUser.employee._id}?page=${page}&limit=${limit}&search=${searchQuery}`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log(response.data.trainers);
        
        return response.data;
    };

    const { data, refetch } = useQuery({
        queryKey: ["getAllTrainers", page, searchQuery],
        queryFn: () => getAll(page, limit, searchQuery),
        staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
        cacheTime: 1000 * 60 * 10,
    });
    // const [trainers, setTrainers] = useState([]);

    // Handler to trigger the search
    const handleSearch = (e) => {
       e.preventDefault()
        setPage(1); // Reset to the first page when search query changes

        // Filter Data
        console.log("Search Query is",searchQuery);
        if(data?.trainers?.length > 0){
            const filteredData = data.trainers.filter((trainer) => {
                return trainer.generalDetails.name.toLowerCase().includes(searchQuery.toLowerCase());
            });
            console.log("Filtered Data is", filteredData);
            setTrainers(filteredData);
        }

    };

    // Reset the search to show all trainers
    const handleCancelSearch = () => {
        setSearchQuery('');
        setPage(1);
        setTrainers([]);
        queryClient.invalidateQueries("getAllTrainers");
    };

    // console.log

    return (
        <div>
            {/* Search Input */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start'>
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value) }
                        placeholder="Search by name"
                        className="border border-gray-300 px-3 py-2 rounded-md"
                    />
                    {searchQuery && (
                        <div>
                            <button
                                onClick={() => handleSearch()}
                                className="ml-2 text-sm text-black-500 bg-black px-4 text-white py-2 mx-3"
                            >
                                Search
                            </button>
                            <button
                                onClick={handleCancelSearch}
                                className="ml-2 text-sm text-red-500"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
                <div className='flex items-center justify-between'>
                    <p onClick={() => refetch()} className="flex mx-5 items-center bg-blue-100 border border-black rounded-md cursor-pointer px-[10px] w-max py-[3px] ">
                        <ion-icon name="sync-outline"></ion-icon>
                        <span>Sync</span>
                    </p>
                    <Link to="/home/trainer/add">
                        <Button>
                            <ion-icon name="add-outline" style={{ fontSize: "20px" }}></ion-icon>
                            <span>Add Trainer</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>S.no</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Trainer ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead> </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        searchQuery && trainers.length > 0 ? 
                        trainers?.map((trainer, index) => (
                            <TableRow key={index}>
                                <SingleTrainerCell trainer={trainer} limit={limit} page={page} index={index} />
                            </TableRow>
                        ))
                        :
                        data?.trainers?.length > 0 && data?.trainers?.map((trainer, index) => (
                            <TableRow key={index}>
                                <SingleTrainerCell trainer={trainer} limit={limit} page={page} index={index} />
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className='grid place-content-center mt-10'>
                <Pagination>
                    {data && limit < limit * page && <PaginationPrevious
                        onClick={() => {
                            setPage(page - 1);
                            getAll(page - 1, limit, searchQuery);
                            queryClient(["getAllTrainers", page]);
                        }} />
                    }

                    <PaginationContent>
                        {data && data.trainersTotals && [...Array(Math.ceil(data?.trainersTotals / limit))].map((_, i) => (
                            <PaginationItem key={i} active={page === i + 1}>
                                <PaginationLink onClick={() => setPage(i + 1)}>
                                    {(i + 1) === page ? <span className='bg-blue-300 px-3 py-2'>{i + 1}</span> : <span>{i + 1}</span>}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                    {data && data.trainersTotals > limit * page && <PaginationNext
                        onClick={() => {
                            setPage(page + 1);
                            queryClient(["getAllTrainers", page]);
                            getAll(page + 1, limit, searchQuery);
                        }}
                        disabled={page === Math.ceil(data?.trainersTotals / limit)} />
                    }

                </Pagination>
            </div>
        </div>
    );
}

export default GetTrainer;
