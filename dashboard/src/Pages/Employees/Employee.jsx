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
  
function Employee() {

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
      <div className='w-[80vw] h-max min-h-[80vh] py-4 px-3'>
        <h2 className='text-xl font-semibold my-4'>Employee</h2>
        <Outlet />
      </div>
    )
}

export default Employee