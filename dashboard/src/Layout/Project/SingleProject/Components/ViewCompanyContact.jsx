import React from 'react'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import { Input } from '@/components/ui/input'

function ViewCompanyContact({data, contact}) {
    return (
        <div className='border my-5 rounded-md px-4 drop-shadow-sm border-gray-300'>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Contact Information</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-4 gap-8 place-content-between">
                            {/* <div className='flex flex-col justify-between'>
                                <h2 className="text-left text-gray-700 mb-[3px]">Company Name</h2>
                                <span
                                    type="text"
                                    className="text-gray-900 font-medium"
                                    readOnly
                                >{data.name}</span>
                            </div> */}
                            <div className='flex flex-col justify-between'>
                                <h2 className="text-left text-gray-700 mb-[3px]">Contact Person</h2>
                                <span
                                    type="text"
                                    className="text-gray-900 font-medium"
                                >{contact.name}</span>
                                    
                            </div>
                            <div className='flex flex-col justify-between'>
                                <h2 className="text-left text-gray-700 mb-[3px]">Contact Email</h2>
                                <span
                                    className="text-gray-900 font-medium"
                                >{contact.email}</span>
                            </div>
                            <div className='flex flex-col justify-between'>
                                <h2 className="text-left text-gray-700 mb-[3px]">Contact Number</h2>
                                <span
                                    className="text-gray-900 font-medium"
                                >{contact.contactNumber}</span>
                            </div>
                            <div className='flex flex-col justify-between'>
                                <h2 className="text-left text-gray-700 mb-[3px]">Department</h2>
                                <span
                                    className="text-gray-900 font-medium"
                                >{contact.department}</span>
                            </div>  
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default ViewCompanyContact
