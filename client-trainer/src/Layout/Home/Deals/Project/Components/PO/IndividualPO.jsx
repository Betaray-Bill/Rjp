import React, {Fragment, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import logo from "../../../../../../assets/logo.png"
import sign from "../../../../../../assets/sign.png"
import seal from "../../../../../../assets/seal.jpg"
import generatePDF, {Margin, Resolution, usePDF} from 'react-to-pdf';
import {Button} from '@/components/ui/button'
import {toWords} from 'number-to-words';
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { useToast } from '@/hooks/use-toast'

function IndividualPO({purchaseOrder, index}) {

    console.log(purchaseOrder)
    const params = useParams()
    // const {trainerDetails} = useSelector(state => state.trainer)
    const {user} = useSelector(state => state.auth)
    console.log(user)
    const queryClient = useQueryClient()
    const [isTNGST,
        setisTNGST] = useState(user && user.bankDetails.gstNumber.startsWith('33'))
    const {toast} = useToast()

    const poRef = useRef();
    const [showForm,
        setShowForm] = useState(false)

    const [isAccepted, setIsAccepted] = useState(false)

    const handleOnlyDownload = async() => {
        // setIsDownloading(p => !p); Download The PO
        const element = poRef.current;
        console.log(element)
        const getTargetElement = () => document.getElementById("poRef");
        console.log(getTargetElement)
        generatePDF(getTargetElement, {
            filename: `Purchase Order - ${user.generalDetails.name}`,
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


    const handleAcceptDeclinePO = async(val) => {
        try {
            // console.log(a)
            const response = await axios.put(`http://localhost:5000/api/project/accept-decline/${params.projectId}/trainer/${user._id}`, {
                isAccepted:val,
                poNumber:index
            });
            console.log(response.data)
            queryClient.invalidateQueries(['projects', params.projectId]);
            toast({
                title: val ? "Po Accepted" : "PO Declined",
                // description: "Purchase Order has been downloaded as a PDF",
                // variant: "success",
                // duration: 5000
            })
            // const sendDataToBackend = await axios.put const res console.log("FOrm Data",
            // tableRows, terms) }
        } catch (err) {
            console.log(err)
            alert("Error Uploading File")
        }
        // console.log("FOrm Data", tableRows, terms)

    };
    return (
        <div className='border-b border-gray-300 '>
            <div className='py-3 flex items-center justify-between'>
                <h2>Purchase Order {index+1}</h2>
                <div className='flex items-center'>
                        {
                            purchaseOrder.isAccepted && 
                            <div className='w-full text-center mx-3'>
                                <p className='text-md text-green-600 '>Accepted</p>
                            </div>
                        }
                      
                        {purchaseOrder && purchaseOrder.details.description.length > 0
                            ? !showForm
                                ? <Button className="bg-black rounded-none" onClick={() => setShowForm(true)}>View PO</Button>
                                : <Button
                                        className="bg-white border text-black hover:bg-gray-100 "
                                        onClick={() => setShowForm(false)}>Close</Button>
                            : <span className='italic font-medium text-sm text-gray-700'>PO not issued Yet</span>
}
                </div>
            </div>

            {/* PO */}
            {showForm && (
                <Fragment>
                    <div className='grid place-content-end mt-8'>
                        <Button onClick={() => handleOnlyDownload()} className="flex items-center">
                            <ion-icon
                                name="arrow-down-outline"
                                style={{
                                fontSize: "20px"
                            }}></ion-icon>
                            <span className='ml-2'>Download</span>
                        </Button>
                    </div>
                    {
                        purchaseOrder && 
                        <div className="max-w-6xl mx-auto p-4 border my-3" id="poRef" ref={poRef}>
                            {/* Header Section */}
                            <div className='grid place-content-center text-center my-5'>
                                <img
                                    src={logo}
                                    width="100px"
                                    alt=""
                                    style={{
                                    marginLeft: "40px"
                                }}/>
                                <h1 className="text-xl font-semibold">RJP Infotek Pvt Ltd</h1>
                            </div>
                            <div className='flex items-center justify-center mb-3'>
                                <h2 className='text-lg font-semibold'>Purchase Order</h2>
                            </div>

                            <div className='grid grid-cols-2 gap-0'>
                                <div className='border border-black p-3'>
                                    <h1 className="text-xl font-bold mb-3">RJP Infotek Pvt Ltd</h1>
                                    <p className='text-sm'>No. 34, Santhanan Tower, 2nd Floor,</p>
                                    <p className='text-sm'>First Avenue, Jawaharlal Nehru Road,</p>
                                    <p className='text-sm'>Ashok Nagar, Chennai, Tamil Nadu - 600083</p>
                                    <p className='text-sm mt-4'>
                                        <span className='font-semibold mt-3'>CIN</span>: U72300TN2000PTC046181</p>
                                    {/* <p className='text-sm'>
                                                <span className='font-semibold'>GSTIN</span>: 33AAFCA8917Q1Z5</p> */}
                                </div>
                                <div className='border-t border-r border-b border-black p-3'>
                                    <h1 className="text-xl text-center mb-3 font-bold"></h1>
                                    <div>
                                        <div className='max-w-max'>
                                            <table className="table-auto border-collapse w-full text-left text-sm">
                                                <tbody>
                                                    <tr>
                                                        <td className="px-2 font-medium">PO No# :</td>
                                                        <td className="px-2">RJP462425</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-2 font-medium">Date:</td>
                                                        <td className="px-2">{new Date(purchaseOrder.time)
                                                                .toISOString()
                                                                .split('T')[0]
                                                                .split('-')
                                                                .reverse()
                                                                .join('-')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-2 font-medium">RJP GSTIN:</td>
                                                        <td className="px-2">33AABCR8275Q1ZP</td>
                                                    </tr>
                                                    {/* {user.bankDetails.gstNumber && <tr>
                                                                <td className="px-2 font-medium">Code:</td>
                                                                <td className="px-2">{isTNGST
                                                                        ? 33
                                                                        : `${user.bankDetails.gstNumber[0]}${user.bankDetails.gstNumber[0]}`}</td>
                                                            </tr>
                    }
                                                            <tr>
                                                                <td className="px-2 font-medium">Place of Supply:</td>
                                                                <td className="px-2">Chennai, India</td>
                                                            </tr> */}
                                                    <tr>
                                                        <td className="px-2 font-medium">PAN:</td>
                                                        <td className="px-2">AABCR8275Q</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className=' border-black p-3 border-l border-bs'>
                                    <p className="font-semibold mt-4">To:</p>
                                    <p className='text-sm'>{user.generalDetails.address.flat_doorNo_street}</p>
                                    <p className='text-sm'>{user.generalDetails.address.area}</p>
                                    <p className='text-sm'>{user.generalDetails.address.townOrCity}, {user.generalDetails.address.state}, {user.generalDetails.address.pincode}</p>
                                    {user.bankDetails.pancardNumber && <p className='text-sm font-medium'>PAN: {user.bankDetails.pancardNumber}</p>
    }
                                    {user.bankDetails.gstNumber && <p className='text-sm font-medium'>GSTIN: {user.bankDetails.gstNumber}</p>
    }
                                    {/* <p className='text-sm'>PAN: AAFCAB8917Q</p> */}
                                    {/* <p className='text-sm'>GSTIN: 33AAFCA8917Q1Z5</p> */}
                                </div>
                                {/* Right Address */}
                                <div className='border-l border-r  border-black p-3'>
                                    <p className="font-semibold mt-3">Bill To:</p>
                                    <p className='text-sm'>RJP Infotek Pvt Ltd</p>
                                    <p className='text-sm'>No. 34, Santhanan Tower, 2nd Floor,</p>
                                    <p className='text-sm'>First Avenue, Jawaharlal Nehru Road,</p>
                                    <p className='text-sm'>Ashok Nagar, Chennai, Tamil Nadu - 600083</p>
                                    <p className='text-sm'>Your Phone No.: 044-24731012</p>
                                    <p className='text-sm'>Attn: P Vijay</p>
                                </div>
                            </div>

                            {/* Table Section */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300 text-sm">
                                    <thead>
                                        <tr className="bg-blue-900 text-white">
                                            <th className="border border-gray-300 px-4 py-2">S No</th>
                                            <th className="border border-gray-300 px-4 py-2">Description</th>
                                            <th className="border border-gray-300 px-4 py-2">HSN / SAC</th>
                                            <th className="border border-gray-300 px-4 py-2">{purchaseOrder.details.type}</th>
                                            <th className="border border-gray-300 px-4 py-2">Rate</th>
                                            <th className="border border-gray-300 px-4 py-2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchaseOrder && purchaseOrder
                                            .details
                                            .description
                                            .map((row, index) => (
                                                <tr key={index}>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {row.description}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        {row.hsnSac}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        {row.typeQty}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-right">
                                                        INR {row
                                                            .rate
                                                            .toLocaleString()}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-right">
                                                        INR {row
                                                            .amount
                                                            .toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        {/* <tr>
                                                    <td colSpan="4" className="border border-gray-300 px-4 py-2"></td>
                                                    <td className="border border-gray-300 px-4 py-2">Subtotal</td>
                                                    <td className="border border-gray-300 px-4 py-2 text-right">
                                                        INR{" "} {purchaseOrder.details.description.reduce((total, row) => total + row.amount, 0).toLocaleString()}
                                                    </td>
                                                </tr> */}

                                        {/* {user.bankDetails.gstNumber && isTNGST
                                                    ? (
                                                        <Fragment>
                                                            <tr>
                                                                <td colSpan="4" className="border border-gray-300 px-4 py-2"></td>
                                                                <td className="border border-gray-300 px-4 py-2">CGST 9%</td>
                                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                                    INR{" "} {(purchaseOrder.details.description.reduce((total, row) => total + row.amount, 0) * 0.09).toLocaleString()}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="4" className="border border-gray-300 px-4 py-2"></td>
                                                                <td className="border border-gray-300 px-4 py-2">SGST 9%</td>
                                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                                    INR{" "} {(purchaseOrder.details.description.reduce((total, row) => total + row.amount, 0) * 0.09).toLocaleString()}
                                                                </td>
                                                            </tr>
                                                        </Fragment>
                                                    )
                                                    : <tr>
                                                        <td colSpan="4" className="border border-gray-300 px-4 py-2"></td>
                                                        <td className="border border-gray-300 px-4 py-2">IGST 18%</td>
                                                        <td className="border border-gray-300 px-4 py-2 text-right">
                                                            INR{" "} {(purchaseOrder.details.description.reduce((total, row) => total + row.amount, 0) * 1.18).toLocaleString()}
                                                        </td>
                                                    </tr>
                    } */}

                                        <tr className="font-bold">
                                            <td colSpan="4" className="border border-gray-300 px-4 py-2">
                                                INR{" "} {toWords(Number(purchaseOrder.details.description.reduce((total, row) => total + row.amount, 0))).toLocaleUpperCase()}{" "}
                                                Only
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">Total</td>
                                            <td className="border border-gray-300 px-4 py-2 text-right">
                                                INR{" "} {(purchaseOrder.details.description.reduce((total, row) => total + row.amount, 0)).toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer Section */}
                            <div className="mt-4">
                                <div>
                                    <p className="text-sm mt-2">
                                        Terms of Payments: {/* <br/> */}
                                    </p>
                                    <p className='text-sm'>1.) GST additional as applicable</p>
                                    {purchaseOrder.details
                                        ?.terms
                                            ?.map((term, i) => (
                                                <p className='text-sm' key={i}>
                                                    {i + 2}.) {term}
                                                </p>
                                            ))
    }

                                </div>
                                <div className="flex flex-col justify-start mt-8">
                                    {/* <div className='flex items-center'>
                                            <img src={sign} alt=""/>
                                            <img src={seal} className='ml-4' alt=""/>
                                        </div> */}
                                    <div className="text-left mt-4">
                                        <p className='text-sm'>P Vijay</p>
                                        <p className='text-sm'>Director</p>
                                    </div>
                                </div>
                            </div>
                        </div>             
                    }

                    {/* Accept or Decline Buttons */}
                    <div className='mb-5 flex items-start justify-center'>
                       {
                        !purchaseOrder.isAccepted &&
                        (
                            <Fragment>
                                <div className='mx-4'>
                                    <Button className="rounded-none bg-green-700 font-semibold" onClick={() => handleAcceptDeclinePO(true)}>
                                        <ion-icon name="thumbs-up-outline" style={{fontSize:"20px"}}></ion-icon>
                                        <span className='ml-1 font-semibold'>Accept</span>
                                    </Button>
                                </div>
                                <div className='mx-4'>
                                    <Button className="rounded-none bg-white border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"  onClick={() => handleAcceptDeclinePO(false)}>
                                        <ion-icon name="close-outline" style={{fontSize:"20px"}}></ion-icon>
                                        <span className='ml-1 font-semibold'>Decline</span>
                                    </Button>
                                </div>
                            </Fragment>
                        )
                       }
                    </div>
                </Fragment>
            )
}
        </div>
    )
}

export default IndividualPO

