import React from 'react'
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
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