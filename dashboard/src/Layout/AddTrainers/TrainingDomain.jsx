import {Input} from '@/components/ui/input'
import React, {useEffect, useState} from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui//button'
import { domains } from '@/utils/constants'

function TrainingDomain() {

    // Domain Search States
    const [open,
        setOpen] = useState(false)
    const [value,
        setValue] = useState("")

    const [list,
        setList] = useState([])

    const handleSearchTerm = (e) => {
        console.log(e)
        if (e) {
            if (list.includes(e)) {
                alert("Already Added")
            } else {
                console.log("1")
                if (list.length == 0) {
                    setList([e])
                } else {
                    setList([
                        ...list,
                        e
                    ])
                }
                console.log("2")

            }
        }

    }
    return (
        <div className='mb-6 grid place-content-center items-center'>
            <h2
                className='text-slate-700 grid place-content-center items-center text-lg py-4 pt-2 font-semibold'>Training Domains</h2>
            <div className='mt-3'>
                <div className='flex flex-col'>
                    {/* <Label htmlFor="trainingDomain" className="mb-3">Training Domain</Label> */}
                    <Popover
                        open={open}
                        onOpenChange={setOpen}
                        className="w-[70vw] justify-start p-2">
                        <PopoverTrigger asChild className='p-6 rounded-full'>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[70vw] justify-between">
                                {!value
                                    ? ((
                                        <span className="flex items-center justify-between">
                                            <ion-icon
                                                name="search-outline"
                                                style={{
                                                fontSize: "18px",
                                                marginRight: "12px"
                                            }}></ion-icon>
                                            Select Domain
                                        </span>
                                    ))
                                    : (
                                        <span className='flex items-center align-middle'>
                                            <h2 className='text-black font-semibold border-r-2 pr-4'>Results :
                                            </h2>
                                            <div className='flex items-center align-middle ml-10 text-slate-700'>
                                                <span>{value}</span>
                                                <ion-icon
                                                    style={{
                                                    fontSize: "18px",
                                                    marginRight: "12px"
                                                }}></ion-icon>
                                            </div>
                                        </span>
                                    )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[70vw] p-0">
                            <Command>
                                <CommandInput placeholder="Search subtopic..."/>
                                <CommandList>
                                    <CommandEmpty>No subtopic found.</CommandEmpty>
                                    {domains[0]
                                        .subtopics
                                        .map((subtopic) => (
                                            <CommandGroup key={subtopic.subtopic} heading={subtopic.subtopic}>
                                                {subtopic
                                                    .points
                                                    .map((point) => (
                                                        <CommandItem
                                                            key={point}
                                                            value={point}
                                                            onSelect={(currentValue) => {
                                                            handleSearchTerm(currentValue)
                                                            setValue(currentValue)
                                                            setOpen(false);
                                                        }}>
                                                            {point}
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        ))}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                                        
                  {
                    list && list.map((item, index) => (
                      <div key={index} className="mb-2">
                          <Label>{index + 1}. {item}</Label>
                      </div>
                    ))
                }
            </div>
        </div>
    )
}

export default TrainingDomain
