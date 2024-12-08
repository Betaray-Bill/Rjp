import {Button} from '@/components/ui/button'
import React from 'react'

function InvoiceList({trainers, projectName}) {
    return (
        <div className='border my-5 rounded-md px-4 drop-shadow-sm'>
            <div className='my-4 font-semibold'>
                Invoice from trainers
            </div>

            {/* Trainers */}
            {trainers && trainers.map((trainer, index) => (
                <div className='flex items-center justify-between py-3 border-b' key={index}>
                    <div className='flex items-center'>
                        <span>{index + 1}.)</span>
                        <p className='ml-2'>{trainer.trainer.generalDetails.name}</p>
                    </div>
                    {trainer.inVoice.isInvoice
                        ? <div>
                                <Button className="rounded-none">
                                    <a
                                        href={trainer.inVoice.InvoiceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='rounded-none'>
                                        Download
                                    </a>
                                </Button>
                            </div>
                        : <div className='text-gray-500 text-sm italic'>
                            Invoice not generated
                        </div>
}

                </div>
            ))
}

        </div>
    )
}

export default InvoiceList
