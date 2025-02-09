import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Button} from '@/components/ui/button'
import {TableCell} from '@/components/ui/table'
import React, {Fragment, useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {Rating} from 'react-simple-star-rating'
import {Slider} from "@/components/ui/slider"
import {useSelector} from 'react-redux'
import {Textarea} from '@/components/ui/textarea'
import axios from 'axios'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {Input} from '@/components/ui/input'
import {useQueryClient} from 'react-query'
import api from '@/utils/api'
import { useToast } from '@/hooks/use-toast'

function SingleTrainerCell({trainer, limit, page, index}) {
    const params = useParams()
    const {currentUser} = useSelector((state) => state.auth);
    const queryClient = useQueryClient()
    const {toast} = useToast()
    const [isEdit,
        setIsEdit] = useState(false);
    const [rating,
        setRating] = useState(trainer.Rating.star);
    const [data,
        setData] = useState([]);
    useEffect(() => {
        setData(trainer.Rating.Remarks)
    }, [])
    const [showEdit,
        setShowEdit] = useState(false); // Toggle for editing remarks
    const [editRemark,
        setEditRemark] = useState(null); // Current remark being edited
    console.log(data)
    const [remarks,
        setRemarks] = useState({
        name: currentUser.employee && currentUser.employee.name,
        id: currentUser.employee && currentUser.employee._id,
        description: ""
    });

    const isIdPresent = () => {
        return data.some((e) => e.id === currentUser.employee._id);
    };

    const handleEdit = (remark) => {
        setEditRemark(remark);
        setRemarks(remark); // Pre-fill remarks with the existing values
        setShowEdit(true);
    };

    const submitEditedRemark = async() => {
        // check for duplication
        console.log(data)

        const updatedData = {
            ...remarks,
            rating
        };

        try {
            const res = await api.put(`/trainersourcer/remarks/${trainer._id}`, updatedData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log(res.data);
            // queryClient.invalidateQueries(["getAllTrainers", page])
            toast({
                title:"Remarks Updated",
                variant:"success"
            })

            // Update the frontend data
            setData((prev) => prev.map((e) => e.id === updatedData.id
                ? {
                    ...e,
                    description: updatedData.description
                }
                : e));

            setEditRemark(null);
            setShowEdit(false); // Close the edit modal
            queryClient.invalidateQueries(["getAllTrainers", page])
            // window.location.reload()

            setIsEdit(false)

        } catch (err) {
            console.error(err);
        }
    };

    const ratingSubmitHandler = async() => {
        // check for duplication
        console.log(data)

        const updatedData = {
            remarks:data,
            rating
        };

        try {
            const res = await api.put(`/trainersourcer/rating/${trainer._id}`, {rating}, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            toast({
                title:"Rating Updated",
                variant:"success"
            })

            console.log(res.data);
            queryClient.invalidateQueries(["getAllTrainers", page])

            setEditRemark(null);
            setShowEdit(false); // Close the edit modal
            // queryClient(["getAllTrainers", page])
            setIsEdit(false)
            

            // window.location.reload()
        } catch (err) {
            console.error(err);
        }
    };
    console.log(data)

    return (
        <Fragment>
            <TableCell className="font-medium">{(limit * (page - 1)) + 1 + index}</TableCell>
            <TableCell className="font-medium flex items-center">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png"/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className='ml-2'>{trainer.generalDetails.name}</span>
            </TableCell>
            <TableCell>{trainer.trainerId}</TableCell>
            <TableCell>{trainer.generalDetails.email}</TableCell>
            <TableCell>{trainer.trainingDetails.trainerType}</TableCell>
            <TableCell>
                <Dialog>
                    <DialogTrigger>{trainer.Rating.star
                            ? <div className='flex items-center px-2 py-1 bg-gray-100'>
                                    <span className='mx-1 font-semibold'>{trainer.Rating.star}</span>
                                    <ion-icon name="star-outline"></ion-icon>
                                </div>
                            : <div>Not Rated</div>}</DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="mt-5">
                            <DialogTitle className="flex items-center justify-between">
                                <h2>Trainer Rating Section</h2>
                                {/* <Button onClick={ratingSubmitHandler}>Edit</Button> */}
                            </DialogTitle>
                            <DialogDescription></DialogDescription>
                            <div
                                className="mt-10"
                                style={{
                                marginTop: "30px"
                            }}>
                                <div className='flex items-center'>

                                    <DialogTitle>Rating</DialogTitle>
                                    <div className='flex justify-between ml-3'>
                                        <Input
                                            type="number"
                                            placeholder="Enter ratings"
                                            value={rating}
                                            min={0}
                                            max={5}
                                            className="w-max mr-7"
                                            onChange={(e) => setRating(e.target.value)}/>
                                            <Button onClick={ratingSubmitHandler}>Save Rating</Button>

                                    </div>
                                </div>
                                {/* Remarks */}
                                <DialogTitle className="flex items-center justify-between mt-8">
                                    <span>Remarks</span>
                                    {!isIdPresent() && (
                                        <div className="cursor-pointer" onClick={() => setShowEdit(true)}>
                                            <ion-icon
                                                name="add-outline"
                                                style={{
                                                fontSize: "24px"
                                            }}></ion-icon>
                                        </div>
                                    )}
                                </DialogTitle>
                                <div className="mt-4">
                                    {data
                                        ?.map((e, _i) => (
                                            <div className="my-2 border border-gray-300 p-2 rounded-md" key={_i}>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold">{e.name}</span>
                                                    {e.id === currentUser
                                                        ?.employee._id && (
                                                            <div className="cursor-pointer" onClick={() => handleEdit(e)}>
                                                                <ion-icon name="pencil-outline"></ion-icon>
                                                            </div>
                                                        )}
                                                </div>
                                                <p>{e.description}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            { 
                                <div className="mt-5">
                                    <DialogTitle>Edit Feedback</DialogTitle>
                                    <div className="mt-4">
                                        <Textarea
                                            value={remarks.description}
                                            className="border border-gray-500"
                                            onChange={(e) => setRemarks((p) => ({
                                            ...p,
                                            description: e.target.value
                                        }))}/>
                                    </div>

                                </div>
                            }
                            <div className="my-4">
                                <Button onClick={submitEditedRemark}>Save</Button>
                            </div>

                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </TableCell>
            <TableCell>
                <Link to={`/home/trainer/view/${trainer._id}`} target='_blank'>
                    <Button
                        className="bg-transparent border text-black rounded-none hover:bg-blue-200">View</Button>
                </Link>
            </TableCell>
        </Fragment>
    )
}

export default SingleTrainerCell
