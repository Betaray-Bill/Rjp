import React, {Fragment, useRef} from 'react'
import logo from "../../../../../assets/logo.png"
import sign from "../../../../../assets/sign.png"
import seal from "../../../../../assets/seal.jpg"
import generatePDF, {Margin, Resolution, usePDF} from 'react-to-pdf';
import {Button} from '@/components/ui/button';


function PurchaseOrderFile({tableRows, terms ,type}) {

    const poRef = useRef();

    const handleDownload = () => {
        const element = poRef.current;
        console.log(element)
        const getTargetElement = () => document.getElementById("poRef");
        console.log(getTargetElement)
        generatePDF(getTargetElement, {
            filename: "po",
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

    };
    return (
        <Fragment>
            <div className="flex justify-end m-4">
                <Button onClick={handleDownload}>Download</Button>
            </div>
            {/* Add form here */}

            {/* display Data */}
            <div className="max-w-6xl mx-auto p-4" id="poRef" ref={poRef}>
                {/* Header Section */}
                <div className='grid place-content-center text-center my-5'>
                    <img src={logo} width="100px" alt=""/>
                    <h1 className="text-xl font-semibold">RJP Infotek Pvt Ltd</h1>
                </div>

                <div className='grid grid-cols-2 gap-0'>
                    <div className='border border-black p-3'>
                        <h1 className="text-xl font-bold mb-3">RJP Infotek Pvt Ltd</h1>
                        <p className='text-sm'>No. 34, Santhanan Tower, 2nd Floor,</p>
                        <p className='text-sm'>First Avenue, Jawaharlal Nehru Road,</p>
                        <p className='text-sm'>Ashok Nagar, Chennai, Tamil Nadu - 600083</p>
                        <p className='text-sm mt-4'>
                            <span className='font-semibold mt-3'>PAN</span>: AAFCAB8917Q</p>
                        <p className='text-sm'>
                            <span className='font-semibold'>GSTIN</span>: 33AAFCA8917Q1Z5</p>
                    </div>
                    <div className='border-t border-r border-b border-black p-3'>
                        <h1 className="text-xl text-center mb-3 font-bold">Purchase Order</h1>
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
                                            <td className="px-2">28-10-2024</td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 font-medium">RJP GSTIN:</td>
                                            <td className="px-2">33AABCR8275Q1ZP</td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 font-medium">Code:</td>
                                            <td className="px-2">33</td>
                                        </tr>
                                        <tr>
                                            <td className="px-2 font-medium">Place of Supply:</td>
                                            <td className="px-2">Chennai, India</td>
                                        </tr>
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
                        <p className='text-sm'>ANMOL TECHNOLOGIES PRIVATE LIMITED</p>
                        <p className='text-sm'>12, ELCOT SEZ, JAGIR AMMAPALAYAM</p>
                        <p className='text-sm'>VELLAKALPATTI, Salem, Tamil Nadu, 636302</p>
                        <p className='text-sm'>PAN: AAFCAB8917Q</p>
                        <p className='text-sm'>GSTIN: 33AAFCA8917Q1Z5</p>
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
                                <th className="border border-gray-300 px-4 py-2">{type}</th>
                                <th className="border border-gray-300 px-4 py-2">Rate</th>
                                <th className="border border-gray-300 px-4 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map((row, index) => (
                                <tr key={row.id}>
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
                            <tr>
                                <td colSpan="4" className="border border-gray-300 px-4 py-2"></td>
                                <td className="border border-gray-300 px-4 py-2">Subtotal</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                    INR{" "} {tableRows.reduce((total, row) => total + row.amount, 0).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="4" className="border border-gray-300 px-4 py-2"></td>
                                <td className="border border-gray-300 px-4 py-2">CGST 9%</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                    INR{" "} {(tableRows.reduce((total, row) => total + row.amount, 0) * 0.09).toLocaleString()}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="4" className="border border-gray-300 px-4 py-2"></td>
                                <td className="border border-gray-300 px-4 py-2">SGST 9%</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                    INR{" "} {(tableRows.reduce((total, row) => total + row.amount, 0) * 0.09).toLocaleString()}
                                </td>
                            </tr>
                            <tr className="font-bold">
                                <td colSpan="4" className="border border-gray-300 px-4 py-2">
                                    INR{" "} {(tableRows.reduce((total, row) => total + row.amount, 0) * 1.18).toLocaleString()}{" "}
                                    Only
                                </td>
                                <td className="border border-gray-300 px-4 py-2">Total</td>
                                <td className="border border-gray-300 px-4 py-2 text-right">
                                    INR{" "} {(tableRows.reduce((total, row) => total + row.amount, 0) * 1.18).toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer Section */}
                <div className="mt-4">
                    {/* <p className="font-semibold">INR Five Lakh Ninety Thousand Only</p> */}
                    <div>
                        <p className="text-sm mt-2">
                            Terms of Payments: {/* <br/> */}
                        </p>
                        {
                            terms.map((term, i) => (
                                <p className='text-sm' key={i}>
                                    {i+1}.) {term}
                                </p>
                            ))
                        }
                       
                    </div>
                    <div className="flex flex-col justify-start mt-8">
                        <div className='flex items-center'>
                            <img src={sign} alt=""/>
                            <img src={seal} className='ml-4' alt=""/>
                        </div>
                        <div className="text-left mt-4">
                            <p className='text-sm'>P Vijay</p>
                            <p className='text-sm'>Director</p>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default PurchaseOrderFile
