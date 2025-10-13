import React from 'react'
import { PricingTable } from '@clerk/nextjs'

function Pricing() {
  return (
    <div className='flex flex-col items-center justify-center w-full h-screen'>
      <h2 className='font-bold text-3xl my-5'>Pricing</h2>
      <div className='flex w-[800px]'>
        <PricingTable />
      </div>  
    </div>
  )
}

export default Pricing