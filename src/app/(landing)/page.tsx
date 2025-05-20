/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import Hero from './_components/Hero'
import { Navbar } from './_components/Header'
import National from './_components/National'
import International from './_components/International'
import Mesure from './_components/Mesure'
import ReviewsSection from './_components/Reviews'
import Meeting from './_components/Meeting'
import Expert from './_components/Expert'
import Trust from './_components/Trust'
import Footer from './_components/Footer'
import prisma from '@/lib/prisma'

const LandigPage = async () => {
    const landing = await prisma.landing.findFirst()

  return (
    <div >
        {landing?.navbar  && <div className='lg:px-6 w-full px-3'>
            <div className='bg-[#8EBD22] lg:rounded-b-2xl rounded-b-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex items-center justify-center py-4'>
            <h1 className='text-white text-xs lg:text-lg text-center'>Nos packs SUMMER 2025 sont disponibles Dés Maintenant!</h1>
            </div>
        </div>}
      <Navbar />
      {landing?.hero && <Hero inp={landing.search}/>}
      {landing?.national && <National />}
      {landing?.international && <International />}
      {landing?.mesure && <Mesure />}
      {landing?.reviews && <ReviewsSection />}
      {landing?.meeting && <Meeting />}
      {landing?.expert && <Expert />}
      {landing?.trust && <Trust />}
      {landing?.footer && <Footer />}
        </div>
  )
}

export default LandigPage