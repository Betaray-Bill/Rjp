import React from 'react'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import { Input } from '@/components/ui/input'

function ViewCompanyContact({data, contact}) {
    return (
        <div className='border my-5 rounded-md px-4 drop-shadow-sm'>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Contact Information</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-3 gap-8 place-content-between">
                            <div className='flex flex-col justify-between'>
                                <h2 className="text-left text-gray-700 mb-[3px]">Company Name</h2>
                                <Input
                                    type="text"
                                    className="text-gray-900 font-medium"
                                    readOnly
                                    value={data.name}/>
                            </div>
                            <div className='flex flex-col justify-between'>
                                <h2 className="text-left text-gray-700 mb-[3px]">Contact Person</h2>
                                <Input
                                    type="text"
                                    className="text-gray-900 font-medium"
                                    readOnly
                                    value={contact.name}/>
                            </div>
                            <div className='flex flex-col justify-between'>
                                <h2 className="text-left text-gray-700 mb-[3px]">Contact Email</h2>
                                <Input
                                    type="mail"
                                    className="text-gray-900 font-medium"
                                    readOnly
                                    value={contact.email}/>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default ViewCompanyContact
