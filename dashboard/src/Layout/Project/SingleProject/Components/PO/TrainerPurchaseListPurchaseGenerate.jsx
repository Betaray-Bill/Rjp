import {Button} from '@/components/ui/button'
import React, { useState } from 'react'
import PurchaseOrder from './PurchaseOrder'

function TrainerPurchaseListPurchaseGenerate({trainer, index}) {

    const [showForm, setShowForm] = useState(false)

    return (
        <div>
            <div key={index} className="flex justify-between items-center space-x-4 my-4">
                <div className='font-medium'>{index + 1}) {trainer.trainer.generalDetails.name}</div>
                {
                    !showForm ? <Button onClick={() => setShowForm(true)}>Generate</Button> : <Button className="bg-white border text-black hover:bg-gray-100 " onClick={() => setShowForm(false)}>Close</Button>
                }
            </div>
            {/* {
                trainer.trainer.bankDetails.gstNumber
            } */}
            {/* Show the Form */}
            {
                showForm &&
                <div className="flex flex-col space-y-4">
                    {/* Form */}
                    {/*... */}
                    <PurchaseOrder 
                        name={trainer.trainer.generalDetails.name}
                        address={trainer.trainer.generalDetails.address}
                        trainerGST={trainer.trainer.bankDetails.gstNumber} 
                        trainerPAN={trainer.trainer.bankDetails.pancardNumber}
                    />
                </div>
            }
        </div>
    )
}

export default TrainerPurchaseListPurchaseGenerate
