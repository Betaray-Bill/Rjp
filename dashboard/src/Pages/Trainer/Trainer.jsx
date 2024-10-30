import React, { Fragment, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
  

function Trainer() {

    const location = useLocation()
    const [path, setPath] = useState([])
    useEffect(() => {
        console.log(location.pathname)
        let a = location.pathname.split('/')
        console.log(a)
        setPath([])
        // setPath(a)
        a.forEach((e) => {
            if(e!=="")
            setPath(prev => [...prev, e])
        })

    }, [location.pathname, location.search])

  return (
    <div className=''>
        <div className='mt-10'>
            <h2 className='text-xl mt-10 font-semibold my-4'>Trainer</h2>
        </div>
        <div className=''>
            <Outlet />
        </div>
                        
    </div>
  )
}

export default Trainer
