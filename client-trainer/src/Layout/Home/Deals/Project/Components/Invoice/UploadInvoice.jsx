import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input';
import React, {useRef, useState} from 'react'

function UploadInvoice() {
    const [file,
        setFile] = useState(null);

    const fileInputRef = useRef(null);

    const handleFileChange = async(event) => {
        const file = event.target.files[0];
        console.log("INSIDE the file: " + file)
        if (file) {
            setFile(file)
            console.log('File uploaded:', file.name);

        }
    };

    // Function to handle the button click and trigger the file input click
    const handleButtonClick = (e) => {
        e.preventDefault()
        console.log("1")
        fileInputRef
            .current
            .click();
        console.log("2")
    };

    return (
        <div>
            <div className="w-full max-w-sm items-center gap-1.5 hidden">
                <Input
                    ref={fileInputRef}
                    id="resume"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.xlsx"/>
            </div>

            <div className='flex items-center justify-start ml-2 hover:cursor-pointer'>
                <Button
                    onClick={handleButtonClick}
                    className="bg-white text-black border border-black rounded-none hover:text-white">
                    Upload
                </Button>
            </div>

        </div>
    )
}

export default UploadInvoice
