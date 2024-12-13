import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'

function Remainder({stages}) {
    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <Button className="rounded-none bg-red-500 flex items-center">
                        <span>Remainder</span>
                        <ion-icon name="chevron-down-outline"></ion-icon>
                    </Button>
                </DialogTrigger>
                <DialogContent className="mr-10 border border-gray-300 drop-shadow-md">
                    <DialogHeader>
                        <DialogTitle>
                            <h2 className='font-semibold text-md'>Remainder - {stages}</h2>
                        </DialogTitle>
                        {/* <DialogDescription> */}
                        {/* Remainder Section */}

                        {/* Select Date to end tis Remainder */}

                        {/* Remarks */}

                        {/* is Done or Not */}

                        {/* Submit/Save */}

                        <div>
                            <div className='mt-4 w-max'>
                                <div className='flex'>
                                    <Label className="flex items-center">
                                        <ion-icon
                                            name="calendar-outline"
                                            style={{
                                            fontSize: "20px"
                                        }}></ion-icon>
                                        <span className='mx-2 text-md'>End Date</span>
                                    </Label>
                                    <input type="date" className='text-md ml-3 border px-4 py-1 rounded-md w-max'/>
                                </div>

                                <div>

                                    <div className='mt-4 w-max'>
                                        <Label className="flex items-center">
                                            <ion-icon
                                                name="chatbubbles-outline"
                                                style={{
                                                fontSize: "20px"
                                            }}></ion-icon>
                                            <span className='mx-2 text-md'>Remarks</span>
                                        </Label>
                                        <Textarea
                                            className='text-md my-3 w-[30vw] h-20 border border-gray-600 px-4 py-1 rounded-md'></Textarea>
                                    </div>
                                </div>
                                <div>
                                    <Button>Save</Button>
                                </div>
                            </div>
                        </div>
                        {/* </DialogDescription> */}
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default Remainder
