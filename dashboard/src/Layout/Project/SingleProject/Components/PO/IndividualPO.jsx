import {Button} from '@/components/ui/button'
import React, {useState} from 'react'
import PurchaseOrder from './PurchaseOrder'

function IndividualPO({po, trainer, projectName, index}) {
    const [showForm,
        setShowForm] = useState(false)

    return (
        <div className='my-3 border-t py-3'>
            {/* {index+1} */}
            <div className='flex items-center justify-between py-[4px]'>
                <span className='font-medium text-sm'>Purchase Order {index+1}</span>
                <div className='flex items-center ml-4'>
                    {/* Accepted OR Declined */}
                    <div className='flex items-center '>
                        <div>
                            {po.canSend === true && (
                                <div>
                                    {true
                                        ? <Button
                                                className="rounded-none border bg-white text-green-600 border-green-600 hover:bg-green-600 hover:text-white ">Accepted</Button>
                                        : <Button className="rounded-none border bg-white text-red-600 border-red-600">Declined</Button>
}
                                </div>
                            )
}

                        </div>
                    </div>

                    {/* Generate */}
                    <div className='ml-4'>
                        {/* {po.details.type ? po.details.type : typeOf(po.details.type)} */}
                        {po.details.type !== undefined
                            ? !showForm
                                ? <Button className="rounded-none bg-blue-900" onClick={() => setShowForm(true)}>View PO</Button>
                                : <Button
                                        className="px-4 py-1 rounded-none bg-white border-red-600 text-red-600 border hover:bg-red-100 "
                                        onClick={() => setShowForm(false)}>Close</Button>
                            : !showForm
                                ? <Button className="rounded-none" onClick={() => setShowForm(true)}>Generate</Button>
                                : <Button
                                    className="px-4 py-1 rounded-none bg-white border-red-600 text-red-600 border hover:bg-red-100 "
                                    onClick={() => setShowForm(false)}>Close</Button>
}
                    </div>

                </div>
            </div>

            {/* Show the PO */}
            {showForm && 
            // Has the form 
            <PurchaseOrder
                po={po}
                projectName={projectName}
                isPurchased={po.details.type !== undefined
                ? po.details
                : false}
                name={trainer.trainer.generalDetails.name}
                id={trainer.trainer._id}
                poNumber={index}
                address={trainer.trainer.generalDetails.address}
                trainerGST={trainer.trainer.bankDetails.gstNumber}
                trainerPAN={trainer.trainer.bankDetails.pancardNumber}
            />}
        </div>
    )
}

export default IndividualPO
