import React, {Fragment, useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from '@/components/ui/label';
import axios from 'axios';
import {useToast} from '@/hooks/use-toast';
import {useQueryClient} from 'react-query';

function Remainder({stages, projectId, remainders}) {
    const [date,
        setDate] = useState("");
    const [remarks,
        setRemarks] = useState("");
    const [isCompleted,
        setIsCompleted] = useState(false);
    const [loading,
        setLoading] = useState(false);
    const {toast} = useToast()
    const queryClient = useQueryClient()
    // Assign Remainder as per the Stage
    console.log(remainders)
    useEffect(() => {
        const remainderStageData = remainders.filter((item) => {
            return item.stages == stages;
        })

        console.log(remainderStageData)
        if (remainderStageData.length > 0) {
            setDate(new Date(remainderStageData[0].date).toISOString().split("T")[0]);
            setRemarks(remainderStageData[0].description);
            setIsCompleted(remainderStageData[0].isCompleted);
        } else {
            setDate("");
            setRemarks("");
            setIsCompleted(false);
        }
    }, [stages])

    // Function to handle form submission
    const handleSave = async() => {
        if (!date || !remarks) {
            alert("Please fill out all required fields.");
            return;
        }

        const requestData = {
            projectId: projectId.projectId,
            date,
            stages,
            description: remarks,
            isCompleted
        };

        console.log("Data ", requestData)

        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:5000/api/project/remainder/${projectId.projectId}`, {
                ...requestData
            })
            const result = await response.data
            console.log(result)
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]);
            toast({
                title: "Remainder saved successfully", variant: "success",
                // duration: 5000
            })
            // alert("Remainder saved successfully!"); setDate(""); setRemarks("");
            // setIsCompleted(false); if (onSuccess) onSuccess(result);
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving the remainder.");
        } finally {
            setLoading(false);
        }
    };

    const isDatePassed = () => {
        // Get today's date (formatted to YYYY-MM-DD)
        const todayDate = new Date()
            .toISOString()
            .split("T")[0];

        console.log(date)

        // Compare dates
        if (todayDate > date) {
            // return true
            console.log("Today's date is greater than the date.");
            return true
        } else if (todayDate === date) {
            console.log("Today's date is equal to the setDate.");
            return true
        } else {
            console.log("Today's date is less than the setDate.");
            return false
        }

    }

    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    {/* {
                        isDatePassed() ? "yes" : "mo"
                    } */}
                    {isDatePassed()
                        ? (
                            <Fragment>
                                {isCompleted
                                    ? <Button className="rounded-none bg-green-500 flex items-center">
                                            <span>Remainder - Done</span>
                                            <ion-icon name="chevron-down-outline"></ion-icon>
                                        </Button>
                                    : <Button className="rounded-none bg-red-500 flex items-center">
                                        <span>Remainder</span>
                                        <ion-icon name="chevron-down-outline"></ion-icon>
                                    </Button>
}
                            </Fragment>
                        )
                        : <Fragment>
                            {isCompleted
                                ? <Button className="rounded-none bg-green-500 flex items-center">
                                        <span>Remainder - Done</span>
                                        <ion-icon name="chevron-down-outline"></ion-icon>
                                    </Button>
                                : <Button className="rounded-none bg-red-500 flex items-center">
                                    <span>Remainder</span>
                                    <ion-icon name="chevron-down-outline"></ion-icon>
                                </Button>
}
                        </Fragment>
}
                    {/* <Button className="rounded-none bg-red-500 flex items-center">
                        <span>Remainder</span>
                        <ion-icon name="chevron-down-outline"></ion-icon>
                    </Button> */}
                </DialogTrigger>
                <DialogContent className="mr-10 border border-gray-300 drop-shadow-md">
                    <DialogHeader>
                        <DialogTitle>
                            <h2 className='font-semibold text-md'>Remainder - {stages}</h2>
                        </DialogTitle>
                        <div>
                            <div className='mt-8 w-[450px]'>
                                {/* Date Input */}
                                <div className='flex'>
                                    <Label className="flex items-center">
                                        <ion-icon
                                            name="calendar-outline"
                                            style={{
                                            fontSize: "20px"
                                        }}></ion-icon>
                                        <span className='mx-2 text-md'>End Date</span>
                                    </Label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className='text-md ml-3 border px-4 py-1 rounded-md w-max'/>
                                </div>

                                {/* Remarks Input */}
                                <div className='mt-4 w-max'>
                                    <Label className="flex items-center">
                                        <ion-icon
                                            name="chatbubbles-outline"
                                            style={{
                                            fontSize: "20px"
                                        }}></ion-icon>
                                        <span className='mx-2 text-md'>Remarks</span>
                                    </Label>
                                    <Textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        className='text-md my-3 w-[450px] h-20 border border-gray-600 px-4 py-1 rounded-md'></Textarea>
                                </div>

                                {/* Completed Checkbox */}
                                <div className='flex items-center justify-end'>
                                    {remainders && isCompleted
                                        ? <div className='flex items-center '>
                                                <ion-icon
                                                    name="checkmark-done-outline"
                                                    style={{
                                                    color: "green",
                                                    fontSize: "22px"
                                                }}></ion-icon>
                                                <span className='font-semibold ml-2'>Completed</span>
                                            </div>
                                        : <Fragment>
                                            <div className='flex items-center'>
                                                <Checkbox
                                                    checked={isCompleted}
                                                    onCheckedChange={(checked) => setIsCompleted(checked)}/>
                                            </div>
                                            <Label className="flex items-center">
                                                <span className='mx-2 text-md'>Completed</span>
                                            </Label>
                                        </Fragment>
}
                                </div>

                                {/* Save Button */}
                                <div>
                                    <Button onClick={handleSave} disabled={loading}>
                                        {loading
                                            ? "Saving..."
                                            : "Save"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Remainder;
