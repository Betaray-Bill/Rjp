import { Button } from '@/components/ui/button'
import React from 'react'
import TrainerPurchaseListPurchaseGenerate from './TrainerPurchaseListPurchaseGenerate'

function TrainerPurchaseList({trainers, projectName}) {
    console.log(":Trainers ", trainers)
    return (
        <div className='border border-gray-300 my-5 rounded-md px-4 drop-shadow-sm'>
            <div className='my-4 font-semibold'>
                Purchase Order for trainers
            </div>

            {/* Trainers */}
            {
                trainers && trainers.map((trainer, index) => {
                   return trainer?.trainer?.trainingDetails?.trainerType !== "Internal" && <TrainerPurchaseListPurchaseGenerate projectName={projectName} trainer={trainer} index={index}/>
})
            }



        </div>
    )
}

export default TrainerPurchaseList
