/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createNewsLetter } from "@/actions/saveLandingConfig";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { toast } from "react-toastify";

const Footer = () => {
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const form = e.target;
    const data = {
      prenom: form.prenom.value,
      nom: form.nom.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const res = await createNewsLetter(data.nom,data.prenom,data.email,data.message);
      if(res){
        toast.success("votre message a été envoyer")
      }
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi du message.");
    }
  };
  return (
    <footer className="">
      <div>
        <div>
          <div className="w-full flex justify-center ">
            <img
              src="/footer/happy-trip.png"
              alt="happy-trip logo"
              className="lg:max-w-3xl  md:max-w-2xl max-w-[30vh]"
            />
          </div>
          <div className="relative flex flex-col items-center p-2 lg:p-4">
            <img
              src="/footer/mountain.png"
              alt="mountain"
              className="max-w-screen absolute bottom-0 z-0"
            />
            <div className="relative z-50 lg:w-[50%] w-full self-center rounded-2xl grid  bg-[#D2E094] shadow-xl">
              <div className="flex flex-col items-left rounded-l-2xl lg:py-8 md:py-16 py-4 lg:pl-12 md:p-16 p-4">
                <div className="lg:text-5xl md:text-5xl text-2xl font-thin mb-2">
                  Newsletter
                </div>
                <p className="lg:text-[18px] md:text-[18px] text-[12px] font-medium my-1">
                  Besoin de conseil ? un projet de voyage, une question ?
                </p>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-3 lg:mt-3 lg:mr-60 w-full"
                >
                  <div className="flex items-center lg:flex-row flex-col w-full gap-4">
                    <input
                      type="text"
                      name="prenom"
                      placeholder="Prénom"
                      required
                      className="rounded w-full bg-white p-2 text-black placeholder:text-gray-400 focus:border-lime-900 focus:outline-none focus:ring-2 focus:ring-lime-900"
                    />
                    <input
                      type="text"
                      name="nom"
                      placeholder="Nom"
                      required
                      className="rounded w-full bg-white p-2 text-black placeholder:text-gray-400 focus:border-lime-900 focus:outline-none focus:ring-2 focus:ring-lime-900"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="rounded bg-white p-2 text-black placeholder:text-gray-400 focus:border-lime-900 focus:outline-none focus:ring-2 focus:ring-lime-900"
                  />
                  <textarea
                    name="message"
                    placeholder="Votre message"
                    required
                    className="rounded bg-white p-2 text-black placeholder:text-gray-400 focus:border-lime-900 focus:outline-none focus:ring-2 focus:ring-lime-900"
                    rows={4}
                  />
                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-lime-950 text-white text-sm lg:text-lg p-2 rounded"
                  >
                    Envoyer
                  </button>
                </form>
              </div>
              <div className="invisible lg:visible md:invisbile lg:flex hidden flex-col items-center absolute rounded-r-2xl -right-34 -mt-30">
                <img
                  src="/footer/flight.png"
                  alt=""
                  className="max-w-sm max-h-sm "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#8EBD22] w-full pt-10 md:pt-10 lg:pt-10 pb-16 md:pb-12 px-4 sm:px-6 md:px-8 lg:px-12 ">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 lg:pr-20">
            <div className="flex justify-center md:justify-start lg:col-span-2">
              <div className="flex flex-col items-center bg-white rounded-2xl w-fit h-fit p-5 mb-8">
                <div className="w-32 h-28 relative">
                  <img
                    src="/footer/happy-trip-logo.png"
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* First column */}
                <div>
                  <ul>
                    <li className="py-1">
                      <a href="" className=" text-xl text-white font-thin">
                        Accueil
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Qui sommes-nous?
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Contactez-nous
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Conditions générales de vente
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Second column */}
                <div>
                  <ul>
                    <li className="py-1">
                      <a href="" className=" text-xl text-white font-thin">
                        Destionations
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Haut Atlas
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Anti Atlas et Sous
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Moyen Atlas
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Parc Toubkal
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Third column */}
                <div>
                  <ul>
                    <li className="py-1">
                      <a href="" className=" text-xl text-white font-thin">
                        Activites
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Randonnee
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Montagne
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Bapteme de l&apos;air
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Bivouac
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Fourth column */}
                <div>
                  <ul>
                    <li className="py-1">
                      <a href="" className=" text-xl text-white font-thin">
                        About us
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Our story
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href=""
                        className="underline text-white font-medium my-1"
                      >
                        Work with us
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Fifth column */}
                <div>
                  <ul>
                    <li className="py-1">
                      <a href="" className=" text-xl text-white font-thin">
                        Contact Us
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href="tel:+212628324880"
                        className="underline  text-white font-medium my-1"
                      >
                        (212) 628324880
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href="mailto:happy.trip.voyage@gmail.com"
                        className="underline text-white font-medium my-1"
                      >
                        happy.trip.voyage@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
