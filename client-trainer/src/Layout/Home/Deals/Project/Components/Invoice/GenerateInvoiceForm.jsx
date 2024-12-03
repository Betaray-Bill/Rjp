import React, {Fragment, useState} from 'react'
import GenerateInvoice from './GenerateInvoice'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'

function GenerateInvoiceForm({purchaseOrder, inVoice}) {

    const [formData,
        setFormData] = useState({inVoiceNumber: '', placeOfSupply: '', state: ''})

    return (
        <div>
            {/* GenerateInvoiceForm */}
            {
                !inVoice.isInvoice ?
            
            <Fragment>
                <h2 className='font-semibold text-xl mb-5'>Generate Invoice</h2>
            <form className='border p-4 rounded-lg'>
                <h4 className='font-semibold underline  '>Fill the Details</h4>
                <div className='grid grid-cols-2 gap-4 my-4'>
                    <div className='flex items-center'>
                        <Label htmlFor="inVoiceNumber">Invoice Number:</Label>
                        <Input
                            type="text"
                            id="inVoiceNumber"
                            name="inVoiceNumber"
                            className="ml-2"
                            value={formData.inVoiceNumber}
                            onChange={(e) => setFormData({
                            ...formData,
                            inVoiceNumber: e.target.value
                        })}/>

                    </div>
                </div>
            </form> 
            </Fragment>: null}

            <GenerateInvoice inVoice={inVoice} purchaseOrder={purchaseOrder} formData={formData}/>
        </div>
    )
}

export default GenerateInvoiceForm
