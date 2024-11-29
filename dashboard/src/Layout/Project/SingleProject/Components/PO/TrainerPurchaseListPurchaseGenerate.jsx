import {Button} from '@/components/ui/button'
import React, {useRef, useState} from 'react'
import PurchaseOrder from './PurchaseOrder'

function TrainerPurchaseListPurchaseGenerate({trainer, index, projectName}) {

    const [showForm,
        setShowForm] = useState(false)

    return (
        <div className=' border-b'>
            <div key={index} className="flex justify-between items-center space-x-4 my-4">
                <div className='font-medium'>{index + 1}) {trainer.trainer.generalDetails.name}</div>

                {trainer.purchaseOrder.details.type !== undefined
                        ? !showForm
                            ? <Button className="rounded-none bg-blue-900" onClick={() => setShowForm(true)}>View PO</Button>
                            : <Button
                                    className="rounded-none bg-white border text-black hover:bg-gray-100 "
                                    onClick={() => setShowForm(false)}>Close</Button>
                    : !showForm
                        ? <Button onClick={() => setShowForm(true)}>Generate</Button>
                        : <Button
                            className="rounded-none bg-white border text-black hover:bg-gray-100 "
                            onClick={() => setShowForm(false)}>Close</Button>
}
            </div>
 
            {/* Show the Form */}
            {showForm && <div className="flex flex-col space-y-4">
            
                <PurchaseOrder
                    projectName={projectName}
                    isPurchased={trainer.purchaseOrder.details.type !== undefined
                    ? trainer.purchaseOrder.details
                    : false}
                    name={trainer.trainer.generalDetails.name}
                    id={trainer.trainer._id}
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
