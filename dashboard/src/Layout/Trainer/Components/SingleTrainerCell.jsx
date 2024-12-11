import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Button} from '@/components/ui/button'
import {TableCell} from '@/components/ui/table'
import React, {Fragment, useState} from 'react'
import {Link} from 'react-router-dom'
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

function SingleTrainerCell({trainer, limit, page, index}) {

    const {currentUser} = useSelector((state) => state.auth);

    const [rating,
        setRating] = useState(trainer.Rating.star);
    const [data,
        setData] = useState(trainer.Rating.Remarks);
    const [showEdit,
        setShowEdit] = useState(false); // Toggle for editing remarks
    const [editRemark,
        setEditRemark] = useState(null); // Current remark being edited

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
        const updatedData = {
            ...remarks,
            rating
        };

        try {
            const res = await axios.put(`http://localhost:5000/api/trainersourcer/remarks/${trainer._id}`, updatedData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log(res.data);

            // Update the frontend data
            setData((prev) => prev.map((e) => e.id === updatedData.id
                ? {
                    ...e,
                    description: updatedData.description
                }
                : e));

            setEditRemark(null);
            setShowEdit(false); // Close the edit modal
        } catch (err) {
            console.error(err);
        }
    };

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
                            ? trainer.Rating.star
                            : "open"}</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Trainer Rating Section</DialogTitle>
                            <DialogDescription></DialogDescription>
                            <div
                                className="mt-10"
                                style={{
                                marginTop: "30px"
                            }}>
                                <div className='flex items-center'>

                                    <DialogTitle>Rating</DialogTitle>
                                    <div className='flex w-[200px] ml-3'>
                                        <Input
                                            type="text"
                                            placeholder="Enter ratings"
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}/>
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

                            {showEdit && (
                                <div className="mt-5">
                                    <DialogTitle>Edit Feedback</DialogTitle>
                                    <div className="mt-4">
                                        <Textarea
                                            value={remarks.description}
                                            onChange={(e) => setRemarks((p) => ({
                                            ...p,
                                            description: e.target.value
                                        }))}/>
                                        <div className="my-4">
                                            <Button onClick={submitEditedRemark}>Save</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
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
