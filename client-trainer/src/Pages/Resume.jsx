import React, { Fragment, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import ResumeForm from '@/Layout/Resume/ResumeForm'
import ResumeNav from '@/Layout/Resume/ResumeNav'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useDispatch, useSelector } from 'react-redux'

function Resume() {
    const location  = useLocation()
    const dispatch = useDispatch()
    const {currentResumeName} = useSelector(state => state.resume)
    const [path , setPath] = useState('')

    useEffect(() => {
        const path = location.pathname.split('/')[location.pathname.split('/').length - 1]
        console.log(path)
        setPath(path)
        console.log(currentResumeName)
    }, [location.pathname])

  return (
    <div className='main-container'>
        {
            // resumeState && 
        }
        <div className='mb-3 text-sm'>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home/Dashboard">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/home/resume">Resume</BreadcrumbLink>
                    </BreadcrumbItem>
                    {
                       path !== '' ? 
                       (
                        <Fragment>
                            {
                                path === 'new' ?
                                <Fragment>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{currentResumeName === "" ? "new" : currentResumeName}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </Fragment> : 
                                (
                                    location.pathname.split('/')[location.pathname.split('/').length - 2] === 'copy' ? 
                                    (
                                        <Fragment>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage><span className='text-gray-500 text-sm'>Copy of</span> {currentResumeName && currentResumeName}</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </Fragment>
                                    ) : null
                                )
                            }
                        </Fragment>
                       ) : null
                    }
                </BreadcrumbList>
            </Breadcrumb>
        </div>

        {/* Resume Nav */}
        <ResumeNav />
        
        {
            currentResumeName === 'Main Resume' ? 
            <div className='mt-10 m-1 p-2 bg-white rounded-md'>
                <ResumeForm type="main"/>
            </div> 
            : 
            <div>
                <Outlet />
            </div>
        }
    
    </div>
  )
}

export default Resume
