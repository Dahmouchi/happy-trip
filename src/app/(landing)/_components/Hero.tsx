/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { SearchInput } from './Search'

const Hero = (inp:any) => {
  return (
    <div className='lg:p-6 p-2'>
        <div className=' w-full lg:h-[70vh] h-[40vh] bg-[#8EBD22] rounded-xl shadow-xl/20 bg-cover bg-center relative flex items-center justify-center' style={{backgroundImage:`url("${inp?.inp?.imageHero}")`}} >
        <div className='text-white text-center z-10 space-y-4 flex flex-col items-center justify-center h-full'>
          <h1 className='lg:text-5xl text-2xl font-medium tracking-widest'>{inp?.inp?.titleHero}</h1>
          <h1 className='lg:text-7xl text-5xl font-bold'>{inp?.inp?.subTitleHero}</h1>
          <h1 className='lg:text-lg tracking-wide font-semibold'>{inp?.inp?.subTitleHero1}</h1>
          {inp?.inp?.search === true && <div className='flex items-center justify-center lg:px-0 w-full p-4'>
            <SearchInput/>
          </div>}
        </div>
        <div className='w-full h-full rounded-xl bg-black/20 absolute top-0 z-0'></div>
        {/* <a href="#next-section" className='absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 w-22 h-22 bg-gradient-to-r from-[#A8D653] to-[#94C93A] rounded-full border-[#A8D653] flex items-center justify-center shadow-xl/20'>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#ffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a> */}
        </div>
    </div>
  )
}

export default Hero