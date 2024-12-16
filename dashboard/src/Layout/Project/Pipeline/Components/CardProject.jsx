import React, {useEffect, useState} from 'react'

function CardProjects({projects, stage}) {
    console.log(projects)
    const [date,
        setDate] = useState(null)
   const [isCompleted,
        setIsCompleted] = useState(false);

    useEffect(() => {
        const remainderStageData = projects && projects
            .remainders
            .filter((item) => {
                return item.stages == stage;
            })
            console.log( projects
                .remainders)
        console.log(remainderStageData)
        if (remainderStageData.length > 0) {
            setDate(new Date(remainderStageData[0].date).toISOString().split("T")[0]);
            // setRemarks(remainderStageData[0].description);
            setIsCompleted(remainderStageData[0].isCompleted);
        } else {
            setDate("");
            // setRemarks("");
             setIsCompleted(false);
        }
    }, [stage])

    const isDatePassed = () => {
        // Get today's date (formatted to YYYY-MM-DD)
        const todayDate = new Date()
            .toISOString()
            .split("T")[0];

        console.log(date, todayDate)

        // Compare dates
        if (todayDate > date) {
            // return true
            console.log("Today's date is greater than the date.");
            return true
        } else if (todayDate === date && isCompleted) {
            console.log("Today's date is equal to the setDate.");
            return true
        } else {
            console.log("Today's date is less than the setDate.");
            return (todayDate < date && isCompleted)
        }

    }
    return (
        <div
            className='border border-gray-200 w-[350px] rounded-sm p-4 py-3 my-5 cursor-pointer bg-white relative'>
            {!isDatePassed() && <div
                className='bg-red-600  rounded-lg absolute top-0 -m-3 text-sm  px-2 py-0.5 text-teal-50  drop-shadow-lg right-1'>{date && date.split("-").reverse().join("-")   }</div>
}

            <div className='flex items-start justify-between mt-3'>
                <h4 className='font-semibold text-sm'>{projects.projectName}</h4>
                <div className='grid place-content-end'>
                    <span className='rounded-md px-2 bg-blue-100 text-sm'>{projects.company.name}</span>
                </div>
            </div>
            <div className='flex   justify-start mt-4 flex-wrap'>
                <span className='font-light text-gray-800 text-sm'>
                    Training :
                </span>
                <span className='font-semibold ml-1 text-sm'>
                    {projects.domain}</span>
            </div>
            <div className='flex items-start  justify-start mt-2'>
                <span className='font-light text-sm'>
                    Owner :
                </span>
                <span className='font-medium ml-2 text-sm'>{projects.projectOwner.name}</span>
            </div>
            <div className='flex items-center justify-start mt-2'>
                <ion-icon
                    name="calendar-outline"
                    style={{
                    fontSize: "18px"
                }}></ion-icon>
                <div className='ml-3 flex items-center justify-between font-light'>
                    <span className='text-sm'>{new Date(projects.trainingDates
                                ?.startDate)
                            .toISOString()
                            .split('T')[0]}</span>
                    <span className='mx-3'>-</span>
                    <span className='text-sm'>{new Date(projects.trainingDates
                                ?.endDate)
                            .toISOString()
                            .split('T')[0]}</span>
                </div>
            </div>

        </div>
    )
}

export default CardProjects
