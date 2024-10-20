import React, {useState} from 'react'
import {Label} from '@/components/ui/label'
import {trainingModesEnum, trainingTypes} from '@/utils/constants'
import {useDispatch, useSelector} from 'react-redux'
import {setResumeDetails} from '@/features/trainerSlice'

function TrainingDetails() {
    const dispatch = useDispatch();

    const [trainingDetails,
        setTrainingDetails] = useState({trainerType: "Internal", modeOfTraining: ""})

    const handleChange = (event) => {
        const updatedTrainingDetails = {
            ...trainingDetails,
            [event.target.name]: event.target.value
        }
        setTrainingDetails(updatedTrainingDetails)
        dispatch(setResumeDetails({name: "trainingDetails", data: updatedTrainingDetails}))
    }

    return (
        <div className='ml-5'>
            <h2 className='text-slate-700  text-lg py-4 font-semibold'>Training Details</h2>
            <div
                className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-3 mt-3 '>
                {/* Training courses, institution, duration, mode of training */}
                <div className='flex flex-col'>
                    <Label htmlFor="trainerType" className="mb-2">Type of Trainer</Label>
                    <select name="trainerType" id="" onChange={(e) => handleChange(e)}>
                        {/* <option value="Select the Type"></option> */}
                        {trainingTypes.map((mode, index) => (
                            <option key={index} value={mode}>{mode}</option>
                        ))
}
                    </select>
                </div>

                {trainingDetails.trainerType !== "" && trainingDetails.trainerType !== "Internal"
                    ? (
                        <div className='flex flex-col'>
                            <Label htmlFor="trainingMode" className="mb-2">Mode of Training</Label>
                            <select name="modeOfTraining" id="" onChange={(e) => handleChange(e)}>
                                <option value="Select the Type" defaultValue={true}>Select the Mode</option>
                                {trainingModesEnum.map((mode, index) => (
                                    <option key={index} value={mode}>{mode}</option>
                                ))
}
                            </select>
                        </div>
                    )
                    : <div></div>
}

                <div></div>
            </div>

        </div>
    )
}

export default TrainingDetails
