import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import React, {Fragment, useState} from 'react'
import {Skeleton} from "@/components/ui/skeleton"

function ViewProjectData({projects}) {
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
        modeOfTraining
    } = projects;

    // Change Stage API CALL
    const [isChanging,
        setIsChanging] = useState(false)
    const changeStage = async(e) => {
        try {
            setTimeout(() => {
                setIsChanging(true)
            }, 100)

            // setIsChanging(false)
        } catch (error) {
            console.error(error)
        }

        setTimeout(() => {
            setIsChanging(false)
        }, 1500)
    }

    return (

        <div className='border rounded-md shadow-sm py-4 px-4'>
            <div className='flex items-center justify-between'>
                <h2 className='font-semibold text-xl uppercase'>{projectName}</h2>
                {/* Stages Change it */}
                <div
                    className='flex  items-center justify-between'
                    onChange={(e) => {
                    changeStage(e)
                }}>
                    <Label>Stage</Label>
                    <select name="pipeline" id="" className='ml-3 font-semibold'>
                        <option value="Training Requirement">Training Requirement
                        </option>
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
                    <Input
                        type="text"
                        className="text-gray-900 font-medium"
                        readOnly
                        value={modeOfTraining}/>
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
                    <h2 className="text-left text-gray-700 mb-[3px]">Timing</h2>
                    <Input
                        type="date"
                        className="text-gray-900 font-medium"
                        readOnly
                        value={new Date(trainingDates.endDate)
                        .toISOString()
                        .split('T')[0]}/>
                </div>
            </div>
        </div>
    )
}

export default ViewProjectData

// <Fragment>     {         !isChanging ?         :         <div className="flex
// flex-col space-y-3">             <Skeleton className="h-[125px] w-[250px]
// rounded-xl" />             <div className="space-y-2">             <Skeleton
// className="h-4 w-[250px]" />             <Skeleton className="h-4 w-[200px]"
// />             </div>         </div>     } </Fragment>