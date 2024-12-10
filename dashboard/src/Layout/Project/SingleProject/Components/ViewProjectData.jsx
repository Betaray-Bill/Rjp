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
import { Button } from '@/components/ui/button';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function ViewProjectData({projects}) {
    const projectId = useParams()
    const queryClient = useQueryClient();
    const {toast} = useToast()

    const {
        _id,
        company,
        // contactDetails,
        amount,
        // employees,
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
    // console.log()
    // Change Stage API CALL
    const [isChanging,
        setIsChanging] = useState(false)
    const changeStage = async(e) => {
        try {
            // console.log(e.target.value)
            const res = await axios.put(`http://localhost:5000/api/project/updateStage/${projectId.projectId}`, {stageName: e.target.value})
            const data = await res.data
            // console.log(data)
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

    const [isEdit, setIsEdit] = useState(false)

    const [projectData, setProjectData] = useState({...projects})

    // update Training MOde
    const handleUpdateTraining = async(e) => {
        try {
            // console.log(projectData)
            const res = await axios.put(`http://localhost:5000/api/project/updateTraining/${projectId.projectId}`, projectData)
            const data = await res.data
            // console.log(data)
            // queryClient.invalidateQueries(['projects', currentUser.employee._id]);
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]);

            toast({
                title: `${projectName}  Updated`,
                // description: `${projectName} S`,
                variant:"success"
            })
        } catch (error) {
            console.error(error)
        }

        setIsEdit(false)
    }

    const handleDateChange = (value, name) => {
        console.log(value, name)
        const keys = name.split('.');
    
        setProjectData((prevData) => {
            const updatedField = { ...prevData[keys[0]], [keys[1]]: value };
            return { ...prevData, [keys[0]]: updatedField };
        });
    };

    const [specialTimingInput,
        setSpecialTimingInput] = useState({date: null, startTime: null, endTime: null});

    
    const handleSpecialTimingInputChange = (value, field, index) => {
        // setSpecialTimingInput((prevInput) => ({
        //     ...prevInput,
        //     [field]: value,
        // }));

        console.log(field, value, index)

        // let a = specialTimingInput?.forEach(element => {
            
        // });
        let a = []
        for(let i=0; i<projectData.trainingDates.specialTimings.length; i++){
            if(i === index){
                let obj = {
                    ...projectData.trainingDates.specialTimings[i],
                    [field]: value
                }
                a.push(obj)
            }else{
                a.push(projectData.trainingDates.specialTimings[i])
            }
        }

        console.log(a)

        setProjectData((prevData) => ({
           ...prevData,
            trainingDates: {
               ...prevData.trainingDates,
                specialTimings: a,
            },
        }));

     
    };
    
    const addSpecialTiming = () => {
        setProjectData((prevData) => ({
            ...prevData,
            trainingDates: {
                ...prevData.trainingDates,
                specialTimings: [
                    ...prevData.trainingDates.specialTimings,
                    specialTimingInput,
                ],
            },
        }));
        setSpecialTimingInput({ date: null, startTime: null, endTime: null }); // Reset special timing input
    };

    const deleteSpecialDate = (index) => {
        let a = []
        for(let i=0; i<projectData.trainingDates.specialTimings.length; i++){
            if(i === index){
                continue;
            }else{
                a.push(projectData.trainingDates.specialTimings[i])
            }
        }

        console.log(a)
        setProjectData((prevData) => ({
            ...prevData,
             trainingDates: {
                ...prevData.trainingDates,
                 specialTimings: a,
             },
         }));
 
    }

    console.log(projectData)

    return (

        <div className='border rounded-md shadow-sm py-4 px-4 border-gray-300'>
            <div className='flex items-center justify-between'>
                <h2 className='font-semibold text-xl uppercase'>{projectData.projectName}</h2>
                {/* Stages Change it */}
                <div className='flex items-center justify-between'>
                    <div
                        className='flex  items-center justify-between'
                        onChange={(e) => {
                        changeStage(e)
                    }}>
                        <Label>Stage</Label>
                        <select
                            name="pipeline"
                            id=""
                            // disabled={!is}
                            className='ml-3 font-semibold'
                            value={projectData.stages || ''}>
                                <option value="Training Requirement">Training Requirement</option>
                                <option value="Reply">Reply</option>
                                <option value="Proposal Sent">Proposal Sent</option>
                                <option value="PO received / Invoice Raised">PO received / Invoice Raised</option>
                                <option value="Training Delivery">Training Delivery</option>
                                <option value="Invoice Sent">Invoice Sent</option>
                                <option value="Payment">Payment</option>
                        </select>
                    </div>
                    <div className='ml-3'>
                       {
                        isEdit ?  <div>
                            <Button onClick={() => handleUpdateTraining()} className="rounded-none">Submit</Button>
                            <Button onClick={() => setIsEdit(false)} className="rounded-none bg-white border border-red-600 mx-4 text-red-600 hover:bg-red-600 hover:text-white">Cancel</Button>
                        </div> :  <Button onClick={() => setIsEdit(true)} className="rounded-none">Edit</Button>
                       }
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8 place-content-center">
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Project Owner</h2>
                    <Input
                        type="text"
                        className="text-gray-900 font-medium"
                        readOnly={!isEdit}
                        value={projectData.projectOwner.name}/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Domain</h2>
                    <Input
                        type="text"
                        className="text-gray-900 font-medium"
                        readOnly={!isEdit}
                        value={projectData.domain}/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Company</h2>
                    <Input
                        type="text"
                        className="text-gray-900 font-medium"
                        readOnly={!isEdit}
                        value={projectData.company.name}/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Mode of Training</h2>
                    <Select name="modeOfTraining" disabled={!isEdit} //     
                        onValueChange={(value) => setProjectData(prevData => ({      ...prevData,
                            modeOfTraining: value
                        }))}
                    >
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder={projectData.modeOfTraining || "Select Mode"}/>
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
                    <Input type="number" className="text-gray-900 font-medium" readOnly={!isEdit} value={projectData.amount} onChange={(e) => setProjectData((prev) => ({ ...prev, amount: e.target.value }))} />
                </div>

                {/* Dates */}
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Training Start Date</h2>
                    <DatePicker
                                    // selected={formValues.startTime}
                                    name="trainingDates.startDate"
                                    readOnly={!isEdit}
                                    selected={projectData.trainingDates.startDate}
                                    onChange={(date) => handleDateChange(date, "trainingDates.startDate")}
                                    className="px-3 py-2 border  border-gray-300 rounded-md ml-2"
                                   dateFormat="dd/MM/yyyy"
                                    required/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Training End Date</h2>
           
                        <DatePicker
                                    // selected={formValues.endDate}
                                    name="trainingDates.endDate"
                                    readOnly={!isEdit}
                                    selected={projectData.trainingDates.endDate}
                                     onChange={(date) => handleDateChange(date, "trainingDates.endDate")}
                                    dateFormat="dd/MM/yyyy"
                                    className="px-3 py-2 border  border-gray-300 rounded-md ml-2"
                                    required/>
                </div>
                {/* Timing */}
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">Start Timing</h2>
                        <DatePicker
                                    // selected={formValues.startTime}
                                    name="trainingDates.startTime"
                                    readOnly={!isEdit}
                                    selected={new Date(projectData.trainingDates.startTime)}
                                    onChange={(date) => handleDateChange(date, "trainingDates.startTime")}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border  border-gray-300 rounded-md ml-2"
                                    dateFormat="h:mm aa"
                                    required/>
                </div>
                <div className='flex flex-col justify-between'>
                    <h2 className="text-left text-gray-700 mb-[3px]">End Timing</h2>
                    <DatePicker
                                    // selected={formValues.startTime}
                                    name="trainingDates.endTime"
                                    readOnly={!isEdit}
                                    selected={new Date(projectData.trainingDates.endTime)}
                                    onChange={(date) => handleDateChange(date, "trainingDates.endTime")}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border  border-gray-300 rounded-md ml-2"
                                    dateFormat="h:mm aa"
                                    required/>
                </div>
                {/* <div> */}

                {/* </div> */}
            </div>
            
            <div className='mt-8 font-semibold pt-3 border-t flex items-center'>
                                <h2 className=' font-semibold'>Special Training Dates</h2>
                                {
                                    isEdit && <Button className="ml-5 rounded-none" onClick={addSpecialTiming}>Add</Button>
                                }
            </div>

            {projectData.trainingDates
                    ?.specialTimings.length > 0 &&
                    (projectData.trainingDates.specialTimings.map((time, _i) => (
                        <Fragment key={_i}  >

                            <div className='grid grid-cols-4 gap-5 mt-4'>
                                <div className='flex flex-col justify-between'>
                                    <h2 className="text-left text-gray-700 mb-[3px]">Special Date</h2>
                                    <DatePicker
                                    // selected={formValues.endDate}
                                    name="trainingDates.endDate"
                                    readOnly={!isEdit}

                                    selected={time.date}
                                    onChange={(date) => handleSpecialTimingInputChange(date, "date", _i)}
                                    dateFormat="dd/MM/yyyy"
                                    className="px-3 py-2 border  border-gray-300 rounded-md ml-2"
                                    required/>
                                </div>
                                <div className='flex flex-col justify-between'>
                                    <h2 className="text-left text-gray-700 mb-[3px]">Start Timing</h2>
                                    <DatePicker
                                    // selected={formValues.startTime}
                                    name="trainingDates.endTime"
                                    readOnly={!isEdit}
                                    selected={new Date(time.startTime)}
                                    onChange={(date) => handleSpecialTimingInputChange(date, "startTime", _i)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border  border-gray-300 rounded-md ml-2"
                                    dateFormat="h:mm aa"
                                    required/>
                                </div>
                                <div className='flex flex-col justify-between'>
                                    <h2 className="text-left text-gray-700 mb-[3px]">End Timing</h2>
                                    <DatePicker
                                    // selected={formValues.startTime}
                                    name="trainingDates.endTime"
                                    readOnly={!isEdit}
                                    selected={new Date(time.endTime)}
                                    onChange={(date) => handleSpecialTimingInputChange(date, "endTime", _i)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    className="px-3 py-2 border  border-gray-300 rounded-md ml-2"
                                    dateFormat="h:mm aa"
                                    required/>
                                </div>

                                {
                                    isEdit && <div onClick={() =>deleteSpecialDate(_i)} className='mt-8 cursor-pointer'><ion-icon name="trash-outline" style={{color:"red"}}></ion-icon></div>
                                }
                            </div>

                            {/* <Button>Add</Button> */}
                        </Fragment>
                    )))
            }
        </div>
    )
}

export default ViewProjectData
