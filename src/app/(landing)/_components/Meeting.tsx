import { Earth, MoveRight } from 'lucide-react'
import React from 'react'

const Meeting = () => {
  return (
    <div>
        <div className="w-full bg-[#8EBD22] bg-center gap-4 md:gap-6 bg-cover p-4 sm:p-6 md:p-12 lg:p-24 grid lg:grid-cols-4 grid-cols-1" style={{ backgroundImage: "url(/elements.png)" }}>
      {/* Product image card */}
      <div className="rounded-xl bg-amber-300 h-[40vh] sm:h-[50vh] lg:h-[60vh] w-full bg-cover bg-center" style={{ backgroundImage: "url(/images/product4.jpg)" }}>
      </div>

      {/* Content section */}
      <div className="lg:col-span-3 space-y-4 md:space-y-6">
        {/* Meeting card */}
        <div className="bg-white rounded-xl space-y-3 md:space-y-4 p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden">
          <img src="/images/meeting.png" alt="" className="h-full absolute right-0 w-auto top-0 hidden md:block" />

          <div className="bg-[#8EBD22] w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-xl">
            <Earth className="text-white w-6 h-6 md:w-8 md:h-8" />
          </div>

          <h1 className="text-lg md:text-xl font-bold">Programmez votre meeting en ligne</h1>

          <h1 className="text-base md:text-lg font-light w-full md:w-3/4 lg:w-1/2 text-gray-500">
            Prenez rendez-vous en ligne pour un entretien personnalisé en visioconférence, à l&apos;heure qui vous
            convient.
          </h1>

          <div>
            <button className="border rounded-full px-4 md:px-6 py-2 md:py-[4px] flex items-center justify-center gap-2">
              <p className="py-2 md:py-4">Prendre un RDV</p>
              <MoveRight />
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="py-8 px-4 sm:py-10 sm:px-6 md:py-12 md:px-6 lg:py-16 lg:px-8 bg-white rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="font-montressat flex items-center justify-center flex-col">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#8EBD22]">10K+</div>
            <div className="text-base sm:text-lg lg:text-xl text-[#8EBD22] mt-2 md:mt-4">Voyageurs</div>
          </div>

          <div className="flex items-center justify-center flex-col">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#8EBD22]">20</div>
            <div className="text-base sm:text-lg lg:text-xl text-[#8EBD22] mt-2 md:mt-4">Programme</div>
          </div>

          <div className="flex items-center justify-center flex-col">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#8EBD22]">5K+</div>
            <div className="text-base sm:text-lg lg:text-xl text-[#8EBD22] mt-2 md:mt-4">Reviews</div>
          </div>

          <div className="flex items-center justify-center flex-col">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#8EBD22]">100+</div>
            <div className="text-base sm:text-lg lg:text-xl text-[#8EBD22] mt-2 md:mt-4">Excursions &gt;&gt;</div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Meeting