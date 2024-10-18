import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui//button'

import { domains, trainingModesEnum, trainingTypes } from '@/utils/constants'
  

function TrainingDetails() {
    const [type, setType ] = useState("Internal")
    const [mode, setMode ] = useState("Internal")

    // Domain Search States
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    
    const frameworks = [
        {
        value: "next.js",
        label: "Next.js",
        },
        {
        value: "sveltekit",
        label: "SvelteKit",
        },
        {
        value: "nuxt.js",
        label: "Nuxt.js",
        },
        {
        value: "remix",
        label: "Remix",
        },
        {
        value: "astro",
        label: "Astro",
        },
    ]

  return (
    <div className='ml-5'>

      <h2 className='text-slate-700  text-lg py-4 font-semibold'>Training Details</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-3 mt-3 '>
        {/* Training courses, institution, duration, mode of training */}
        <div className='flex flex-col'>
            <Label htmlFor="trainerType" className="mb-2">Type of Trainer</Label>
            <select name="trainerType" id="" onChange={(e) => setType(e.target.value)}>
                <option value="Select the Type" disabled={true}>Select the Type</option>
                {
                    trainingTypes.map((mode, index) => (
                        <option key={index} value={mode}>{mode}</option>
                    ))
                }
            </select>
        </div>

        {
            type && type.split(" ")[0] === "External" ? (
                <div className='flex flex-col'>
                    <Label htmlFor="trainingMode" className="mb-2">Mode of Training</Label>
                    <select name="trainingMode" id="">
                        <option value="Select the Type" defaultValue={true}>Select the Mode</option>
                        {
                            trainingModesEnum.map((mode, index) => (
                                <option key={index} value={mode}>{mode}</option>
                            ))
                        }
                    </select>
                </div> 
            ): <div></div>
        }

        <div></div>

      </div>
      
        {/* Training Domain */}
      <div className='my-5'>
          <h2 className='text-slate-700  text-lg py-4 font-semibold'>Training Domains</h2>
          <div className='mt-3'>
            <div className='flex flex-col'>
                <Label htmlFor="trainingDomain" className="mb-3">Training Domain</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[50vw] justify-between"
                        >
                        {!value ? (
                            (
                                <span className="flex items-center justify-between">
                                    <ion-icon name="search-outline" style={{ fontSize: "18px", marginRight: "12px" }}></ion-icon>
                                    Select Domain
                                </span>
                            )
                        ) : (
                            <span>{value}</span>
                        )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[50vw] p-0">
                        <Command>
                            <CommandInput placeholder="Search subtopic..." />
                            <CommandList>
                                <CommandEmpty>No subtopic found.</CommandEmpty>
                                {domains[0].subtopics.map((subtopic) => (
                                <CommandGroup key={subtopic.subtopic} heading={subtopic.subtopic}>
                                    {subtopic.points.map((point) => (
                                        <CommandItem
                                            key={point}
                                            value={point}
                                            onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue);
                                            setOpen(false);
                                            }}
                                        >
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
        </div>
      </div>
    </div>
  )
}

export default TrainingDetails
