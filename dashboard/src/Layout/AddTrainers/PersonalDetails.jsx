import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import { Button } from '@/components/ui/button';
import {trainingModesEnum} from '../../utils/constants.js';
import React, { useState } from 'react'

function PersonalDetails() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
  
    const [openMode, setOpenModel] = useState(false)
    const [modeVal, setModeVal] = useState("")
  
  return (
    <div className=''>
            <h2 className='text-slate-700  text-md py-4 font-medium'>General Details</h2>
            <div className='grid grid-cols-3 gap-5'>
              <div>
                <Label htmlFor="Name">Name</Label>
                <Input type="text" id="name" placeholder="Name" name="name"/>
              </div>

              <div className='flex flex-col'>
                <Label htmlFor="email">Type Of trainer</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value ? value :"Internal"}
                      <ion-icon name="chevron-down-outline"></ion-icon>
                      {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      {/* <CommandInput placeholder="Search Trainer Type..." /> */}
                      <CommandList>
                        <CommandEmpty>No Trainer Type found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                              key="internal"
                              value={value}
                              onSelect={(currentValue) => {
                                setValue("Internal")
                                setOpen(false)
                              }}
                            >
                              Internal
                            </CommandItem>
                            <CommandItem 
                            className="mt-1 bg-white"
                              key="External"
                              value={value}
                              onSelect={(currentValue) => {
                                setValue("External")
                                setOpen(false)
                              }}
                            >
                              External
                            </CommandItem>
                            
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* External Modes */}

              </div>

              {
                value === "External" ? (
                  <div>
                    <Label>Mode of Training</Label>
                    <Popover open={openMode} onOpenChange={setOpenModel}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openMode}
                          className="w-[200px] justify-between"
                        >
                          {modeVal ? modeVal : "PartTime - Offline"}
                          <ion-icon name="chevron-down-outline"></ion-icon>
                          {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                        {/* <ion-icon name="chevron-down-outline"></ion-icon> */}
                          <CommandList>
                            <CommandEmpty>No Trainer Type found.</CommandEmpty>
                            <CommandGroup>
                              {
                                trainingModesEnum.map((e, i) => (
                                  <CommandItem
                                    key={i}
                                    value={value}
                                    onSelect={(currentValue) => {
                                      setModeVal(e)
                                      setOpenModel(false)
                                    }}
                                  >
                                    {e}
                                  </CommandItem>
                                ))
                              }
                                
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                </div>
                ): null
              }


              {/* <div>
                <Label htmlFor="email">Name</Label>
                <Input type="text" id="name" placeholder="Name" name="name"/>
              </div>
              <div>
                <Label htmlFor="email">Name</Label>
                <Input type="text" id="name" placeholder="Name" name="name"/>
              </div> */}
            </div>
    </div>
  )
}

export default PersonalDetails
