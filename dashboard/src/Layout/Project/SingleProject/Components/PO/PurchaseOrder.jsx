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

function PurchaseOrder({
    trainerGST,
    isPurchased,
    name,
    id,
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
    const [terms,
        setTerms] = useState([])
    const [task,
        setTask] = useState([])

    useEffect(() => {
        if (isPurchased) {
            // alert("meow")
            setTableRows(isPurchased.description)
            setType(isPurchased.type)
            setTerms(isPurchased
                ?.terms)
        }
    }, [])

    const addTerms = () => {
        setTerms([
            ...terms,
            task
        ]);
        setTask("")
    };

    console.log(terms)

    // Handle form input change
    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormInput({
            ...formInput,
            [name]: value
        });
    };

    // Add new row to the table
    const addRow = () => {
        if (formInput.description && formInput.typeQty && formInput.rate) {
            setTableRows([
                ...tableRows, {
                    id: tableRows.length + 1,
                    description: formInput.description,
                    hsnSac: "993293", // constant value
                    typeQty: Number(formInput.typeQty),
                    rate: Number(formInput.rate),
                    amount: Number(formInput.typeQty) * Number(formInput.rate)
                }
            ]);
            // Clear form after adding
            setFormInput({description: "", typeQty: "", rate: "", amount: ""});
        } else {
            alert("Please fill in all fields.");
        }
    };
    const [preview,
        setPreview] = useState(false)

    return (
        <div className='border my-5 rounded-md px-4 drop-shadow-sm'>
            <div className='my-4 font-semibold'>
                Purchase Order for trainers
            </div>

            {/* FORM */}
            {!isPurchased && <div>
                <div className="my-5">
                    <div className='flex items-center justify-between'>
                        <h2 className="text-md font-semibold mb-3">Add New Row</h2>

                    </div>
                    <Fragment>
                        <Select onValueChange={(e) => setType(e)}>
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
                            Add Row
                        </Button>

                        {/* Terms */}
                        <div>
                            <Textarea
                                type="text"
                                placeholder="Add a new term..."
                                value={task}
                                onChange={(e) => setTask(e.target.value)}/>
                            <Button onClick={addTerms} className="my-3">
                                Add Terms
                            </Button>
                        </div>
                    </Fragment>

                </div>

            </div>
}
            <PurchaseOrderFile
                id={id}
                projectName={projectName}
                name
                ={name}
                isPurchased={isPurchased}
                terms={terms}
                type={type}
                tableRows={tableRows}
                trainerGST={trainerGST}
                trainerPAN={trainerPAN}address={address}/>

        </div>
    )
}

export default PurchaseOrder
