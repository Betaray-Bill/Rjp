import React, {useState} from 'react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {useQuery, useQueryClient} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {setAllEmp} from '@/features/employeeSlice';
import axios from 'axios';
import {Button} from '@/components/ui/button'
import {Link} from 'react-router-dom'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination"
import SingleTrainerCell from './Components/SingleTrainerCell';

function GetTrainer() {
    const [trainer,
        setTrainer] = useState([])

    const [page,
        setPage] = useState(1)
    const [limit,
        setLimit] = useState(10)

    const dispatch = useDispatch()
    const {currentUser} = useSelector(state => state.auth)
    const queryClient = useQueryClient()

    const getAll = async(page, limit) => {
        const response = await axios.get(`http://localhost:5000/api/trainersourcer/getTrainer/${currentUser.employee._id}?page=${page}&limit=${limit}`); // Replace with your API endpoint
        console.log(response.data.trainers)
        return response.data
    }

    const {data, refetch} = useQuery({
        queryKey: [
            "getAllTrainers", page
        ],
        queryFn: () => getAll(page, limit),
        staleTime: 1000 * 60 * 5, // data stays    fresh for 5 minutes
        cacheTime: 1000 * 60 * 10
    });

    return (
        <div>
            {/*  */}
            <div className='flex items-center justify-between'>
                <p
                    onClick={() => refetch()}
                    className="flex items-center bg-blue-100 border border-black rounded-md cursor-pointer px-[10px] w-max py-[3px] mb-4">
                    <ion-icon name="sync-outline"></ion-icon>
                    <span>Sync</span>
                </p>
                <Link to="/home/trainer/add">
                    <Button>
                        <ion-icon
                            name="add-outline"
                            style={{
                            fontSize: "20px"
                        }}></ion-icon>
                        <span>Add Trainer</span>
                    </Button>
                </Link>
            </div>
                        
            {/* Table */}
            <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                    <TableRow>
                        <TableHead>S.no</TableHead>
                        <TableHead className="">Name</TableHead>
                        <TableHead className="">Trainer ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead> </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data
                        ?.trainers
                            ?.length > 0 && data
                                ?.trainers
                                    ?.map((trainer, index) => (
                                        <TableRow
                                            key={index}
                                            onClick={() => {
                                            // console.log(`${index + 1}.) ${trainer.email} `)
                                        }}
                                            className="cursor-pointer rounded-md">
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
                        getAll(page - 1, limit);
                        queryClient(["getAllTrainers", page])
                    }} /> 
}
                     
 
                    <PaginationContent>
                        {data && data.trainersTotals && [...Array(Math.ceil(data
                                ?.trainersTotals / limit))].map((_, i) => (
                            <PaginationItem key={i} active={page === i + 1}>
                                <PaginationLink onClick={() => setPage(i + 1)}>
                                    {
                                        (i+1) == page ? 
                                        <span className='bg-blue-300 px-3 py-2'>{i+1}</span> : <span>{i+1}</span>
                                    }
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                    {data && data.trainersTotals > limit * page && <PaginationNext
                        onClick={() => {
                        setPage(page + 1);
                        queryClient(["getAllTrainers", page]);
                        getAll(page + 1, limit);
                    }}
                        disabled={page === Math.ceil(data
                        ?.trainersTotals / limit)}/>
}

                </Pagination>
            </div>

        </div>
    )
}

export default GetTrainer
