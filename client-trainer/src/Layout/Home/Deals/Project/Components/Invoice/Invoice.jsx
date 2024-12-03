import React, {Fragment, useState} from 'react'
import UploadInvoice from './UploadInvoice';
import GenerateInvoice from './GenerateInvoice';
import {Button} from '@/components/ui/button';
import GenerateInvoiceForm from './GenerateInvoiceForm';

function Invoice({purchaseOrder, projectName, inVoice}) {

    const [showInvoice,
        setShowInvoice] = useState(false)

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

                    {
                    purchaseOrder ? 
                    <Fragment>
                        {  !inVoice.isInvoice
                        ? 
                        <div className='flex items-center'>
                                {/* Upload ur Invoice */}
                                <UploadInvoice projectName={projectName}/> {/* Generate Invoice */}
                                {!inVoice.isInvoice 
                                    ? 
                                    // {
                                        // purchaseOrder && 
                                        <div className='ml-4'>
                                        <Button onClick={() => setShowInvoice(!showInvoice)} className="rounded-none">Generate</Button>
                                    </div>
                                    // }
                                : null
    }
                            </div>
                        : 
                        <Fragment>
                            {
                                inVoice.InvoiceUrl ? 
                                <Button className="rounded-none">
                                    <a
                                        href={inVoice ? inVoice.InvoiceUrl :null}
                                        target="_blank"
                                        rel="noopener noreferrer"  
                                        className='rounded-none'
                                    >   
                                        Download
                                    </a>
                                </Button>:
                                 <Button className="rounded-none" onClick={() => setShowInvoice(!showInvoice)} >Show
                                </Button>
                            }
                        </Fragment>

                    } 
                    </Fragment>
                    : <span className='font-normal italic text-sm'>PO not sent</span> }
                </div>

            {
                showInvoice &&
                <div className='mt-4'>
                    <GenerateInvoiceForm inVoice={inVoice} purchaseOrder={purchaseOrder}/>
                </div>
                
            }
        </div>
    )
}

export default Invoice
