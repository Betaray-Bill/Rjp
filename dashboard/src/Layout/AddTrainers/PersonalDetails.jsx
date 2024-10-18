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
            <h2 className='text-slate-700  text-lg py-4 font-semibold'>General Details</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px] mb-3 mt-3 place-items-center'>
              <div>
                <Label htmlFor="Name">Name</Label>
                <Input type="text" id="name" name="name"/>
              </div>

              <div>
                <Label htmlFor="Email">Email</Label>
                <Input type="email" id="Email"  name="email"/>
              </div>

              <div>
                <Label htmlFor="Phone Number">Phone Number</Label>
                <Input type="number" id="Phone Number" name="phoneNumber"/>
              </div>

              <div>
                <Label htmlFor="Whatsapp Number">
                  <span>Whatsapp Number</span>
                </Label> 
                <Input type="number" id="Whatsapp Number" name="WhatsappNumber"/>
              </div>

              <div>
                <Label htmlFor="Alternate Number">Alternate Number</Label>
                <Input type="number" id="Alternate Number" name="AlternateNumber"/>
              </div>



              {/* 
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
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
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
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
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
              } */}


               {/* Mobile number, email, whatsapp, alternate number */}


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
