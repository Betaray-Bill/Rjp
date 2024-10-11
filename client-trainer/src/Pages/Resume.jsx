import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'

function Resume() {
    const [position, setPosition] = useState("bottom")
  return (
    <div className='w-full h-screen p-4'>
        <div className='flex items-center justify-between'>
            {/* Dropdown for Resume's, Download, copy, Upload */}
            <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{position}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Resume's List</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                    <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            </div>
        </div>
    </div>
  )
}

export default Resume
