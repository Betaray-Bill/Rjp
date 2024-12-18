import {resetDomainResultsAndSearch} from '@/features/searchTrainerSlice'
import React, { Fragment } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import { Link } from 'react-router-dom'

function SearchResult() {
    const {domainResults, searchDomain, isSearching} = useSelector(state => state.searchTrainer)
    const dispatch = useDispatch()

    const handleReset = () => {
        dispatch(resetDomainResultsAndSearch())
    }

    if(isSearching){
        return (
            <div className='flex items-center justify-center'>
                <img
                    src="https://cdn.dribbble.com/users/1100029/screenshots/6276269/loading-search-animation-2_1-drb.gif"
                    alt=""/>
            </div>
        )
    }

    console.log(domainResults)

    return (
        <div className='mt-4 p-3'>
            {
                    domainResults.length > 0 ?

                    <Fragment>
                        <div className='mt-6 grid gap-[25px] place-content-center items-start'>
                        { domainResults.length > 0 &&  domainResults?.map((res, _i) => (
                                    <div key={_i} className='border flex  items-start justify-between border-gray-200 rounded-md p-3 h-max w-[70vw]'>
                                        {/* <h2>{res.generalDetails.name}</h2> */}
                                        {/* General Details */}
                                        <div className='flex items-start flex-col justify-between'>
                                            <div className='flex items-center'>
                                                <Avatar>
                                                    <AvatarImage src="https://github.com/shadcn.png"/>
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <p className='ml-2 font-medium'>{res.generalDetails?.name} - <span className='flex items-center ml-2'><span>{res?.Rating?.star}</span><ion-icon name="star-outline" style={{color:"gold"}}></ion-icon></span></p>
                                            </div>
                                            <div>
                                                <p className='text-gray-600 mt-2'>
                                                    ID:
                                                    <span className='text-black font-semibold'>{res.trainerId}</span>
                                                </p>
                                            </div>

                                        </div>
                                        {/* Domain Based Details */}
                                        <div
                                            className='flex flex-col justify-start'>
                                            <div className='flex items-center justify-between'>
                                                <div className=' items-center'>
                                                    <h2 className='text-gray-600'>Training Domain</h2>
                                                    <p>
                                                        <span className='text-black font-medium'> {res.trainingDomain?.length > 0 ?  res.trainingDomain[0].domain : res.trainingDomain.domain}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-between '>
                                                {
                                                    
                                                    res.trainingDomain[0]?.paymentSession &&
                                                    <p className='flex items-center'>
                                                        <ion-icon style={{fontSize:"20px", color:"gray", marginRight:"5px"}}  name="calendar-outline"></ion-icon>
                                                        <span className='font-medium'>{res.trainingDomain[0]?.paymentSession}</span>
                                                    </p>
                                                }
                                                <div className='ml-4'>
                                                    <h2 className='text-gray-600'>Price</h2>
                                                    <p>
                                                        <span className='text-black font-medium'>₹{res.trainingDomain[0]?.price}</span>
                                                    </p>
                                                </div>
                                            </div>


                                        {/* COntact Details */}
                                        <div className=' border-gray-200'>
                                            <div className='flex flex-col items-start gap-[20px]'>
                                                <p className='flex items-center'>
                                                    <ion-icon style={{fontSize:"20px", color:"gray", marginRight:"5px"}}  name="call-outline"></ion-icon>
                                                    <span className='font-medium'>{res.generalDetails?.phoneNumber}</span>
                                                </p>
                                                <p className='flex  items-center'>
                                                    <ion-icon style={{fontSize:"20px", color:"gray", marginRight:"5px"}}  name="mail-outline"></ion-icon>
                                                    <span className='font-medium'>{res.generalDetails?.email}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <Link to={`/home/trainer/view/${res._id}`} target='_blank'  className='text-blue-600 cursor-pointer px-3 py-2 border border-blue-400'>View</Link>
                                    </div>
                                ))
                            }
                        </div> 
                    </Fragment> : "null"
            // JSON.stringify(domainResults).split("_id").map((e) => {
            //     // console.log(e)
            //     return <p key={e}>{e}</p>
            // })
                
            }
    
        </div>
    )
}

export default SearchResult
