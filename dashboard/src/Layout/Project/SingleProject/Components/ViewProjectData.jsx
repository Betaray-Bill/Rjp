import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import React, {Fragment, useState} from 'react'
import {Skeleton} from "@/components/ui/skeleton"
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {useQueryClient} from 'react-query';
import {useSelector} from 'react-redux';
import {useToast} from '@/hooks/use-toast';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

function ViewProjectData({projects}) {
    const projectId = useParams()
    const queryClient = useQueryClient();
    const {toast} = useToast()

    const {
        _id,
        company,
        contactDetails,
        amount,
        employees,
        projectOwner,
        trainers,
        trainingDates,
        projectName,
        domain,
        description,
        modeOfTraining,
        stages
    } = projects;
    const {currentUser} = useSelector(state => state.auth)
    console.log()
    // Change Stage API CALL
    const [isChanging,
        setIsChanging] = useState(false)
    const changeStage = async(e) => {
        try {
            console.log(e.target.value)
            const res = await axios.put(`http://localhost:5000/api/project/updateStage/${projectId.projectId}`, {stageName: e.target.value})
            const data = await res.data
            console.log(data)
            setIsChanging(false)
            queryClient.invalidateQueries(['projects', currentUser.employee._id]);
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]);

            toast({
                title: `${projectName} Pipeline Stage Updated`,
                // description: `${projectName} S`,
            })

        } catch (error) {
            console.error(error)
            toast({
                title: `${projectName} Pipeline Stage Not Updated`,
                // description: `${projectName} S`,
            })
        }

        // window.location.reload()
    }

    // update Training MOde
    const handleUpdateTraining = async(e) => {
        try {
            console.log(e.target.value)
            const res = await axios.put(`http://localhost:5000/api/project/updateTrainingMode/${projectId.projectId}`, {trainingMode: e.target.value})
            const data = await res.data
            console.log(data)
            queryClient.invalidateQueries(['projects', currentUser.employee._id]);
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]);

            toast({
                title: `${projectName}  Updated`,
                // description: `${projectName} S`,
            })
        } catch (error) {
            console.error(error)
        }
    }

    return (

        <div className='border rounded-md shadow-sm py-4 px-4 border-gray-300'>
            <div className='flex items-center justify-between'>
                <h2 className='font-semibold text-xl uppercase'>{projectName}</h2>
                {/* Stages Change it */}
                <div
                    className='flex  items-center justify-between'
                    onChange={(e) => {
                    changeStage(e)
                }}>
                    <Label>Stage</Label>
                    <select
                        name="pipeline"
                        id=""
                        className='ml-3 font-semibold'
                        value={stages || ''}>
                        <option value="Training Requirement">Training Requirement</option>
                        <option value="Reply">Reply</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="PO received / Invoice Raised">PO received / Invoice Raised</option>
                        <option value="Training Delivery">Training Delivery</option>
                        <option value="Invoice Sent">Invoice Sent</option>
                        <option value="Payment">Payment</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8 place-content-center">
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Project Owner</h2>
                    <Input
                        type="text"
                        className="text-gray-900 font-medium"
                        readOnly
                        value={projectOwner.name}/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Domain</h2>
                    <Input
                        type="text"
                        className="text-gray-900 font-medium"
                        readOnly
                        value={domain}/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Company</h2>
                    <Input
                        type="text"
                        className="text-gray-900 font-medium"
                        readOnly
                        value={company.name}/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Mode of Training</h2>
                    <Select name="modeOfTraining" //     onValueChange={(value) => setProjectData(prevData => ({} //     ...prevData,
                        //     modeOfTraining: value
                        // }))}
                    >
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder={modeOfTraining || "Select Mode"}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Virtual">Virtual</SelectItem>
                            <SelectItem value="In-Person">In-Person</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Amount</h2>
                    <Input type="number" className="text-gray-900 font-medium" value={amount}/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Training Start Dates</h2>
                    <Input
                        type="date"
                        className="text-gray-900 font-medium"
                        readOnly
                        value={new Date(trainingDates.startDate)
                        .toISOString()
                        .split('T')[0]}/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Training End Dates</h2>
                    <Input
                        type="date"
                        className="text-gray-900 font-medium"
                        readOnly
                        value={new Date(trainingDates.endDate)
                        .toISOString()
                        .split('T')[0]}/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Start Timing</h2>
                    <Input
                                    type="text"
                                    className="text-gray-900 font-medium"
                                    readOnly
                                    value={new Date(trainingDates.endTime).toLocaleTimeString()}/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">End Timing</h2>
                    <Input
                                    type="text"
                                    className="text-gray-900 font-medium"
                                    readOnly
                                    value={new Date(trainingDates.endTime).toLocaleTimeString()}/>
                </div>
                {/* <div> */}

                {/* </div> */}
            </div>

            {trainingDates
                    ?.specialTimings.length > 0 &&
                    (trainingDates.specialTimings.map((time, _i) => (
                        <Fragment key={_i} className="my-2 mt-4">
                            <h2 className='mt-8 font-semibold'>Special Training Dates</h2>
                            <div className='grid grid-cols-3 gap-5 mt-4'>
                                <div className='flex flex-col justify-between'>
                                    <h2 className="text-left text-gray-700 mb-[3px]">Special Date</h2>
                                    <Input
                                        type="date"
                                        className="text-gray-900 font-medium"
                                        readOnly
                                        value={new Date(time.date)
                                        .toISOString()
                                        .split('T')[0]}/>
                                </div>
                                <div className='flex flex-col justify-between'>
                                    <h2 className="text-left text-gray-700 mb-[3px]">Start Timing</h2>
                                    <Input
                                        type="text"
                                        className="text-gray-900 font-medium"
                                        readOnly
                                        value={new Date(time.startTime).toLocaleTimeString()}/>
                                </div>
                                <div className='flex flex-col justify-between'>
                                    <h2 className="text-left text-gray-700 mb-[3px]">End Timing</h2>
                                    <Input
                                        type="text"
                                        className="text-gray-900 font-medium"
                                        readOnly
                                        value={new Date(time.endTime).toLocaleTimeString()}/>
                                </div>
                            </div>
                        </Fragment>
                    )))
}
        </div>
    )
}

export default ViewProjectData
