import {Button} from '@/components/ui/button'
import React, {Fragment, useState} from 'react'
import UploadInvoice from './UploadInvoice'
import GenerateInvoiceForm from './GenerateInvoiceForm'

function IndividualInvoice({po, index, inVoice, projectName}) {
    const [showInvoice,
        setShowInvoice] = useState(false)

    const z = () => {
        setShowInvoice(!showInvoice)
    }
    return (
      <div className='border-b border-gray-300 py-2'> 
        <div className='  flex items-center justify-between  '>
            <div className='py-3 flex-col items-center justify-between'>
                <h2 className='font-semibold'>Invoice {index + 1}</h2>
                <div className='flex items-center'>
                    {
                        inVoice && 
                        <div className='flex items-center mt-3'>
                            <span className='font-medium text-blue-700'>
                                {
                                     inVoice.isPaid ? "Paid" : "Not Paid Yet"
                                }
                            </span>
                            <p className='ml-3'>
                                {
                                    inVoice.description ?` - ${inVoice.description}`  : null
                                }
                            </p>
                        </div>
                    }
                </div>
            </div>

            <div>
                    {
                        inVoice && (inVoice.InvoiceUrl !== undefined &&      inVoice.InvoiceUrl !== "")
                            ? <a href={inVoice
                                ? inVoice.InvoiceUrl
                                : null}
                                target="_blank"
                                rel="noopener noreferrer"
                                className='rounded-none px-4 py-2 font-medium text-md bg-black text-white'>
                                Download
                            </a>
                            : <div className='flex items-center'>
                                    {/* <UploadInvoice index={index} projectName={projectName}/> */}
                                    <div className='ml-4'>
                                        <Button onClick={() => setShowInvoice(!showInvoice)} className="rounded-none">View and Generate</Button>
                                    </div>
                                </div>
                    }

            </div>
        </div>
        
            {showInvoice && <div className='mt-4'>

                <div className='grid place-items-end'>
                    <Button onClick={() => setShowInvoice(false)}
                        className="rounded-none bg-white text-red-600 border hover:bg-red-600 border-red-600 hover:text-white"
                    >Close View</Button>
                </div>
                <GenerateInvoiceForm inVoice={inVoice} purchaseOrder={po} index={index} projectName={projectName}/>
            </div>
}
        </div>
    )
}

export default IndividualInvoice
