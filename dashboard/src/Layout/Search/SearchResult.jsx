import {resetDomainResultsAndSearch} from '@/features/searchTrainerSlice';
import React, {Fragment} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Link} from 'react-router-dom';

function SearchResult() {
    const {domainResults, searchDomain, isSearching} = useSelector(state => state.searchTrainer);
    const dispatch = useDispatch();

    const handleReset = () => {
        dispatch(resetDomainResultsAndSearch());
    };

    // Transform the data to ensure each trainingDomain creates a new row
    const transformedResults = domainResults.flatMap((res) => res.trainingDomain.map((domain) => ({
        ...res,
        trainingDomain: domain // Flattened each domain as a new row
    })));

    // Determine trainer type (Internal or External)
    const getTrainerType = (trainerId) => {
        if (trainerId.startsWith("RJPI")) 
            return "Internal";
        if (trainerId.startsWith("RJPE")) 
            return "External";
        return "Unknown";
    };

    if (isSearching) {
        return (
            <div className='flex items-center justify-center'>
                <img
                    src="https://cdn.dribbble.com/users/1100029/screenshots/6276269/loading-search-animation-2_1-drb.gif"
                    alt="Loading..."/>
            </div>
        );
    }

    console.log(transformedResults);

    return (
        <div className='mt-4 p-3'>
            {transformedResults.length > 0
                ? <Fragment>
                        <div className='mt-6 grid gap-[25px] place-content-center items-start'>
                            {transformedResults.map((res, _i) => (
                                <div
                                    key={_i}
                                    className='border flex items-start justify-between border-gray-200 rounded-md p-3 h-max w-[70vw]'>
                                    {/* General Details */}
                                    <div className='flex items-start flex-col justify-between'>
                                        <div className='flex items-center'>
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png"/>
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <div className='ml-2'>
                                                <p className='font-medium'>{res.generalDetails
                                                        ?.name}</p>
                                                <div className='flex items-center'>
                                                    <span className='flex items-center ml-2'>
                                                        <span>{res
                                                                ?.Rating
                                                                    ?.star}</span>
                                                        <ion-icon
                                                            name="star-outline"
                                                            style={{
                                                            color: "gold"
                                                        }}></ion-icon>
                                                    </span>
                                                    <span
                                                        className={`ml-2 px-2 py-1 text-xs rounded ${getTrainerType(res.trainerId) === "Internal"
                                                        ? "bg-green-200 text-green-700"
                                                        : "bg-blue-200 text-blue-700"}`}>
                                                        {getTrainerType(res.trainerId)} { " "}
                                                        Trainer
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='text-gray-600 mt-2'>
                                                ID:
                                                <span className='text-black font-semibold'>{res.trainerId}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Domain Based Details */}
                                    <div className='flex flex-col justify-start'>
                                        <div className='flex items-center justify-between'>
                                            <div className='items-center'>
                                                <h2 className='text-gray-600'>Training Domain</h2>
                                                <p>
                                                    <span className='text-black font-medium'>{res.trainingDomain.domain}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        {res.trainingDomain
                                            ?.paymentSession && <p className='flex items-center'>
                                                <ion-icon
                                                    style={{
                                                    fontSize: "20px",
                                                    color: "gray",
                                                    marginRight: "5px"
                                                }}
                                                    name="calendar-outline"></ion-icon>
                                                <span className='font-medium'>{res.trainingDomain
                                                        ?.paymentSession}</span>
                                            </p>
}
                                        <div className='ml-4'>
                                            <h2 className='text-gray-600'>Price</h2>
                                            <p>
                                                <span className='text-black font-medium'>₹{res.trainingDomain
                                                        ?.price}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact Details */}
                                    <div className='border-gray-200'>
                                        <div className='flex flex-col items-start gap-[20px]'>
                                            <p className='flex items-center'>
                                                <ion-icon
                                                    style={{
                                                    fontSize: "20px",
                                                    color: "gray",
                                                    marginRight: "5px"
                                                }}
                                                    name="call-outline"></ion-icon>
                                                <span className='font-medium'>{res.generalDetails
                                                        ?.phoneNumber}</span>
                                            </p>
                                            <p className='flex items-center'>
                                                <ion-icon
                                                    style={{
                                                    fontSize: "20px",
                                                    color: "gray",
                                                    marginRight: "5px"
                                                }}
                                                    name="mail-outline"></ion-icon>
                                                <span className='font-medium'>{res.generalDetails
                                                        ?.email}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/home/trainer/view/${res._id}`}
                                        target='_blank'
                                        className='text-blue-600 cursor-pointer px-3 py-2 border border-blue-400'>View</Link>
                                </div>
                            ))}
                        </div>
                    </Fragment>
                : "null"
}
        </div>
    );
}

export default SearchResult;
