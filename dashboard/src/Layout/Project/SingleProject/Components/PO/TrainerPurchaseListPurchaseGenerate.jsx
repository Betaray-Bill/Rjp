import {Button} from '@/components/ui/button'
import React, {Fragment, useEffect, useRef, useState} from 'react'
import PurchaseOrder from './PurchaseOrder'
import IndividualPO from './IndividualPO'

function TrainerPurchaseListPurchaseGenerate({trainer, index, projectName}) {

    const [po,
        setPo] = useState(trainer && trainer.purchaseOrder)

    const [showForm,
        setShowForm] = useState(false)

    const addPO = () => {
        let oldPo = po
        let data = {
                terms: [],
                details: [
                    {
                        description: "",
                        hsnSac: "",
                        typeQty: "",
                        rate: "",
                        amount: "",
                        _id: ""
                    }
                ],
                type: "",
            _id: "",
            canSend: false,
            name: "",
            time: ""
        }

        setPo((p) => [
            ...p,
            data
        ])

    }

    return (
        <div className='py-3 border-gray-300 border p-3 rounded-md my-3'>
            {/* NAME */}
            <div className='flex items-center'>
                <p className='ml-2 font-semibold text-md flex items-center text-blue-800'>
                    <ion-icon name="person-outline" style={{fontSize:"20px", marginRight:"8px"}}></ion-icon>
                    <span>{trainer.trainer.generalDetails.name}</span>
                </p>
                
                <div
                    className='ml-4 flex bg-gray-100 px-2 py-2  place-content-center cursor-pointer hover:bg-gray-200 ease-in-out hover:ease-in-out  items-center'
                        onClick={addPO}
                >
                    <span className='mx-2'>Add Purchase Order</span>
                    <ion-icon
                        name="add-outline"
                        style={{
                        fontSize: "18px"
                    }}></ion-icon>
                </div>
            </div>
            
            {
                trainer && po?.map((e, _i) => (
                    <div className='' key={_i}>
                        {/* <span>PO {_i+1}</span> */}
                        <IndividualPO po={e} trainer={trainer} projectName={projectName} index={_i}/>
                    </div>
                ))
            }

        </div>
    )
}

export default TrainerPurchaseListPurchaseGenerate
