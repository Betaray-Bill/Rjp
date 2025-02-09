import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import React, {Fragment} from 'react'
import InvoiceContent from './InvoiceContent'

function InvoiceList({trainers, projectName}) {
    return (
        <div
            className='border border-gray-300 my-5 rounded-md  px-4 drop-shadow-sm py-3 border-b'>
            <div className='my-4 font-semibold'>
                Invoice from trainers
            </div>

            {/* Trainers */}
            {trainers && trainers.map((trainer, index) => {
                return trainer?.trainer?.trainingDetails?.trainerType !== "Internal" && <div className="border border-gray-200 my-2 rounded-sm p-3">
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
                                <div key={invoiceIndex} className='flex items-start justify-between py-4'>
                                    <InvoiceContent key={invoiceIndex} trainer={trainer} index={invoiceIndex} id={trainer.trainer._id} invoice={invoice}/>
                                </div>
                            )))
                            : null
}
                    </div>
                </div>
})
}

        </div>
    )
}

export default InvoiceList
