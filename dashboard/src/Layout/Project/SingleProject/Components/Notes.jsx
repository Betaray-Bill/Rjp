import React, {useEffect, useRef, useState} from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Textarea} from '@/components/ui/textarea'
import {io} from "socket.io-client"
import axios from 'axios'
import {useQuery, useQueryClient} from 'react-query'
import {useSelector} from 'react-redux'
// const socket = io("http://localhost:6000");

function Notes({projectName, projectId}) {
    const [file,
        setFile] = useState(null);
    const [isLoading,
        setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const {currentUser} = useSelector(state => state.auth)

    useEffect(() => {
        // fetchNotes()
    }, [projectId])

    // use const socket = io("ws://localhost:6000");
    const [message,
        setMessage] = useState({
        text: {
            content: ''
        },
        file: {
            url: "",
            name: ""
        },
        sent: currentUser.employee.name,
        timestamps: new Date(),
        photo_url: "https://example.com/photos/alice.jpg"
    })

    const [data,
        setData] = useState([])

    useEffect(() => {
        // fetchNotes()

    }, [projectId])

    const changeChatOrder = async(e) => {
        console.log(e)
    }

    const fetchNotes = async() => {
        const response = await axios.get(`http://localhost:5000/api/project/getChat/${projectId}`); // Replace with your API endpoint
        setData(response.data.notes)

        let final = [];

        for (let i = 0; i < response.data.notes.length; i++) {
            // console.log(notes[i].timestamps)
            let noteDate = new Date(response.data.notes[i].timestamps).toDateString(); // Extract date as a string

            // Check if a group for this date already exists
            let existingGroup = final.find((group) => group.date === noteDate);

            if (existingGroup) {
                existingGroup
                    .chats
                    .push(response.data.notes[i]);
            } else {
                final.push({
                    date: noteDate,
                    chats: [response.data.notes[i]]
                });
            }
        }
        setData(final)
        return response.data;
    };

    const {data: notes} = useQuery([
        'notes', projectId
    ], // Unique key for this query
            fetchNotes, {
        enabled: true,
        staleTime: 1000 * 60 * 5, // data stays fresh for 5 minutes
        cacheTime: 1000 * 60 * 10 // cache data for 10 minutes
    });
    console.log(data)
    // UPloading the Resume and Extracting the Resume
    const fileInputRef = useRef(null);

    // Function to handle file upload
    const handleFileChange = async(event) => {
        const file = event.target.files[0];
        console.log("INSIDE the file: " + file)
        if (file) {
            setFile(file)
            console.log('File uploaded:', file.name);
            setMessage({
                ...message,
                file: {
                    url: URL.createObjectURL(file),
                    // name: file.name
                }
            })
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

    const handleCancelButtonClick = () => {
        setFile(null);
        fileInputRef.current.value = null;
        setMessage({
            text: {
                content: ''
            },
            file: {
                url: "",
                name: ""
            },
            sent: "",
            timestamps: new Date(),
            photo_url: "https://example.com/photos/alice.jpg"
        });
    }

    const submitMessage = async() => {
        console.log(message)
        if (message) {

            try {
                // Check the blob connection
                if (fileInputRef.current.value) {
                    console.log("Checking blob connection...");
                    const result = await axios.get('http://localhost:5000/api/filestorage/check-blob-connection');
                    const response = result.data;
                    console.log("Connection check result:", response);

                    // If the connection is successful and a file is present, call the POST API
                    if (fileInputRef.current.value && result.status == 200) {
                        console.log("File is present. Sending data to another API...");

                        // Call another POST API Create a FormData object to handle file upload
                        const formData = new FormData();
                        formData.append("file", file); // Attach the file
                        formData.append("projectName", projectName); // Attach the file

                        formData.append("fileName", message.file.name || file.name); // Include file name
                        formData.append("sent", currentUser.employee.name); // Additional data (optional)
                        formData.append("timestamps", new Date().toISOString()); // Additional metadata

                        // Call the POST API to upload the file
                        const uploadResult = await axios.post('http://localhost:5000/api/filestorage/upload-to-blob', formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        });

                        if (uploadResult.status == 200) {
                            console.log("File upload response:", uploadResult.data);
                            const url = uploadResult.data.url

                            // Update the message with the uploaded file URL
                            message.file.url = url;
                            message.file.name = message.file.name || file.name; // Update file name if it's not provided in the message object

                            // Post the Chat in the Chat in Backend
                            const sendMessage = await axios.post(`http://localhost:5000/api/project/addChat/${projectId}`, message);
                            const chatResp = await sendMessage.data

                            console.log(chatResp)

                            // Add the message to the data array
                            setData([
                                ...data, {
                                    ...message
                                }
                            ]);
                            console.log("Message added successfully!");
                        }

                    }
                } else {
                    // Post the Chat in the Chat in Backend
                    const sendMessage = await axios.post(`http://localhost:5000/api/project/addChat/${projectId}`, message);
                    const chatResp = await sendMessage.data

                    console.log(chatResp)
                }
                // queryClient.invalidateQueries(['notes', projectId]);
                // fetchNotes()
                setMessage({
                    text: {
                        content: ''
                    },
                    file: {
                        url: "",
                        name: ""
                    },
                    sent: "",
                    timestamps: new Date(),
                    photo_url: "https://example.com/photos/alice.jpg"
                });
            } catch (error) {
                console.error("Error during connection or file upload:", error.message);
            }
            fileInputRef.current.value = null;

            // Emit the message to the socket
            console.log("Message sent successfully!");

        }
        await queryClient.invalidateQueries(['notes', projectId]);

    }

    console.log(notes)

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
                <div className='relative'>
                    {data.length > 0
                        ? <div
                                className='min-h-[100px]     max-h-[80vh] h-max relative scroll-m-1 overflow-y-scroll  rounded-t-md shadow-sm border p-3'>
                                {data && data.map((e, index) => (
                                    <div key={index}>
                                        <div className='text-center my-2'>
                                            <h2 className='font-semibold'>{e.date}</h2>
                                        </div>
                                        {e.chats?.map((item, i) => (
                                                <div key={i} className="flex items-start justify-start mt-[20px]">
                                                    <Avatar>
                                                        <AvatarImage src={item.photo_url || "https://via.placeholder.com/150"}/>
                                                        <AvatarFallback className="text-sm">{item
                                                                .sent
                                                                .charAt(0)
                                                                .toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="ml-2">
                                                        <div className="flex items-center justify-between">
                                                            <p className="font-normal text-sm text-slate-700">{item.sent}</p>
                                                            {/* <span className='text-slate-700 text-sm'> */}
                                                        </div>
                                                        <div className='flex items-end'>
                                                            <div>
                                                                {item.text.content
                                                                    ? (
                                                                        <div className='flex items-end'>
                                                                            <div className="w-max bg-blue-50 font-normal rounded-md px-3 py-2 mt-[4px]">
                                                                                <p className='text-sm'>{item.text.content}</p>
                                                                            </div>
                                                                            {/* <span className='text-slate-700 ml-2'>
                                                                {new Date(item.timestamps).toLocaleDateString()}</span> */}
                                                                        </div>
                                                                    )
                                                                    : null}
                                                                {item.file.name
                                                                    ? (
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
                                                                    )
                                                                    : null}
                                                            </div>
                                                            <span className='text-slate-700 ml-4 text-[14px]'>
                                                                {/* {new Date(item.timestamps).} */}
                                                            </span>
                                                        </div>

                                                    </div>
                                                </div>
                                            ))
}
                                    </div>
                                ))
}
                            </div>
                        : <div className='text-italic text-gray-600 italic text-center'>No Notes yet</div>
}

                    <div
                        className=' p-2 bg-white rounded-md my-2 border border-black bottom-1 w-full'>
                        {/* <div clas>Notes</div> */}
                        <div className='border-b-2 pb-2'>
                            <Textarea
                                type="text"
                                placeholder="Add a Note"
                                className="w-full border-none h-[70px] focus:border-blue-200"
                                value={message
                                ?.text.content || ""}
                                onChange={(e) => setMessage({
                                ...message,
                                text: {
                                    content: e.target.value
                                }
                            })}/>
                        </div>
                        <div className='mt-2'>
                            <div className="w-full max-w-sm items-center gap-1.5 hidden">
                                <Input
                                    ref={fileInputRef}
                                    id="resume"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.docx,.xlsx"/>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center justify-start ml-2 hover:cursor-pointer'>
                                    <ion-icon
                                        name="document-outline"
                                        className="hover:cursor-pointer"
                                        style={{
                                        fontSize: "28px"
                                    }}
                                        onClick={handleButtonClick}
                                        disabled={isLoading}>
                                        {isLoading
                                            ? "Processing..."
                                            : "Upload File"}
                                    </ion-icon>
                                    <div className='border-l-2 mx-1 px-1'>
                                        {fileInputRef.current
                                            ?.value && file
                                                ?.name && file
                                                    ?.name
}
                                    </div>
                                    <Input
                                        className="border-none"
                                        placeholder="File name"
                                        value={message.file.name || ""}
                                        onChange={(e) => setMessage({
                                        ...message,
                                        file: {
                                            name: e.target.value
                                        }
                                    })}/>
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
