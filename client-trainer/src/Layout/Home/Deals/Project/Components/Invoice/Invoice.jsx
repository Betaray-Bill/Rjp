import React, {Fragment, useState} from 'react'
import UploadInvoice from './UploadInvoice';
import GenerateInvoice from './GenerateInvoice';
import {Button} from '@/components/ui/button';
import GenerateInvoiceForm from './GenerateInvoiceForm';
import IndividualInvoice from './IndividualInvoice';

function Invoice({purchaseOrder, projectName, inVoice}) {

    const [showInvoice,
        setShowInvoice] = useState(false)

    const z = () => {
        setShowInvoice(!showInvoice)
    }

    return (
        <div className='w-[90vw] lg:w-[80vw]  mt-8 p-6 bg-white rounded-md shadow-sm'>
            {/* Upload Invoice */}

            <div className='flex items-center justify-between'>
                <div className='font-semibold text-md flex items-center justify-start'>
                    <ion-icon
                        name="newspaper-outline"
                        style={{
                        fontSize: "20px",
                        color: "#3e4093"
                    }}></ion-icon>
                    <span className='ml-3'>Invoice</span>
                </div>
            </div>

            <div className='mt-6'>
                {purchaseOrder && purchaseOrder
                    ?.map((po, _i) => (<IndividualInvoice key={_i} index={_i} po={po} projectName={projectName} inVoice={inVoice[_i]}/>))
}
            </div>

        </div>
    )
}

export default Invoice
 