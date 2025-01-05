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
import {Button} from '@/components/ui/button'
import {useMutation, useQueryClient} from 'react-query'
import {useToast} from '@/hooks/use-toast'
import axios from 'axios'
import { Checkbox } from '@/components/ui/checkbox'
import api from '@/utils/api'

function ViewTrainers({trainers}) {
    const projectId = useParams()
    const queryClient = useQueryClient();
    const {toast} = useToast()
    // const [deleteTrainers, setDeleteTrainers] = useState([])

    const { mutate: deleteTrainer, isLoading } = useMutation(
        async (trainerId) => {
          const response = await axios.put(
            `http://bas.rjpinfotek.com:5000/api/project/delete-trainers/${projectId.projectId}`,
            { trainers: trainerId }
          );
          return response.data;
        },
        {
          onSuccess: (data) => {
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]); // Refetch updated project data
            toast({
              title: "Trainer deleted successfully",
            });
            console.log(data);
          },
          onError: (error) => {
            console.error(error);
            toast({
              title: "Trainer Deletion Error",
            });
          },
        }
      );
      

    const handleTrainerDelete = async(id) => {
        console.log(id, projectId.projectId)
        console.log(id)
        deleteTrainer(id)
       
    }

    console.log(trainers[0])

    const isChecked = true

    const handleCheckboxChange = async(id) => {
        const response = await api.put(
            `/project/updateClientCall/${projectId.projectId}`,
            { trainerId: id }
        );
        console.log(response.data)
        queryClient.invalidateQueries(['ViewProject', projectId.projectId]); // Refetch updated project data
        toast({
            variant: "success",
            title: "Client Call status updated successfully",
        });
    }

    const handleIsFinalized = async(id) => {
        const response = await axios.put(
            `http://localhost:5000/api/project/isFinalized/${projectId.projectId}`,
            { trainerId: id }
        );
        console.log(response.data)
        queryClient.invalidateQueries(['ViewProject', projectId.projectId]); // Refetch updated project data
        toast({
            variant: "success",
            title: "Trainer is isFinalized successfully",
        });
    }

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
                                <TableHead>Type</TableHead>
                                <TableHead className="text-left">Resume</TableHead>
                                <TableHead>View</TableHead>
                                <TableHead className="text-left"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trainers
                                ?.length > 0 && trainers
                                    ?.map((trainer, index) => (
                                        <TableRow key={index} className="cursor-pointer rounded-md">
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell className="font-medium flex items-center">
                                                <Avatar>
                                                    <AvatarImage src="https://github.com/shadcn.png"/>
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <span className='ml-2'>{trainer.trainer.generalDetails?.name}</span>
                                            </TableCell>
                                            <TableCell className="text-start items-center">
                                                {
                                                    trainer.isClientCallDone ? 
                                                    <ion-icon name="checkmark-done-outline" style={{color:"green", fontSize:"20px"}}></ion-icon>
                                                    :   <Checkbox                           
                                                            onCheckedChange={() => handleCheckboxChange(trainer.trainer._id)}
                                                        />
                                                }
                                            </TableCell>
                                            <TableCell className="text-start items-center">
                                                {
                                                    trainer?.isFinalized ? 
                                                    <ion-icon name="checkmark-done-outline" style={{color:"green", fontSize:"20px"}}></ion-icon>
                                                    :   <Checkbox                           
                                                            onCheckedChange={() => handleIsFinalized(trainer.trainer._id)}
                                                        />
                                                }
                                            </TableCell>
                                            
                                            <TableCell>{trainer.trainer.generalDetails.email}</TableCell>
                                            <TableCell>{trainer.trainer.trainingDetails.trainerType}</TableCell>


                                            <TableCell>
                                               
                                                {
                                                    trainer.resume !== undefined &&
                                                    trainer?.resume._id !== undefined ? (
                                                        <Link to={`/home/trainer/resume/${trainer.resume._id}`} target='_blank'
                                                            className="bg-transparent px-3 py-2 text-black border border-black rounded-none hover:bg-blue-100">
                                                                Resume
                                                        </Link>
                                                    ) : <i className='font-light text-gray-700'>No resume</i>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Link to={`/home/trainer/view/${trainer.trainer._id}`} target="_blank">
                                                    <ion-icon
                                                        name="create-outline"
                                                        style={{
                                                        fontSize: "20px"
                                                    }}></ion-icon>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
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
                                        </TableRow>
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