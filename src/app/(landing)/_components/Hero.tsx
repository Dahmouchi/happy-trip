import React from 'react'
import { SearchInput } from './Search'

const Hero = () => {
  return (
    <div className='lg:p-6 p-2'>
        <div className=' w-full lg:h-[70vh] h-[40vh] bg-[#8EBD22] rounded-xl shadow-xl/20 bg-cover bg-center relative flex items-center justify-center' style={{backgroundImage:"url('/hero.webp')"}} >
        <div className='text-white text-center z-10 space-y-4 flex flex-col items-center justify-center h-full'>
          <h1 className='lg:text-5xl text-2xl font-medium tracking-widest'>L&apos;AVENTURE</h1>
          <h1 className='lg:text-7xl text-5xl font-black'>COMMENCE ICI</h1>
          <h1 className='lg:text-lg tracking-wide font-semibold'>Découvrez nos programmes HAPPY TRIP</h1>
          <SearchInput/>
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