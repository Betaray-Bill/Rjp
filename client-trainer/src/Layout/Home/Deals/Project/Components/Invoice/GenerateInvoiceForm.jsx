import React, {Fragment, useState} from 'react'
import GenerateInvoice from './GenerateInvoice'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useSelector } from 'react-redux'
function GenerateInvoiceForm({purchaseOrder, inVoice, index , projectName}) {

    const [formData,
        setFormData] = useState({inVoiceNumber: '', GST: ''})
        const {user} = useSelector(state => state.auth)

    return (
        <div>
            {/* GenerateInvoiceForm */}

            <Fragment>
                <h2 className='font-semibold text-xl mb-5'>1.) Generate Invoice</h2>
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
 
                        {
                            user && user.bankDetails.gstNumber &&
                        
                        <Select  onValueChange={(e) => setFormData({...formData, GST:e})} >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a GST Type "/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>GST Type</SelectLabel>
                                    <SelectItem value="SGST/CGST">SGST/CGST</SelectItem>
                                    <SelectItem value="IGST">IGST</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
}
                    </div>
                </form>
            </Fragment>

            <GenerateInvoice
                inVoice={inVoice}
                purchaseOrder={purchaseOrder}
                index={index}
                projectName={projectName}
                formData={formData}/>
        </div>
    )
}

export default GenerateInvoiceForm
