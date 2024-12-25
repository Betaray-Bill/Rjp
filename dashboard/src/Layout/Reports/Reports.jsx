import React from 'react'
import { Link } from 'react-router-dom'

function Reports() {
    return (
        <div className=' my-8 p-4 border border-gray-200 rounded-md'>
            <div className='font-semibold text-md flex items-center'>
                <ion-icon name="analytics-outline" style={{fontSize:"23px"}}></ion-icon>
                <span className='ml-1 text-lg'>Reports</span>
            </div>

            <div className='grid grid-cols-3 gap-5 my-5 mt-10'>

                <Link to="reports/deals" className='border border-gray-300 rounded-sm p-3  hover:ease-in-out transition-all hover:drop-shadow-md'>
                    <h3 className='text-black text-lg font-semibold'>Deals</h3>
                    <p className='font-normal text-sm mt-2'>View the performance of your KAM and clients</p>
                </Link>

                <Link to="reports/trainers" className='border border-gray-300 rounded-sm p-3  hover:ease-in-out transition-all hover:drop-shadow-md'>
                    <h3 className='text-black text-lg font-semibold'>Trainers</h3>
                    <p className='font-normal text-sm mt-2'>View the Trainers Performance</p>
                </Link>

                <Link to="reports/key-accounts" className='border border-gray-300 rounded-sm p-3  hover:ease-in-out transition-all hover:drop-shadow-md'>
                    <h3 className='text-black text-lg font-semibold'>Key Accounts Manager</h3>
                    <p className='font-normal text-sm mt-2'>View the performance of your trainers and clients</p>
                </Link>

                <Link to="reports/trainer-sourcer" className='border border-gray-300 rounded-sm p-3  hover:ease-in-out transition-all hover:drop-shadow-md'>
                    <h3 className='text-black text-lg font-semibold'>Trainer Sourcer</h3>
                    <p className='font-normal text-sm mt-2'>View the performance of your trainers sourcer</p>
                </Link>

            </div>
        </div>
    )
}

export default Reports
