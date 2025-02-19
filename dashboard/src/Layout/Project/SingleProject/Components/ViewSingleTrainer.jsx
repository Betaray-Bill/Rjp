import React, {Fragment, useEffect, useState} from 'react'
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
import {Button} from '@/components/ui/button'
import {useMutation, useQueryClient} from 'react-query'
import {useToast} from '@/hooks/use-toast'
import axios from 'axios'
import {Checkbox} from '@/components/ui/checkbox'
import api from '@/utils/api'
import {Input} from '@/components/ui/input'

function ViewSingleTrainer({trainer, index}) {
    const projectId = useParams()
    const queryClient = useQueryClient();
    const {toast} = useToast()
    console.log(trainer)
    const [dates, setDates] = useState(
        {
            startDate: trainer.trainingDates?.startDate ? new Date(trainer.trainingDates.startDate).toISOString().split('T')[0] : new Date(),
            endDate: trainer.trainingDates?.endDate ? new Date(trainer.trainingDates.endDate).toISOString().split('T')[0]  : new Date()
        }
    )
    // const [deleteTrainers, setDeleteTrainers] = useState([])
    console.log(dates)
    const {mutate: deleteTrainer, isLoading} = useMutation(async(trainerId) => {
        const response = await api.put(`/project/delete-trainers/${projectId.projectId}`, {trainers: trainerId});
        return response.data;
    }, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]); // Refetch updated project data
            toast({title: "Trainer deleted successfully"});
            console.log(data);
        },
        onError: (error) => {
            console.error(error);
            toast({title: "Trainer Deletion Error"});
        }
    });

    const handleTrainerDelete = async(id) => {
        console.log(id, projectId.projectId)
        console.log(id)
        deleteTrainer(id)

    }

    // console.log(trainers[0])

    const isChecked = true

    const handleCheckboxChange = async(id) => {
        const response = await api.put(`/project/updateClientCall/${projectId.projectId}`, {trainerId: id});
        console.log(response.data)
        queryClient.invalidateQueries(['ViewProject', projectId.projectId]); // Refetch updated project data
        toast({variant: "success", title: "Client Call status updated successfully"});
    }

    const handleIsFinalized = async(id) => {
        const response = await api.put(`/project/isFinalized/${projectId.projectId}`, {trainerId: id});
        console.log(response.data)
        queryClient.invalidateQueries(['ViewProject', projectId.projectId]); // Refetch updated project data
        toast({variant: "success", title: "Trainer is isFinalized successfully"});
    }

    const [isEdit,
        setIsEdit] = useState(false)

    const handleDateChange = async(date, type, id) => {
        setDates({...dates, [type]:date})
    }


    const saveDates = async() => {
         try {
            // console.log(date, type, id)
            const response = await api.post(`/project/trainer/dates/${projectId.projectId}`, {
                trainerId: trainer.trainer._id,
                date: dates,
                // type: type
                });
            console.log(response.data)
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]); // Refetch updated project data
            toast({variant: "success", title: "Trainer date updated successfully"});
        } catch (err) {
            console.log(err)
            toast({variant: "destructive", title: "Trainer date update failed"});
        }

        setIsEdit(false)
    }

    return (
        <Fragment>
            <TableRow key={index} className="cursor-pointer rounded-md">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium flex items-center">
                    <span className='text-sm'>{trainer.trainer.generalDetails
                            ?.name.length > 15
                                ? trainer.trainer.generalDetails
                                    ?.name + '...'
                                    : trainer.trainer.generalDetails
                                        ?.name}</span>
                </TableCell>
                <TableCell className="text-start items-center">
                    {trainer.isClientCallDone
                        ? <ion-icon
                                name="checkmark-done-outline"
                                style={{
                                color: "green",
                                fontSize: "20px"
                            }}></ion-icon>
                        : <Checkbox onCheckedChange={() => handleCheckboxChange(trainer.trainer._id)}/>
}
                </TableCell>
                <TableCell className="text-start items-center">
                    {trainer
                        ?.isFinalized
                            ? <ion-icon
                                    name="checkmark-done-outline"
                                    style={{
                                    color: "green",
                                    fontSize: "20px"
                                }}></ion-icon>
                            : <Checkbox onCheckedChange={() => handleIsFinalized(trainer.trainer._id)}/>
}
                </TableCell>

                <TableCell>{trainer.trainer.generalDetails.email}</TableCell>
                <TableCell>{< input onChange = {
                        (e) => handleDateChange(e.target.value, 'startDate', trainer.trainer._id)
                    }
                    className = 'w-[110px]' type = "date" disabled={!isEdit} value = {dates.startDate} />}</TableCell>
                <TableCell>{< input onChange = {
                        (e) => handleDateChange(e.target.value, 'endDate', trainer.trainer._id)
                    }
                    className = 'w-[110px]' type = "date" disabled={!isEdit} value = { dates.endDate } />}</TableCell>

                <TableCell>{trainer.trainer.trainingDetails.trainerType}</TableCell>

                <TableCell>

                    {trainer.resume !== undefined && trainer
                        ?.resume._id !== undefined
                            ? (
                                <Link
                                    to={`/home/trainer/resume/${trainer.resume._id}`}
                                    target='_blank'
                                    className="bg-transparent px-3 py-2 text-black border border-black rounded-none hover:bg-blue-100">
                                    Resume
                                </Link>
                            )
                            : <i className='font-light text-gray-700'>No resume</i>
}
                </TableCell>
                <TableCell>
                    <Link to={`/home/trainer/view/${trainer.trainer._id}`} target="_blank">
                        <ion-icon
                            name="eye-outline"
                            style={{
                            fontSize: "20px"
                        }}></ion-icon>
                    </Link>
                </TableCell>
                <TableCell>
                <div className='flex items-center justify-end'>
                    {
                        isEdit ?
                        <Button onClick={() => saveDates()} className="border-none py-2 px-3 border">Save</Button>
                            :
                        <Button onClick={() => setIsEdit(p => !p)} className="border-none py-2 px-3 border">Edit</Button>
                    }
                    
                    {isEdit
                        ? <Button
                            onClick={() => setIsEdit(false)}
                            className="border ml-2 border-red-700 bg-white text-red-700 hover:bg-red-600 hover:text-white">Cancel</Button>
                        : null}
                </div>
                </TableCell>
                {isEdit && <TableCell>
                    <Dialog>
                        <DialogTrigger>
                            <ion-icon
                                name="trash-outline"
                                style={{
                                color: "red",
                                fontSize: "20px"
                            }}></ion-icon>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will delete the trainer and remove his data
                                    from the Training.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        type="submit"
                                        className="bg-red-700"
                                        onClick={() => handleTrainerDelete(trainer.trainer._id)}>Delete</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </TableCell>
}
            </TableRow>

        </Fragment>
    )
}

export default ViewSingleTrainer