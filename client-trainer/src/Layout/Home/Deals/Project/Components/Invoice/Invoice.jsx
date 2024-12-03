import React, { useState } from 'react'
import UploadInvoice from './UploadInvoice';
import GenerateInvoice from './GenerateInvoice';
import { Button } from '@/components/ui/button';

function Invoice({purchaseOrder}) {

    const [showInvoice, setShowInvoice] = useState(false)

    const z = () => {
        setShowInvoice(!showInvoice)
    }
   
    return (
        <div className='w-[80vw] mt-8 p-6 bg-white rounded-md shadow-sm'>
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

                <div className='flex items-center'>
                    {/* Upload ur Invoice */}
                    <UploadInvoice />

                    {/* Generate Invoice */}
                    <div className='ml-4'>
                        <Button onClick={() => setShowInvoice(!showInvoice)} className="rounded-none">Generate</Button>
                    </div>
                </div>
            </div>
            {
                showInvoice &&
                <div className='mt-4'>
                    <GenerateInvoice purchaseOrder={purchaseOrder}/>
                </div>
            }
        </div>
    )
}

export default Invoice
