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

function GetTrainer() {
    const [trainer, setTrainer] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState(''); // New search query state

    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.auth);
    const queryClient = useQueryClient();

    const getAll = async (page, limit, searchQuery = '') => {
        const token = localStorage.getItem('empToken');
        console.log("Token is", token);
        const response = await axios.get(`http://bas.rjpinfotek.com:5000/api/trainersourcer/getTrainer/${currentUser.employee._id}?page=${page}&limit=${limit}&search=${searchQuery}`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data.trainers);
        return response.data;
    };

    const { data, refetch } = useQuery({
        queryKey: ["getAllTrainers", page, searchQuery],
        queryFn: () => getAll(page, limit, searchQuery),
        staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
        cacheTime: 1000 * 60 * 10,
    });

    // Handler to trigger the search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset to the first page when search query changes
    };

    // Reset the search to show all trainers
    const handleCancelSearch = () => {
        setSearchQuery('');
        setPage(1);
    };

    return (
        <div>
            {/* Search Input */}
            <div className='flex items-center justify-between'>
                {/* <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by name"
                    className="border border-gray-300 px-3 py-2 rounded-md"
                />
                {searchQuery && (
                    <button
                        onClick={handleCancelSearch}
                        className="ml-2 text-sm text-red-500"
                    >
                        Cancel
                    </button>
                )} */}
                <p onClick={() => refetch()} className="flex items-center bg-blue-100 border border-black rounded-md cursor-pointer px-[10px] w-max py-[3px] mb-4">
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
                    {data?.trainers?.length > 0 && data?.trainers?.map((trainer, index) => (
                        <TableRow key={index}>
                            <SingleTrainerCell trainer={trainer} limit={limit} page={page} index={index} />
                        </TableRow>
                    ))}
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
