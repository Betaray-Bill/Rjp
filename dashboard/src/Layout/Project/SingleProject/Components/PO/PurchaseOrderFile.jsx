import React, {Fragment, useRef, useState} from 'react'
import logo from "../../../../../assets/logo.png"
import sign from "../../../../../assets/sign.png"
import seal from "../../../../../assets/seal.jpg"
import generatePDF, {Margin, Resolution, usePDF} from 'react-to-pdf';
import {Button} from '@/components/ui/button';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import jsPDF from 'jspdf';

function PurchaseOrderFile({
    name,
    isPurchased,
    tableRows,
    id,
    projectName,
    address,
    terms,
    type,
    trainerGST,
    trainerPAN
}) {
    const [isDownloading,
        setIsDownloading] = useState(false)
    const [isUploading,
        setisUploading] = useState(false)
    const projectId = useParams()
    // check if thr GST is TN or NOT
    const [isTNGST,
        setisTNGST] = useState(trainerGST.startsWith("33"))

    const poRef = useRef();

    const handleDownload = async() => {
        setIsDownloading(p => !p);
        // Download The PO
        const element = poRef.current;
        console.log(element)
        const getTargetElement = () => document.getElementById("poRef");
        console.log(getTargetElement)
        generatePDF(getTargetElement, {
            filename: `Purchase Order - ${name}`,
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

        // const myFile = new File([element], `Purchase Order - ${name}.pdf`, {type: myBlob.type});

        // console.log(myFile);

        // const options = {     margin: 1,     filename: `Purchase Order - ${name}`,
        // image: { type: 'jpeg', quality: 0.98 },     html2canvas: { scale: 2 }, jsPDF:
        // { unit: 'in', format: 'letter', orientation: 'portrait' },   };
        // html2pdf().set(options).from(element).save();

        setTimeout(() => {
            setIsDownloading(p => !p);
            // setisUploading(true)
        }, 2000)
        // Upload the File to the Azure
        setisUploading(true)

        // if (!isPurchased) {
            try {
                // console.log(a)
                const content = poRef.current.outerHTML;
                console.log(content)
                // Create a blob from the content
                const blob = new Blob([content], {type: "pdf"});
                console.log(blob)
                // Create a FormData object to send to the backend
                const formData = new FormData();
                formData.append("file", blob);
                formData.append("projectName", projectName);
                formData.append("fileName", `${name} - Purchase Order`); // Include file name

                console.log(formData.file)

                //  // Call the POST API to upload the file  const uploadResult = await
                // axios.post('http://localhost:5000/api/filestorage/upload-to-blob/training/po'
                // , formData, {     headers: {         "Content-Type": "multipart/form-data" }
                // }); const res = await uploadResult.data console.log(res) get the URL and save
                // it in the Backend of the Trainer as well in the Project DOCS if
                // (uploadResult.status == 200) {
                console.log("URL got success");
                // Update the message with the uploaded file URL
                const data = {
                    // url:res.url,
                    name: `${name} - Purchase Order`,
                    description: tableRows,
                    type: type,
                    terms:terms
                }
                console.log(data)
                const response = await axios.put(`http://localhost:5000/api/project/purchaseOrder/${projectId.projectId}/trainer/${id}`, {
                    ...data
                });
                console.log(response.data)

                // const sendDataToBackend = await axios.put const res console.log("FOrm Data",
                // tableRows, terms) }
            } catch (err) {
                console.log(err)
                alert("Error Uploading File")
            }
        // }

        console.log("FOrm Data", tableRows, terms)

    };

    const handleOnlyDownload = async() => {
        setIsDownloading(p => !p);
        // Download The PO
        const element = poRef.current;
        console.log(element)
        const getTargetElement = () => document.getElementById("poRef");
        console.log(getTargetElement)
        generatePDF(getTargetElement, {
            filename: `Purchase Order - ${name}`,
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

    console.log("FOrm Data", tableRows, terms, type)

    return (
        <Fragment>
            {isPurchased
                ? <div className="flex justify-end m-4">
                        <Button onClick={handleOnlyDownload}>{isDownloading
                                ? "Downloading"
                                : "Download "}</Button>
                    </div>
                : <div className="flex justify-end m-4">
                    <Button onClick={handleDownload}>{isDownloading
                            ? isUploading
                                ? "UPloading...."
                                : "Downloading"
                            : "Download And Send"}</Button>
                </div>
}

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
                            <span className='font-semibold mt-3'>CIN</span>: U72300TN2000PTC046181</p>
                        {/* <p className='text-sm'>
                            <span className='font-semibold'>GSTIN</span>: 33AAFCA8917Q1Z5</p> */}
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
                                            <td className="px-2">{new Date()
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
                                        {trainerGST && <tr>
                                            <td className="px-2 font-medium">Code:</td>
                                            <td className="px-2">{isTNGST
                                                    ? 33
                                                    : `${trainerGST[0]}${trainerGST[0]}`}</td>
                                        </tr>
}
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
                        <p className='text-sm'>{address.flat_doorNo_street}</p>
                        <p className='text-sm'>{address.area}</p>
                        <p className='text-sm'>{address.townOrCity}, {address.state}, {address.pincode}</p>
                        {trainerPAN && <p className='text-sm font-medium'>PAN: {trainerPAN}</p>
}
                        {trainerGST && <p className='text-sm font-medium'>GSTIN: {trainerGST}</p>
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

                            {trainerGST && isTNGST
                                ? (
                                    <Fragment>
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
                                    </Fragment>
                                )
                                : <tr>
                                    <td colSpan="4" className="border border-gray-300 px-4 py-2"></td>
                                    <td className="border border-gray-300 px-4 py-2">IGST 18%</td>
                                    <td className="border border-gray-300 px-4 py-2 text-right">
                                        INR{" "} {(tableRows.reduce((total, row) => total + row.amount, 0) * 1.18).toLocaleString()}
                                    </td>
                                </tr>
}

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
                        {terms.map((term, i) => (
                            <p className='text-sm' key={i}>
                                {i + 1}.) {term}
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