import { Earth, MoveRight } from 'lucide-react'
import React from 'react'

const Meeting = () => {
  return (
    <div>
        <div className='w-full bg-[#8EBD22] bg-center gap-6 bg-cover p-16 grid lg:grid-cols-4 grid-cols-1' style={{backgroundImage:"url(/elements.png)"}}>
          <div className="rounded-xl bg-amber-300 h-[70vh] w-full bg-cover bg-center" style={{backgroundImage:"url(/images/product4.jpg)"}}>
          </div>
          <div className='lg:col-span-3 space-y-4'>
            <div className='bg-white rounded-xl space-y-4 p-6 relative'>
                <img src="/images/meeting.png" alt="" className='h-full absolute right-0 w-auto top-0' />
                <div className='bg-[#8EBD22] w-16 h-16 rounded-full flex items-center justify-center shadow-xl'>
                    <Earth className='text-white w-8 h-8'/>
                </div>
                <h1 className='text-xl font-bold'>Programmez votre meeting en ligne</h1>
                <h1 className='text-lg font-light w-1/2'>Prenez rendez-vous en ligne pour un entretien personnalisé en visioconférence, à l&apos;heure qui vous convient.</h1>
                <div>
            <button className="bg-[#8EBD22] rounded-full shadow-lg px-6  flex items-center justify-center text-white gap-2 ">
            <p className='py-4'>Composez votre voyage</p>
            <MoveRight />
            </button>
        </div>
            </div>
            <div className='p-2 bg-white rounded-xl'></div>
          </div>
        </div>
    </div>
  )
}

export default Meeting