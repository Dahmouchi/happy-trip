import React from 'react'
import { SearchInput } from './Search'

const Hero = () => {
  return (
    <div className='lg:p-6 p-2'>
        <div className=' w-full lg:h-[70vh] h-[40vh] bg-[#8EBD22] rounded-xl bg-cover bg-center relative flex items-center justify-center' style={{backgroundImage:"url('/hero.webp')"}} >
        <div className='text-white text-center z-10 space-y-4'>
            <h1 className='lg:text-5xl text-2xl font-medium tracking-widest'>L&apos;AVENTURE</h1>
            <h1 className='lg:text-7xl text-5xl font-black'>COMMENCE ICI</h1>
            <h1 className='lg:text-lg tracking-wide font-semibold'>Découvrez nos programmes HAPPY TRIP</h1>
            <SearchInput />
        </div>
        <div className='w-full h-full rounded-xl bg-black/20 absolute top-0 z-0'></div>
        </div>
    </div>
  )
}

export default Hero