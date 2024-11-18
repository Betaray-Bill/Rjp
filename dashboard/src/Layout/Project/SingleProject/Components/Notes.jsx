import React from 'react'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

function Notes() {

    const data = [
        {
            "text": {
                "content": {
                    "message": "Hello, how are you?"
                }
            },
            "file": null,
            "sent": "Alice",
            "timestamps": "2024-11-18T10:00:00Z",
            "photo_url": "https://example.com/photos/alice.jpg"
        }, {
            "text": null,
            "file": {
                "url": "https://example.com/files/document.pdf",
                "name": "document.pdf"
            },
            "sent": "Bob",
            "timestamps": "2024-11-18T10:05:00Z",
            "photo_url": "https://example.com/photos/bob.jpg"
        }, {
            "text": {
                "content": {
                    "message": "Check out this file."
                }
            },
            "file": {
                "url": "https://example.com/files/image.png",
                "name": "image.png"
            },
            "sent": "Charlie",
            "timestamps": "2024-11-18T10:10:00Z",
            "photo_url": "https://example.com/photos/charlie.jpg"
        }, {
            "text": {
                "content": {
                    "message": "Good morning!"
                }
            },
            "file": null,
            "sent": "Dana",
            "timestamps": "2024-11-18T10:15:00Z",
            "photo_url": "https://example.com/photos/dana.jpg"
        }, {
            "text": {
                "content": {
                    "message": "Here is the updated document."
                }
            },
            "file": {
                "url": "https://example.com/files/updated_document.pdf",
                "name": "updated_document.pdf"
            },
            "sent": "Eve",
            "timestamps": "2024-11-18T10:20:00Z",
            "photo_url": "https://example.com/photos/eve.jpg"
        }, {
            "text": null,
            "file": {
                "url": "https://example.com/files/report.xlsx",
                "name": "report.xlsx"
            },
            "sent": "Frank",
            "timestamps": "2024-11-18T10:25:00Z",
            "photo_url": "https://example.com/photos/frank.jpg"
        }, {
            "text": {
                "content": {
                    "message": "Please review this presentation."
                }
            },
            "file": {
                "url": "https://example.com/files/presentation.pptx",
                "name": "presentation.pptx"
            },
            "sent": "Grace",
            "timestamps": "2024-11-18T10:30:00Z",
            "photo_url": "https://example.com/photos/grace.jpg"
        }, {
            "text": {
                "content": {
                    "message": "Looking forward to our meeting."
                }
            },
            "file": null,
            "sent": "Hank",
            "timestamps": "2024-11-18T10:35:00Z",
            "photo_url": "https://example.com/photos/hank.jpg"
        }, {
            "text": null,
            "file": {
                "url": "https://example.com/files/audio.mp3",
                "name": "audio.mp3"
            },
            "sent": "Ivy",
            "timestamps": "2024-11-18T10:40:00Z",
            "photo_url": "https://example.com/photos/ivy.jpg"
        }, {
            "text": {
                "content": {
                    "message": "Let’s finalize the budget."
                }
            },
            "file": {
                "url": "https://example.com/files/budget.xlsx",
                "name": "budget.xlsx"
            },
            "sent": "Jake",
            "timestamps": "2024-11-18T10:45:00Z",
            "photo_url": "https://example.com/photos/jake.jpg"
        }
    ]

    const changeChatOrder = async(e) => {
        console.log(e)
    }

    return (
        <div className='border rounded-md shadow-sm mt-8 py-4 px-4'>
            <div className='flex items-center justify-between pb-2 border-b'>
                <p className='font-semibold text-lg'>Notes</p>
                <Select className="border bg-blue-300" onValueChange={(e) => changeChatOrder(e)}>
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
                <div className='h-[50vh] scroll-m-1 overflow-y-scroll rounded-md shadow-sm border p-3'>
                    {/* Chat */}
                    {data.map((item, index) => (
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
                                    <span className='text-slate-700'>{new Date(item.timestamps).toLocaleTimeString()}</span>
                                </div>
                                {item.text && (
                                    <div className="w-max bg-blue-50 rounded-md px-3 py-2 mt-[4px]">
                                        <p>{item.text.content.message}</p>
                                    </div>
                                )}
                                {item.file && (
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
                                )}
                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </div>
    )
}

export default Notes
