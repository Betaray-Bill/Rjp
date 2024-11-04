import {resetDomainResultsAndSearch} from '@/features/searchTrainerSlice'
import React, { Fragment } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

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

    return (
        <div className='mt-8 p-3'>
            {
                    domainResults.length > 0 ?

                    <Fragment>
                        <div className='flex justify-between '>
                        <h1 className='font-medium text-black-600'>Search Results for - {searchDomain}</h1>
                        <p
                            onClick={() => handleReset()}
                            className='bg-blue-100 border  border-blue-700 hover:bg-blue-300 rounded-full py-[4px] px-3 flex items-center cursor-pointer'>
                            <ion-icon name="close-outline"></ion-icon>
                            <span className='ml-1'>Reset</span>
                        </p>
                        </div>
                        <div className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-[25px] place-content-center items-start'>
                             { domainResults &&  domainResults?.map((res, _i) => (
                                    <div key={_i} className='border border-gray-200 rounded-md p-3 h-max w-[30vw]'>
                                        {/* <h2>{res.generalDetails.name}</h2> */}
                                        {/* General Details */}
                                        <div className='flex items-center justify-between my-4'>
                                            <div className='flex items-center'>
                                                <Avatar>
                                                    <AvatarImage src="https://github.com/shadcn.png"/>
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <p className='ml-2 font-medium'>{res.generalDetails?.name}</p>
                                            </div>
                                            <div>
                                                <p className='text-gray-600'>
                                                    ID:
                                                    <span className='text-black font-semibold'>{res.trainerId}</span>
                                                </p>
                                            </div>

                                        </div>
                                        {/* Domain Based Details */}
                                        <div
                                            className='my-5 border p-2 rounded-md border-gray-200'>
                                            <div className='flex items-center justify-between'>
                                                <div>
                                                    <h2 className='text-gray-600'>Training Domain</h2>
                                                    <p>
                                                        <span className='text-black font-semibold '>{res.trainingDomain[0].domain}</span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <h2 className='text-gray-600'>Price</h2>
                                                    <p>
                                                        <span className='text-black font-semibold'>₹{res.trainingDomain[0].price}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='mt-6'>
                                                <h2 className='text-gray-600'>Session Taken</h2>
                                                <p>
                                                    <span className='text-black font-semibold'>{res.trainingDomain[0].paymentSession}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* COntact Details */}
                                        <div className='my-5  border p-2 rounded-md border-gray-200'>
                                            <div>
                                                <h2 className='text-gray-600'>Contact Details</h2>
                                            </div>
                                            <div className='grid grid-cols-2 gap-[20px] mt-2'>
                                                <p className='flex flex-col'>
                                                    <span className='text-gray-600'>phone Number</span>
                                                    <span className='font-semibold'>{res.generalDetails?.phoneNumber}</span>
                                                </p>
                                                <p className='flex flex-col items-start'>
                                                    <span className='text-gray-600'>Whatsapp Number</span>
                                                    <span className='font-semibold'>{res.generalDetails?.phoneNumber}</span>
                                                </p>
                                                <p className='flex flex-col items-start'>
                                                    <span className='text-gray-600'>Email Id</span>
                                                    <span className='font-semibold'>{res.generalDetails?.email}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <span className='text-blue-600 cursor-pointer'>View More...</span>
                                    </div>
                                ))
                            }
                        </div> 
                    </Fragment> : null
        
                
            }
    
        </div>
    )
}

export default SearchResult
