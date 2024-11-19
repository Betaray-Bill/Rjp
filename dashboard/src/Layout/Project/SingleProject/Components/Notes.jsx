import React, { useRef, useState } from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Input} from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

function Notes() {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({
        text:{
            content: ''
        },
        file:{
            url:"",
            name:""
        },
        sent: "",
        timestamps: new Date(),
        photo_url: "https://example.com/photos/alice.jpg"
    })

    const [data, setData] = useState([
        
    ])

    const changeChatOrder = async(e) => {
        console.log(e)
    }

    // UPloading the Resume and Extracting the Resume
    const fileInputRef = useRef(null);

    // Function to handle file upload
    const handleFileChange = async(event) => {
        const file = event.target.files[0];
        console.log("INSIDE the file: " + file)
        if (file) {
            setFile(file)
            console.log('File uploaded:', file.name);
            setMessage({...message, file:{
                url: URL.createObjectURL(file),
                // name: file.name
            }})
        }
    };
    // Function to handle the button click and trigger the file input click
    const handleButtonClick = (e) => {
        e.preventDefault()
        console.log("1")
        fileInputRef.current.click();
        console.log("2")
    };

    const handleCancelButtonClick = () => {
        setFile(null);
        fileInputRef.current.value  = null;
        setMessage({
            text:{
                content: ''
            },
            file:{
                url:"",
                name:""
            },
            sent: "",
            timestamps: new Date(),
            photo_url: "https://example.com/photos/alice.jpg"
        });
    }

    const submitMessage = async() => {
        console.log(message)
        if (message) {
            setData([...data, {...message}]);
            setMessage({
                text:{
                    content: ''
                },
                file:{
                    url:"",
                    name:""
                },
                sent: "",
                timestamps: new Date(),
                photo_url: "https://example.com/photos/alice.jpg"
            });



        }
    }


    return (
        <div className='border rounded-md shadow-sm mt-8 py-4 px-4'>
            <div className='flex items-center justify-between pb-2 border-b'>
                <p className='font-semibold text-lg'>Notes</p>
                <Select
                    className="border bg-blue-300"
                    onValueChange={(e) => changeChatOrder(e)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Recent"/>
                    </SelectTrigger>
                    <SelectContent className="text-blue-400">
                        <SelectItem value="Recent Last">Recent Last</SelectItem>
                        <SelectItem value="Recent First">Recent First</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='mt-4'>
                {/* Chat Wrapper */}
                <div
                    className='relative'>
                        {
                        data.length > 0 ?
                            <div className='min-h-[100px] max-h-[80vh] h-max relative scroll-m-1 overflow-y-scroll  rounded-t-md shadow-sm border p-3'>            
                                {
                                    data && data.map((item, index) => (
                                    <div key={index} className="flex items-start justify-start mt-[20px]">
                                        <Avatar>
                                            <AvatarImage src={item.photo_url || "https://via.placeholder.com/150"}/>
                                            <AvatarFallback>{item
                                                    .sent
                                                    .charAt(0)
                                                    .toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-2">
                                            <div className="flex items-center justify-between">
                                                <p className="font-normal text-slate-700">{item.sent}</p>
                                                <span className='text-slate-700'> {new Date(item.timestamps).toLocaleDateString()}</span>
                                            </div>
                                            {item.text.content ? (
                                                <div className="w-max bg-blue-50 rounded-md px-3 py-2 mt-[4px]">
                                                    <p>{item.text.content}</p>
                                                </div>
                                            ) : null }
                                            {item.file.name ? (
                                                <div className="mt-2 flex items-center">
                                                    <ion-icon name="document-outline"></ion-icon>
                                                    <a
                                                        href={item.file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 underline ml-2">
                                                        {item.file.name}
                                                    </a>
                                                </div> 
                                            ):null}
                                        </div>
                                    </div>
                                    )) 
                                }
                            </div>: <div className='text-italic text-gray-600 italic text-center'>No Notes yet</div>
                        }

                    <div className=' p-2 bg-white rounded-md my-2 border bottom-1 w-full'>
                        <div className='border-b-2 pb-2'>
                            <Textarea 
                                type="text" 
                                placeholder="Add a Note"
                                className="w-full border-none h-[70px] focus:border-blue-200"
                                value={message?.text.content || ""}
                                onChange={(e) =>  setMessage({...message, text:{content: e.target.value}})}
                            />
                        </div>
                        <div className='mt-2'>
                            <div className="w-full max-w-sm items-center gap-1.5 hidden">
                                <Input  ref={fileInputRef} id="resume" type="file" onChange={handleFileChange} accept=".pdf,.docx,.xlsx" />
                            </div>
                            <div className='flex items-center justify-between'>  
                                <div className='flex items-center justify-start ml-2'>
                                    <ion-icon name="document-outline" className=""
                                        style={{fontSize:"20px"}}
                                        onClick={handleButtonClick} disabled={isLoading}>
                                        {isLoading ? "Processing..." : "Upload File"}
                                    </ion-icon>
                                    <div className='border-l-2 mx-1 px-1'>
                                        {
                                            fileInputRef.current?.value && file?.name && file?.name 
                                        }
                                    </div>
                                    <Input className="border-none" placeholder="File name" 
                                    value={message.file.name || ""}
                                        onChange={(e) =>  setMessage({...message, file:{name: e.target.value}})}
                                    />
                                </div>
                                <div className='flex items-center justify-end my-2'>
                                    <Button 
                                        onClick={handleCancelButtonClick}
                                        className="py-2 rounded-md bg-white border text-black hover:bg-red-800 hover:text-white">Cancel</Button>

                                    <Button
                                    onClick={submitMessage} 
                                        className="py-2 rounded-md bg-black text-white ml-3">Send</Button>
                                </div>
                            </div>
                        </div>
                        
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Notes
