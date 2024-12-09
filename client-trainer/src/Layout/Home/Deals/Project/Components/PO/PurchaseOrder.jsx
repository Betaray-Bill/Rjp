import React  from 'react'
import IndividualPO from './IndividualPO'

function PurchaseOrder({purchaseOrder}) {


    return (
        <div className='grid place-content-center'>
            <div className='w-[90vw] lg:w-[80vw]  mt-8 p-6 bg-white rounded-md shadow-sm'>
                {/* Accepted PO */}
                <div className='font-semibold text-md'>
                    <div className='flex items-center'>
                        <ion-icon
                            name="file-tray-stacked-outline"
                            style={{
                            fontSize: "20px",
                            color: "#3e4093"
                        }}></ion-icon>
                        <span className='ml-3'>Purchase Order</span>
                    </div>
                

                    <div className='mt-6'>
                        {
                            purchaseOrder && purchaseOrder?.map((e, _i) => (
                                <IndividualPO purchaseOrder={e} index={_i} />
                            ))
                        }
                    </div>


                </div>



            </div>
        </div>
    )
}

export default PurchaseOrder
