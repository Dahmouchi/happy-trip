import { MoveRight } from "lucide-react";
import React from "react";

const Mesure = () => {
  return (
    <div className="p-4">
      <div className="w-full text-center flex items-center justify-center flex-col gap-2 py-8">
        <h1 className="lg:text-4xl text-xl font-bold">Voyage sur mesure</h1>
        <h1 className="lg:w-1/2 text-sm lg:text-lg text-gray-500">
          Que vous soyez en quête d&apos;évasion, d&apos;aventure ou de détente,
          nous concevons des escapades inoubliables, accessibles et pleines de
          charme, au cœur du Maroc authentique
        </h1>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 place-content-center lg:mt-8">
        <div className="place-items-center my-2">
          <img
            src="/mesure.png"
            alt=""
            className="lg:w-2/3 h-auto  place-content-center"
          />
        </div>
        <div className="flex flex-col justify-center lg:w-4/5 w-full space-y-4 text-center lg:text-left mt-6">
          <h1 className="lg:text-5xl text-3xl font-bold">
            Programmez votre voyage En toutes liberté
          </h1>
          <h1 className="text-sm text-gray-400">
            Chez Happy Trip, chaque voyage est unique. Nous vous accompagnons
            pour créer un séjour 100% personnalisé, adapté à vos envies, votre
            budget, et votre rythme. Que vous rêviez d&apos;aventures exotiques, de
            détente en bord de mer, ou de découvertes culturelles, notre équipe
            conçoit votre itinéraire sur mesure, avec vous et pour vous.
          </h1>
            <div className="w-full lg:w-auto flex items-center justify-center lg:justify-start">
              <button className="bg-[#8EBD22] rounded-full shadow-lg px-6 my-4  flex items-center justify-center text-white gap-2 ">
                        <p className='py-4'>Composez votre voyage</p>
                        <MoveRight />
                        </button>
            </div>
           
        </div>
       
      </div>
      <img
            src="/muse.jpg"
            alt=""
            className="w-full h-auto h-auto  place-content-center mt-4"
          />
    </div>
  );
};

export default Mesure;
