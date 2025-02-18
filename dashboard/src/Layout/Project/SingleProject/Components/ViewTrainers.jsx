import React, {useEffect, useState} from 'react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogClose,
    DialogTrigger
} from "@/components/ui/dialog"
import {Link, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import {useToast} from '@/hooks/use-toast'
import ViewSingleTrainer from './ViewSingleTrainer'

function ViewTrainers({trainers}) {

    return (
        <div>

            {trainers.length > 0
                ? (
                    <Table>
                        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                        <TableHeader>
                            <TableRow>
                                <TableHead>S.no</TableHead>
                                <TableHead className="">Name</TableHead>
                                <TableHead>Client Call</TableHead>
                                <TableHead>Finalized</TableHead>
                                {/* <TableHead className="">Name</TableHead> */}
                                <TableHead>Email</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-left">Resume</TableHead>
                                <TableHead>View</TableHead>
                                <TableHead className="text-left"></TableHead>
                                <TableHead className="text-left"></TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trainers
                                ?.length > 0 && trainers
                                    ?.map((trainer, index) => (
                                        <ViewSingleTrainer trainer={trainer} index={index}/>
                                    ))}
                        </TableBody>
                    </Table>
                )
                : <div className=' text-center text-gray-600 my-8'>No Trainers are Added</div>
}
        </div>
    )
}

export default ViewTrainers