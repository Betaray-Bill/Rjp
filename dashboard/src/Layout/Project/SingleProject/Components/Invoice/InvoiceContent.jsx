import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import api from '@/utils/api'
import axios from 'axios'
import React, {Fragment, useState} from 'react'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'

function InvoiceContent({index, invoice ,id, trainer}) {
    const [show,
        setShow] = useState(false)
    const {toast} = useToast()
    const projectId = useParams()
    const queryClient = useQueryClient();


    const [paidContent,
        setPaidContent] = useState({isPaid: invoice.isPaid , index: index, description: invoice.description,  trainerId:id, dueDate: invoice?.dueDate ? invoice.dueDate : new Date() })

    console.log(paidContent)

    const sendPaidINfoToINvoice = async() => {
        try {
            await api.put(`/project/updateInvoice/project/${projectId.projectId}/trainer/${id}`, {...paidContent})
            console.log("Invoice updated successfully")
            setShow(false)
            queryClient.invalidateQueries(['ViewProject', projectId.projectId]);
            toast({
                variant: "success",
                title: "Invoice updated successfully",
            })
        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "Failed to update invoice",
            })
        }
    }

    return (
        <Fragment>
            <div className='flex items-center font-semibold text-md'>
                Invoice {index + 1}
            </div>
            <div>

                {/* <Button className="rounded-none"> */}
                {invoice.InvoiceUrl
                    ? <div className='flex-col justify-items-end'>
                            <div className='flex items-center'>
                                <a
                                    href={invoice.InvoiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='rounded-none bg-blue-700 text-white px-4 py-2 cursor-pointer'>Download</a>

                                <div
                                    className='ml-4 cursor-pointer hover:bg-gray-200 px-2 py-1'
                                    onClick={() => setShow(p => !p)}>
                                    {show
                                        ? <ion-icon name="chevron-up-outline"></ion-icon>
                                        : <ion-icon name="chevron-down-outline"></ion-icon>
}
                                </div>
                            </div>

                            {show && <div className='flex items-end mt-6'>
                                {/* <Button>Paid</Button> */}
                                <div>
                                    <Label>Due Date</Label>
                                    <Input type="date" className=" w-[max]" onChange={(e) => setPaidContent((p) =>( {...p, dueDate:e.target.value}))} value={invoice.dueDate ? new Date(invoice.dueDate).toISOString().split("T")[0] : paidContent.dueDate}/>
                                </div>
                                <Input type="text" className="mx-3" onChange={(e) => setPaidContent((p) =>( {...p, description:e.target.value}))} value={invoice.description ? invoice.description : paidContent.description}/>
                                <Button className="rounded-none bg-green-600 mx-3" onClick={() => setPaidContent((p) =>( {...p, isPaid:!p.isPaid}))}>{paidContent.isPaid ? "Paid" : "Pay"}</Button>
                                <Button className="rounded-none bg-black" onClick={sendPaidINfoToINvoice}>Send</Button>
                            </div>
}
                        </div>
                    : <div className='text-gray-500 text-sm italic'>
                        Invoice not generated
                    </div>
}

            </div>

        </Fragment>
    )
}

export default InvoiceContent
