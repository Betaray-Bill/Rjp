import React, {Fragment, useEffect, useState} from 'react'
import {Outlet, useLocation} from 'react-router-dom'
import ResumeForm from '@/Layout/Resume/ResumeForm'
import ResumeNav from '@/Layout/Resume/ResumeNav'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import {useDispatch, useSelector} from 'react-redux'
import ResumeNew from '@/Layout/Resume/ResumeNew'

function Resume() {
    const location = useLocation()
    const dispatch = useDispatch()
    const {currentResumeName} = useSelector(state => state.resume)
    const [path,
        setPath] = useState('')
    const {user} = useSelector(state => state.auth)

    // useEffect(() => {     const path =
    // location.pathname.split('/')[location.pathname.split('/').length - 1]
    // console.log(path)     setPath(path)     console.log(currentResumeName) },
    // [location.pathname])

    return (
        <div className='grid place-content-center my-10  '>
            {/* <div className='mb-3 text-sm w-[80vw] lg:w-[80vw] '>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/home/Dashboard">
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/home/resume">
                                Resume
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {path !== ''
                            ? (
                                <Fragment>
                                    {path === 'new'
                                        ? <Fragment>
                                                <BreadcrumbSeparator/>
                                                <BreadcrumbItem>
                                                    <BreadcrumbPage>
                                                        {currentResumeName === ""
                                                            ? "new"
                                                            : currentResumeName}
                                                    </BreadcrumbPage>
                                                </BreadcrumbItem>
                                            </Fragment>
                                        : (location.pathname.split('/')[
                                            location
                                                .pathname
                                                .split('/')
                                                .length - 2
                                        ] === 'copy'
                                            ? (
                                                <Fragment>
                                                    <BreadcrumbSeparator/>
                                                    <BreadcrumbItem>
                                                        <BreadcrumbPage>
                                                            <span className='text-gray-500 text-sm'>
                                                                Copy of
                                                            </span>
                                                            {currentResumeName && currentResumeName}</BreadcrumbPage>
                                                    </BreadcrumbItem>
                                                </Fragment>
                                            )
                                            : location.pathname.split('/').includes("preview")
                                                ? <Fragment>
                                                        <BreadcrumbSeparator/>
                                                        <BreadcrumbItem>
                                                            <BreadcrumbPage className="flex items-center">
                                                                <span className='text-gray-500 text-sm flex items-center justify-between'>
                                                                    Preview
                                                                    <BreadcrumbSeparator/>
                                                                </span>
                                                                {currentResumeName && currentResumeName}</BreadcrumbPage>
                                                        </BreadcrumbItem>
                                                    </Fragment>
                                                : null)
}</Fragment>
                            )
                            : null
}
                    </BreadcrumbList>
                </Breadcrumb>
            </div> */}

            {/* Resume Nav */}
            {user.resumeVersion.length > 0 && <ResumeNav/>
}

            {
            user.resumeVersion.length == 0 ?
            <div className='mt-10 m-1 p-2  bg-white grid place-content-center rounded-md border border-generalBorderColor'>
                <ResumeForm type="main"/>
            </div>
            :
            <div className = 'mt-10 m-1 p-2 w-[90vw] md:w-[80vw] min-h-[100vh] bg-white grid place-content-center rounded-md border border-generalBorderColor'>
                <Outlet />
            </div>
        }

        </div>
    )
}

export default Resume