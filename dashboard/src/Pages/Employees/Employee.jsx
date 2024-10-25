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
          <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link to="/home">{path && path[0]?.toUpperCase()}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {
                        path && path.slice(1, path.length-1).map((e, i) => (
                            <Fragment key={i}>
                                <BreadcrumbItem>
                                    {
                                        e === "trainer" ? 
                                        <Link to={`/home/${e}`}>{e.toUpperCase()}</Link> :
                                        (
                                            e !=="view" ?
                                            <p>{e.toUpperCase()}</p>: null
                                        )
                                    }
                                    
                                </BreadcrumbItem>
                                {
                                    i !== path.length-3 && <BreadcrumbSeparator />
                                }
                            </Fragment>
                        ))
                    }
                    {/* <BreadcrumbItem>
                        <BreadcrumbLink href="/home/trainer">Trainer</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                    </BreadcrumbItem> */}
                </BreadcrumbList>
          </Breadcrumb>
        <h2 className='text-xl mt-10  font-semibold my-4'>Employee</h2>
        <Outlet />
      </div>
    )
}

export default Employee