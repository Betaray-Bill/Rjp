import React, {Fragment, useEffect, useRef, useState} from 'react'
// import logo from "../../../../../assets/logo.png"
import logo from "../../../../../assets/logo.png"
import sign from "../../../../../assets/sign.png"
import seal from "../../../../../assets/seal.jpg"
import generatePDF, {Margin, Resolution, usePDF} from 'react-to-pdf';
import {Button} from '@/components/ui/button';
import PurchaseOrderFile from './PurchaseOrderFile';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';

function PurchaseOrder({
    trainerGST,
    isPurchased,
    name,
    poNumber,
    id,
    po,
    trainerPAN,
    address,
    projectName
}) {
    const poRef = useRef();

    const [tableRows,
        setTableRows] = useState([]);

    const [formInput,
        setFormInput] = useState({description: "", type: "", typeQty: "", rate: "", amount: ""});

    const [type,
        setType] = useState("")
        const [purchaseorderNumber,
            setpoNumber] = useState("")
    const [terms,
        setTerms] = useState([])
    const [task,
        setTask] = useState([])


        console.log(po)
    useEffect(() => {
        if (isPurchased) {
            // alert("meow")
            setTableRows(po.details.description)
            setType(po?.details.type)
            setpoNumber(po?.details.purchaseorderNumber)

            setTerms(po?.details.terms)
        }
    }, [])

    const addTerms = () => {
        setTerms([
            ...terms,
            task
        ]);
        setTask("")
    };

    console.log(tableRows)

    // Handle form input change
    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormInput({
            ...formInput,
            [name]: value
        });
    };

    console.log(formInput)

    // Add new row to the table
    const addRow = () => {
        if (formInput.description && formInput.typeQty && formInput.rate) {
            if (editRowIndex !== null) {
                // Save edited row
                const updatedRows = [...tableRows];
                updatedRows[editRowIndex] = {
                    ...updatedRows[editRowIndex],
                    description: formInput.description,
                    typeQty: Number(formInput.typeQty),
                    rate: Number(formInput.rate),
                    amount: Number(formInput.typeQty) * Number(formInput.rate)
                };
                setTableRows(updatedRows);
                setEditRowIndex(null); // Exit edit mode
            } else {
                // Add new row
                setTableRows([
                    ...tableRows, {
                        id: tableRows.length + 1,
                        description: formInput.description,
                        hsnSac: "993293",
                        typeQty: Number(formInput.typeQty),
                        rate: Number(formInput.rate),
                        amount: Number(formInput.typeQty) * Number(formInput.rate)
                    }
                ]);
            }
            // Clear form
            setFormInput({description: "", typeQty: "", rate: "", amount: ""});
        } else {
            alert("Please fill in all fields.");
        }
    };
    const [editRowIndex,
        setEditRowIndex] = useState(null);

    const [preview,
        setPreview] = useState(false)

    const editRow = (index) => {
        const row = tableRows[index];
        setFormInput({description: row.description, typeQty: row.typeQty, rate: row.rate, amount: row.amount});
        setEditRowIndex(index);
    };
    console.log(poNumber)
    return (
        <div className='border my-5 rounded-md px-4 drop-shadow-sm'>
            <div className='my-4 font-semibold'>
                Purchase Order for trainers 
            </div>

            {/* FORM */}
            <div>
                <div className="my-5">
                    <div className='flex items-center justify-between'>
                        <h2 className="text-md font-semibold mb-3">Add New Description</h2>

                    </div>
                    <Fragment>
                        <div className='my-3'>
                            <Label>Purchase Order Number</Label>
                            <Input type="text" name="poNumber" onChange={(e) => setpoNumber(e.target.value)}/>
                        </div>
                        <Select onValueChange={(e) => setType(e)} value={type}>
                            <SelectTrigger className="w-max">
                                <SelectValue placeholder="Select a Type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Days">Days</SelectItem>
                                    <SelectItem value="Hours">Hours</SelectItem>
                                    <SelectItem value="No of PAX">No of PAX</SelectItem>
                                    <SelectItem value="Quantity">Quantity</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="grid grid-cols-1 my-4 sm:grid-cols-3 gap-4">

                            <Input
                                type="number"
                                name="typeQty"
                                value={formInput.typeQty}
                                min={1}
                                onChange={handleChange}
                                placeholder={type
                                ? `Enter ${type}`
                                : ""}
                                className="border p-2 rounded w-full"/>
                            <Input
                                type="number"
                                name="rate"
                                min={1}
                                value={formInput.rate}
                                onChange={handleChange}
                                placeholder="Enter Rate"
                                className="border p-2 rounded w-full"/>
                            <Input
                                type="number"
                                name="amount"
                                min={1}
                                value={formInput.rate * formInput.typeQty}
                                onChange={handleChange}
                                placeholder="Enter Amount"
                                className="border p-2 rounded w-full"/>
                        </div>
                        <Textarea
                            type="text"
                            name="description"
                            value={formInput.description}
                            onChange={handleChange}
                            placeholder="Enter Description"
                            className="border p-2 rounded w-full mt-6"/>
                        <Button onClick={addRow} className="my-3">
                            {editRowIndex !== null
                                ? "Save Changes"
                                : "Add Description"}
                        </Button>


                        <div className='my-4 '>
                            <h2>Description List
                            </h2>
                            {tableRows?.length > 0 && tableRows.map((row, index) => (
                                <div className='flex items-start justify-between'>
                                    <div key={index} className="flex items-start flex-col justify-between my-3">
                                        <div className="flex items-start">
                                            <span className="text-sm font-normal mr-2">{index + 1}.
                                            </span>
                                            <span>{row.description}</span>
                                        </div>
                                        <div className='flex flex-col ml-3'>
                                            <span className='my-1'>Type Qty: {row.typeQty}</span>
                                            <span className='my-2'>Rate: {row.rate}</span>
                                            <span>Amount: {row.amount}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Button onClick={() => editRow(index)}>Edit</Button>
                                    </div>
                                </div>
                            ))
}
                        </div>

                    </Fragment>

                </div>

            </div>

            {/* Terms */}
            <div>
                <h2 className='font-semibold my-4'>Add Terms</h2>
                <Textarea
                    type="text"
                    placeholder="Add a new term..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}/>
                <Button onClick={addTerms} className="my-3">
                    Add Terms
                </Button>
            </div>
            <div>
                <ul>
                    {
                        po.details.terms?.length > 0 && po.details.terms?.map((e, i) => (
                            <li key={i}>{e}</li>
                        ))
                    }
                </ul>
            </div>

            <PurchaseOrderFile
                id={id}
                projectName={projectName}
                purchaseorderNumber={purchaseorderNumber}
                name ={name}
                isPurchased={isPurchased}
                terms={terms}
                type={type}
                tableRows={tableRows}
                trainerGST={trainerGST}
                trainerPAN={trainerPAN}
                address={address}
                poNumber={poNumber}
            />

        </div>
    )
}

export default PurchaseOrder
