/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react'
import Hero from './_components/Hero'
import { Navbar } from './_components/Header'
import National from './_components/National'
import International from './_components/International'
import Mesure from './_components/Mesure'
import ReviewsSection from './_components/Reviews'
import Meeting from './_components/Meeting'

const LandigPage = () => {
  const [hide,setHide] = useState(true)
  return (
    <div >
        <div className='lg:px-20 w-full px-3'>
            <div className='bg-[#8EBD22] lg:rounded-b-2xl rounded-b-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex items-center justify-center py-4'>
            <h1 className='text-white text-xs lg:text-lg text-center'>Nos packs SUMMER 2025 sont disponibles Dés Maintenant!</h1>
            </div>
        </div>
        <Navbar />
        {hide && <Hero />}
        <National />
        <International />
        <Mesure />
        <ReviewsSection />
        <Meeting />
    </div>
  )
}

export default LandigPage