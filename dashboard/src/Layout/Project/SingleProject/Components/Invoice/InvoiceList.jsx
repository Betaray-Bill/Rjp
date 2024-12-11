import {Button} from '@/components/ui/button'
import React, {Fragment} from 'react'

function InvoiceList({trainers, projectName}) {
    return (
        <div
            className='border border-gray-300 my-5 rounded-md  px-4 drop-shadow-sm py-3 border-b'>
            <div className='my-4 font-semibold'>
                Invoice from trainers
            </div>

            {/* Trainers */}
            {trainers && trainers.map((trainer, index) => (
                <div className="border border-gray-200 my-2 rounded-sm p-3">
                    <div className='flex items-center justify-between pb-2' key={index}>
                        {/* <div className='flex items-center'>
                            <span>{index + 1}.)</span>
                            <p className='ml-2'>{trainer.trainer.generalDetails.name}</p>
                        </div> */}
                        <p className='ml-2 font-semibold text-md flex items-center text-blue-800 '>
                            <ion-icon
                                name="person-outline"
                                style={{
                                fontSize: "20px",
                                marginRight: "8px"
                            }}></ion-icon>
                            <span>{trainer.trainer.generalDetails.name}</span>
                        </p>
                        {/* {
                        JSON.stringify(trainer.inVoice)
                    } */}
                        {trainer.inVoice.length > 0
                            ? null
                            : <div className='text-gray-500 text-sm italic'>
                                Invoice not generated
                            </div>
}

                    </div>
                    <div>
                        {trainer && trainer.inVoice.length > 0
                            ? (trainer.inVoice.map((invoice, invoiceIndex) => (
                                <div key={invoiceIndex} className='flex items-center justify-between py-4'>
                                    <div className='flex items-center font-medium text-md'>
                                        Invoice {invoiceIndex + 1}
                                    </div>
                                    <div>



                                        {/* <Button className="rounded-none"> */}
                                        {invoice.InvoiceUrl
                                            ? <div>
                                                {/* <Button>Paid</Button> */}
                                                <a
                                                    href={invoice.InvoiceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className='rounded-none bg-blue-700 text-white px-4 py-2 cursor-pointer'>Download</a>
                                            </div>
                                            : <div className='text-gray-500 text-sm italic'>
                                                Invoice not generated
                                            </div>
                                        }

                                    </div>
                                </div>
                            )))
                            : null
}
                    </div>
                </div>
            ))
}

        </div>
    )
}

export default InvoiceList
