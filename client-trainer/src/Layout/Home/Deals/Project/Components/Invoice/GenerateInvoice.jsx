import {Button} from '@/components/ui/button'
import React, {Fragment, useRef, useState} from 'react'
import logo from "../../../../../../assets/logo.png"
import generatePDF, {Margin, Resolution, usePDF} from 'react-to-pdf';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {useQueryClient} from 'react-query';
import {useToast} from '@/hooks/use-toast';
import axios from 'axios';
import { toWords } from 'number-to-words'

function GenerateInvoice({purchaseOrder, formData, inVoice}) {
    const {user} = useSelector((state) => state.auth)
    const params = useParams()
    const {toast} = useToast()
    const queryClient = useQueryClient()

    const invoiceRef = useRef();
    const [isTNGST,
        setisTNGST] = useState(user.bankDetails.gstNumber.startsWith("33"))

    const handleSendToRJP = async() => {
        // setIsDownloading(p => !p); Download The PO
        const element = invoiceRef.current;
        console.log(element)
        const getTargetElement = () => document.getElementById("invoiceRef");
        console.log(getTargetElement)

        if (!formData.inVoiceNumber) {
            alert("Please enter Invoice Number")
            return;
        }

        try {
            const sendUrlToDB = await axios.put(`http://localhost:5000/api/trainer/sendInvoice/project/${params.projectId}/trainer/${user._id}`, {inVoiceNumber: formData.inVoiceNumber});
            const resp = await sendUrlToDB.data
            queryClient.invalidateQueries(["projects", params.projectId])
            toast({title: "Invoice Sent Successfully", description: "Your invoice has been sent to RJP.", variant: "success"})
            console.log(resp)
        } catch (err) {
            toast({title: "Failed to Send Invoice", description: "Failed to send invoice to RJP. Please try again later.", variant: "error"})
            console.log(err)
        }
    }

    const handleDownload = async() => {
        
        const element = invoiceRef.current;
        console.log(element)
        const getTargetElement = () => document.getElementById("invoiceRef");
        console.log(getTargetElement)
        generatePDF(getTargetElement, {
            filename: `Invoice  - ${user.generalDetails.name}`,
            overrides: {
                // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
                pdf: {
                    compress: true
                },
                // see https://html2canvas.hertzen.com/configuration for more options
                canvas: {
                    useCORS: true
                }
            }
        })

    }

    return (
        <Fragment>
            {/* {!inVoice.isInvoice
                ? <div className='flex items-end justify-end my-8'>
                        <Button onClick={handleSendToRJP}>Save and Send</Button>
                    </div> */}
                <div className='flex items-center justify-between'>
                    <div className='text-red-600'>
                        *Download and Re-upload the Invoice with your signature on the bottom.*
                    </div>
                    <div className='flex items-end justify-end my-8'>
                        <Button onClick={handleDownload}>Download</Button>
                    </div>
                </div>
{/* } */}
            <div
                className="max-w-6xl mx-auto p-4 text-sm w-[90vw] lg:w-[80vw] "
                id="invoiceRef"
                ref={invoiceRef}>
                <div
                    className="text-center grid place-content-center justify-center font-bold text-lg border-b border-black pb-2">
                    <img src={logo} alt="" className='w-[100px]'/>
                    <span className='my-2'>TAX INVOICE</span>
                </div>

                {/* Header Section */}
                <div className="grid grid-cols-3 border-b border-black ">
                    <div className='p-4 border-l border-black border-r '>
                        <p>
                            <span className="font-semibold uppercase">{user.generalDetails.name}</span>
                            {/* XXXXXXXX */}
                        </p>
                        <p className='mt-2'>
                            <span className="font-medium">
                                {user.generalDetails.address.flat_doorNo_street
}, {user.generalDetails.address.area
}
                                <br></br>
                                {user.generalDetails.address.townOrCity
}, {user.generalDetails.address.state
}, {user.generalDetails.address.pincode
}
                            </span>
                            {/* XXXXXXXX */}
                        </p>
                    </div>
                    <div className='p-4 border-black border-r '>
                        {user && user.bankDetails.gstNumber && <p>
                            <span className="font-bold">GSTIN:
                            </span>
                            {/* XXXXXXXX */}{user.bankDetails.gstNumber}
                        </p>
}
                        <p>
                            <span className="font-bold">PAN No:
                            </span>
                            {user.bankDetails.pancardNumber}
                        </p>
                    </div>
                    <div className='p-4 border-black border-r '>
                        <div>
                            <p>
                                <span className="font-bold">Invoice No:
                                </span>
                                {inVoice && inVoice.isInvoice
                                    ? inVoice.inVoiceNumber
                                    : formData.inVoiceNumber}
                            </p>
                        </div>
                        <div>
                            <p>
                                <span className="font-bold">Date:
                                </span>
                                {new Date()
                                    .toISOString()
                                    .split('T')[0]
                                    .split('-')
                                    .reverse()
                                    .join('-')}
                            </p>
                        </div>
                    </div>
                    {/* Invoice Number and Date */}
                    {/* <div className="grid grid-cols-2 gap-4 border-b border-black py-4"> */}

                    {/* </div> */}
                </div>

                {/* Billing and Shipping Section */}
                <div className="grid grid-cols-2 border border-t-0 border-black">
                    <div className='p-4'>
                        <p className="font-bold">Bill To:</p>
                        <p>
                            M/s.RJP INFOTEK PRIVATE LIMITED,
                            <br/>
                            No.34, Sendhan Towers, 2nd Floor,
                            <br/>
                            First Avenue, Jawaharlal Nehru Road,
                            <br/>
                            Ashok Nagar, Chennai-600083
                        </p>
                        <p>
                            <span className="font-bold">GSTIN:</span>
                            33AACBR8275Q1ZP
                        </p>
                        <p>
                            <span className="font-bold">State:</span>
                            Tamil Nadu
                        </p>
                        <p>
                            <span className="font-bold">Code:</span>
                            33
                        </p>
                    </div>
                    <div className='border-l p-4 border-black'>
                        <p className="font-bold">Ship To:</p>
                        <p>
                            M/s.RJP INFOTEK PRIVATE LIMITED,
                            <br/>
                            No.34, Sendhan Towers, 2nd Floor,
                            <br/>
                            First Avenue, Jawaharlal Nehru Road,
                            <br/>
                            Ashok Nagar, Chennai-600083
                        </p>
                        <p>
                            <span className="font-bold">GSTIN:
                            </span>
                            33AACBR8275Q1ZP
                        </p>

                        <p>
                            <span className="font-bold">Place of Supply:</span>
                            Chennai
                        </p>
                        <p>
                            <span className="font-bold">State:</span>
                            Tamil Nadu
                        </p>
                        <p>
                            <span className="font-bold">Code:</span>
                            33
                        </p>

                    </div>
                </div>

                {/* Place Details */}
                {/* <div className='grid grid-cols-2 border border-t-0 border-black'>
                        <div></div>

                        <div className='px-4 py-2 border-l border-black'>
                            <p>
                                <span className="font-bold">Place of Supply:</span>
                                Chennai
                            </p>
                            <p>
                                <span className="font-bold">State:</span>
                                Tamil Nadu
                            </p>
                            <p>
                                <span className="font-bold">Code:</span>
                                {isTNGST
                                    ? 33
                                    : `${user.bankDetails.gstNumber[0]}${user.bankDetails.gstNumber[0]}`}
                            </p>
                        </div>
                    </div> */}

                <div className='p-2 px-4 border border-black border-t-0'>
                    <p>
                        <span className="font-bold">Attn:
                        </span>
                        P Vijay

                    </p>
                </div>

                {/* Table Section */}
                <div className="">
                    <table
                        className="w-full border border-l border-r border-b-0 border-t-0  border-black text-left">
                        <thead>
                            <tr className="border-b border-black">
                                <th className="border-r border-black px-2 py-1">S.No</th>
                                <th className="border-r border-black px-2 py-1">Description of Service</th>
                                <th className="border-r border-black px-2 py-1">HSN/SAC</th>
                                <th className="border-r border-black px-2 py-1">GST Rate</th>
                                <th className="border-r border-black px-2 py-1">{purchaseOrder
                                        ?.details.type}</th>
                                <th className="border-r border-black px-2 py-1">Rate/Day</th>
                                <th className="px-2 py-1">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseOrder
                                .details
                                .description
                                .map((row, index) => (
                                    <tr key={row.id}>
                                        <td className="border border-gray-600 px-4 py-2 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2">
                                            {row.description}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-center">
                                            {row.hsnSac}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-center">
                                            18%
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-center">
                                            {row.typeQty}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                            {row
                                                .rate
                                                .toLocaleString()}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                            INR {row
                                                .amount
                                                .toLocaleString()}
                                        </td>
                                    </tr>
                                ))}

                            {/* <tr>Hi</tr> */}
                            <tr className=''>
                                <td></td>
                                <td colSpan="5" className="border border-gray-600 border-t py-1 text-center ">Total Taxable Value</td>
                                <td className=''>
                                    INR {purchaseOrder
                                        .details
                                        .description
                                        .reduce((total, row) => total + row.amount, 0)}</td>
                                {/* .reduce((total, row) => total + row.amount, 0) */}
                            </tr>
{/* 
                            <tr>
                                <td className="border border-gray-600 px-4 py-1"></td>
                                <td colSpan="2" className="border border-gray-600 px-4 py-1">Add</td>
                                <td className="border border-gray-600 px-4 py-1"></td>
                                <td className="border border-gray-600 px-4 py-1"></td>
                                <td className="border border-gray-600 px-4 py-1"></td>
                                <td className="border border-gray-600 px-4 py-1"></td>
                            </tr> */}
                            {/* {isTNGST
                                ? <Fragment>
                                        <tr>
                                            <td className="border border-gray-600 px-4 py-1"></td>
                                            <td colSpan="2" className="border text-center border-gray-600 px-4 py-1">CGST</td>
                                            <td className="border border-gray-600 px-4 py-1">9%</td>
                                            <td className="border border-gray-600 px-4 py-1"></td>
                                            <td className="border border-gray-600 px-4 py-1"></td>
                                            <td className="border border-gray-600 px-4 py-1">
                                                INR {purchaseOrder
                                                    .details
                                                    .description
                                                    .reduce((total, row) => total + row.amount, 0) * 0.09
}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-600 px-4 py-1"></td>
                                            <td colSpan="2" className="border text-center border-gray-600 px-4 py-1">SGST</td>
                                            <td className="border border-gray-600 px-4 py-1">9%</td>
                                            <td className="border border-gray-600 px-4 py-1"></td>
                                            <td className="border border-gray-600 px-4 py-1"></td>
                                            <td className="border border-gray-600 px-4 py-1">
                                                INR {purchaseOrder
                                                    .details
                                                    .description
                                                    .reduce((total, row) => total + row.amount, 0) * 0.09
}
                                            </td>

                                        </tr>
                                    </Fragment>
                                : <tr>
                                    <td className="border border-gray-600 px-4 py-1"></td>
                                    <td colSpan="2" className="border text-center border-gray-600 px-4 py-1">IGST</td>
                                    <td className="border border-gray-600 px-4 py-1">18%</td>
                                    <td className="border border-gray-600 px-4 py-1"></td>
                                    <td className="border border-gray-600 px-4 py-1"></td>
                                    <td className="border border-gray-600 px-4 py-1">
                                        INR {purchaseOrder
                                            .details
                                            .description
                                            .reduce((total, row) => total + row.amount, 0) * 0.18
}
                                    </td>

                                </tr>
} */}

                            {/* <tr className='font-semibold'>
                                <td className="border border-gray-600 px-4 py-1"></td>
                                <td colSpan="2" className="border text-center border-gray-600 px-4 py-1">Tax Amount : GST</td>
                                <td className="border border-gray-600 px-4 py-1"></td>
                                <td className="border border-gray-600 px-4 py-1"></td>
                                <td className="border border-gray-600 px-4 py-1"></td>
                                <td
                                    className="border border-b-2 border-r-0 border-t-2 border-gray-600  px-4 py-1">
                                    INR {(purchaseOrder.details.description.reduce((total, row) => total + row.amount, 0) * 0.09 * 2) + purchaseOrder.details.description.reduce((total, row) => total + row.amount, 0)
}
                                </td>

                            </tr> */}

                            <tr className='text-center border-gray-600 border'>
                                <td colSpan="7">
                                    {toWords(Number(purchaseOrder
                                            .details
                                            .description
                                            .reduce((total, row) => total + row.amount, 0)))}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Bank Details */}
                <div className='font-medium mt-4 uppercase'>
                    <h2 className='font-semibold underline'>Our Bank Details</h2>
                    <p>Account Name: {user.bankDetails.accountName}
                    </p>
                    <p>Bank Name: {user.bankDetails.bankName}</p>
                    <p>Bank Address : {user.bankDetails.bankBranch}</p>
                    <p>Bank Account Number : {user.bankDetails.accountNumber}
                    </p>
                    <p>IFSC Code : {user.bankDetails.bankIFSCCode}
                    </p>
                        {/* <p>MICR No: 600240013
                        </p> */}

                </div>

                {/* Footer Section */}
                <div className=" border-black pt-4 font-normal uppercase">
                    <p>For {user.generalDetails.name}
                    </p>
                    {/* IMg - SIgn */}
                    {/* <img src="" alt="sign"/> */}
                    <div className='h-[100px]'>

                    </div>
                    <p>{user.generalDetails.name}
                    </p>

                </div>
            </div>
        </Fragment>
    )
}

export default GenerateInvoice
