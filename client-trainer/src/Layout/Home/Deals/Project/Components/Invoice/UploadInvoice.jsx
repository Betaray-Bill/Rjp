import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';
import axios from 'axios';
import React, {useRef, useState} from 'react'
import { useQueryClient } from 'react-query';
import {useSelector} from 'react-redux';
import { useParams } from 'react-router-dom';

function UploadInvoice({projectName, index}) {
    const [file,
        setFile] = useState(null);
    
        const queryClient = useQueryClient()
    const {user} = useSelector((state) => state.auth)
    const params = useParams()
    const fileInputRef = useRef(null);
    const {toast} = useToast()

    const handleFileChange = async(event) => {
        const file = event.target.files[0];
        console.log("INSIDE the file: " + file)
        if (file) {
            setFile(file)
            console.log('File uploaded:', file.name);

            console.log("Checking blob connection...");
            const result = await api.get('/filestorage/check-blob-connection');
            const response = result.data;
            console.log("Connection check result:", response);

            // If COnnection Success Then Proceed Further
            if (fileInputRef.current.value && result.status == 200) {
                console.log("File is present. Sending data to another API...");

                // Call another POST API Create a FormData object to handle file upload
                const formData = new FormData();
                formData.append("file", file); // Attach the file
                formData.append("projectName", projectName); // Attach the file

                formData.append("fileName", user.generalDetails.name); // Include file name
                // formData.append("sent", currentUser.employee.name); // Additional data
                // (optional) formData.append("timestamps", new Date().toISOString()); //
                // Additional metadata
                console.log(formData)
                // Call the POST API to upload the file
                const uploadResult = await api.post('/filestorage/upload-to-blob/training/invoice', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                if (uploadResult.status == 200) {
                    console.log("File upload response:", uploadResult.data);
                    const url = uploadResult.data.url

                    console.log(url)
                    const data = {
                        url: url,
                        // in
                        index:index
                    }

                    // Post the Invoice in Backend 
                    const sendUrlToDB = await api.put(`/trainer/uploadInvoice/project/${params.projectId}/trainer/${user._id}`, {...data}); 
                    const resp = await sendUrlToDB.data

                    console.log(resp)
                    toast({
                        title: "Invoice Uploaded Successfully",
                        description: "Your invoice has been uploaded successfully to RJP.",
                        variant: "success"
                    })
                    queryClient.invalidateQueries(["projects", params.projectId])
                    // console.log(chatResp) // Add the message to the data array setData([
                    // ...data, {         ...message     } ]); 
                    // console.log("Message added
                    // successfully!");
                }
            }

            queryClient.invalidateQueries(["projects",params.projectId])

        }
    };

    // /upload-to-blob/training/invoice Function to handle the button click and
    // trigger the file input click
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
