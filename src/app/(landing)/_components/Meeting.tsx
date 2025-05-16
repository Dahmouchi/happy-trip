import { Earth, MoveRight } from 'lucide-react'
import React from 'react'

const Meeting = () => {
  return (
    <div>
        <div className='w-full bg-[#8EBD22] bg-center gap-6 bg-cover p-24 grid lg:grid-cols-4 grid-cols-1 ' style={{backgroundImage:"url(/elements.png)"}}>
          <div className="rounded-xl bg-amber-300 h-[60vh] w-[full] bg-cover bg-center" style={{backgroundImage:"url(/images/product4.jpg)"}}></div>
          <div className='lg:col-span-3 space-y-6 '>
            <div className='bg-white rounded-xl space-y-4 p-16 relative'>
                <img src="/images/meeting.png" alt="" className='h-full absolute right-0 w-auto top-0' />
                <div className='bg-[#8EBD22] w-16 h-16 rounded-full flex items-center justify-center shadow-xl'>
                    <Earth className='text-white w-8 h-8'/>
                </div>
                <h1 className='text-xl font-bold'>Programmez votre meeting en ligne</h1>
                <h1 className='text-lg font-light w-1/2 text-gray-500'>Prenez rendez-vous en ligne pour un entretien personnalisé en visioconférence, à l&apos;heure qui vous convient.</h1>
                <div>
            <button className=" border rounded-full px-6 py-[4px]  flex items-center justify-center  gap-2 ">
            <p className='py-4'>Prendre un RDV</p>
            <MoveRight />
            </button>
        </div>
            </div>
            <div className='py-16 px-8  bg-white rounded-xl grid lg:grid-cols-4 grid-cols-2 gap-4'>
              <div className='font-montressat flex items-center justify-center flex-col'>
                <div className="text-6xl font-bold text-[#8EBD22]">10K+</div>
                <div className="text-xl text-[#8EBD22] mt-4">Voyageurs</div>
              </div>
              <div className='flex items-center justify-center flex-col'>
                <div className="text-6xl font-bold text-[#8EBD22]">20</div>
                <div className="text-xl text-[#8EBD22] mt-4">Programme</div>
              </div>
              <div  className='flex items-center justify-center flex-col'>
                <div className="text-6xl font-bold text-[#8EBD22]">5K+</div>
                <div className="text-xl text-[#8EBD22] mt-4">Reviews</div>
              </div>
              <div className='flex items-center justify-center flex-col'>
                <div className="text-6xl font-bold text-[#8EBD22]">100+</div>
                <div className="text-xl text-[#8EBD22] mt-4">Excursions &gt;&gt;</div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Meeting