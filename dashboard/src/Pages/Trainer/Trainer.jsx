import React, { Fragment, useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

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
        <div className=''>
            <Outlet />
        </div>
                        
    </div>
  )
}

export default Trainer
