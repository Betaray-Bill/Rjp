import React, {useState} from 'react'
import GenerateInvoice from './GenerateInvoice'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'

function GenerateInvoiceForm({purchaseOrder}) {

    const [formData,
        setFormData] = useState({invoiceNumber: '', placeOfSupply: '', state: ''})

    return (
        <div>
            {/* GenerateInvoiceForm */}
            <h2 className='font-semibold text-xl mb-5'>Generate Invoice</h2>
            <form className='border p-4 rounded-lg'>
                <h4 className='font-semibold underline  '>Fill the Details</h4>
                <div className='grid grid-cols-2 gap-4 my-4'>
                    <div className='flex items-center'>
                        <Label htmlFor="invoiceNumber">Invoice Number:</Label>
                        <Input
                            type="text"
                            id="invoiceNumber"
                            name="invoiceNumber"
                            className="ml-2"
                            value={formData.invoiceNumber}
                            onChange={(e) => setFormData({
                            ...formData,
                            invoiceNumber: e.target.value
                        })}/>

                    </div>
                </div>
            </form>

            <GenerateInvoice purchaseOrder={purchaseOrder} formData={formData}/>
        </div>
    )
}

export default GenerateInvoiceForm
