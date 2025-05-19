import { Instagram, Link, Youtube } from "lucide-react";
import React from "react";

const Footer = () => {
    return (
        <footer>
           <div>
            <div>

            <div className="w-full flex justify-center "><img src="/footer/happy-trip.png" alt="happy-trip logo" className="lg:max-w-3xl  md:max-w-2xl max-w-[30vh]"/></div>
            <div><img src="/footer/mountain.png" alt="mountain" className="max-w-screen"/></div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 lg:-mt-34 md:-mt-34 -mt-16 w-[80%] self-center rounded-2xl grid  bg-[#D2E094] shadow-xl">
                <div className="flex flex-col items-left rounded-l-2xl lg:py-16 md:py-16 py-4 lg:pl-12 md:p-16 p-4">
                    <div className="lg:text-5xl md:text-5xl text-2xl text-lime-950 font-thin mb-2">Newsletter</div>
                    <p className="lg:text-[18px] md:text-[18px] text-[12px] text-lime-900 font-medium my-1">Besoin de conseil ? un projet de voyage, une question ?</p>
                    <form className="flex lg:flex-row md:flex-col lg:flex-center flex-col lg:mt-3 lg:mr-60">
                        <input type="email" placeholder="Votre email address" className="lg:w-[75%] md:w-l lg:p-4 md:p-4 p-2 w-full rounded bg-white placeholder:text-lime-900 focus:border-lime-900 "/>
                        <button type="submit" className="lg:w-[25%] w-full bg-lime-950 text-white text-sm lg:text-l md:text-xl lg:p-4 md:p-4 p-2 lg:ml-4 rounded mt-3 lg:mt-0 self-start">Subscribe</button>
                    </form>
                </div>
                <div className="invisible lg:visible md:invisbile flex flex-col items-center absolute rounded-r-2xl -right-34 -mt-30">
                    <img src="/footer/flight.png" alt="" className="max-w-lg max-h-lg "/>
                </div>
            </div>
          </div>
        {/* <div className="bg-[#8EBD22] w-full pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-12 px-4 sm:px-6 md:px-8 lg:px-12">
           <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    <img src="/footer/happy-trip-logo.png" alt="logo" className="w-40 h-34"/>
                    <div className="flex justify-center md:justify-start lg:col-span-1">
                        <div>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <Instagram />
                            </a>
                        </div>
                        <div>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <Youtube/>
                            </a>
                        </div>
                        <div>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <Instagram/>
                            </a>
                        </div>
                        <div>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <Youtube/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-flow-col gap-10 pr-44">
                <div className="">
                <ul>
                    <li className="py-1"><a href="" className=" text-2xl text-lime-950 font-thin">Accueil</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Qui sommes-nous?</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Contactez-nous</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Conditions générales de vente</a></li>
                </ul>
            </div>
            <div className="">
                <ul>
                    <li className="py-1"><a href="" className=" text-2xl text-lime-950 font-thin">Destionations</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Haut Atlas</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Anti Atlas et Sous</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Moyen Atlas</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Parc Toubkal</a></li>
                </ul>
            </div>
            <div className="">
                <ul>
                    <li className="py-1"><a href="" className=" text-2xl text-lime-950 font-thin">Activites</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Randonnee</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Montagne</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Bapteme de l&apos;air</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Bivouac</a></li>
                </ul>
            </div>
            <div className="">
                <ul>
                    <li className="py-1"><a href="" className=" text-2xl text-lime-950 font-thin">About us</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Our story</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Work with us</a></li>
                </ul>
            </div>
            <div className="">
                <ul>
                    <li className="py-1"><a href="" className=" text-2xl text-lime-950 font-thin">Contact Us</a></li>
                    <li className="py-1"><a href="tel:+212628324880" className="underline  text-lime-900 font-medium my-1">(212) 628324880</a></li>
                    <li className="py-1"><a href="mailto:happy.trip.voyage@gmail.com" className="underline text-lime-900 font-medium my-1">happy.trip.voyage@gmail.com</a></li>
                </ul>
            </div>
            </div>
        </div> */}


<div className="bg-[#8EBD22] w-full pt-50 md:pt-60 lg:pt-60 pb-16 md:pb-12 px-4 sm:px-6 md:px-8 lg:px-12 ">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 lg:pr-20">
          <div className="flex justify-center md:justify-start lg:col-span-2">
            <div className="flex flex-col items-center bg-white rounded-2xl w-fit h-fit p-5 mb-8">
              <div className="w-32 h-28 relative">
                <img src="/footer/happy-trip-logo.png" alt="logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-3 mt-2">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Instagram /></a>          
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Youtube /></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram /></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Youtube /></a>
              </div>
            </div>
          </div>

          {/* Navigation links - will be in a scrollable container on mobile */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* First column */}
              <div>
                <ul>
                    <li className="py-1"><a href="" className=" text-xl text-lime-950 font-thin">Accueil</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Qui sommes-nous?</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Contactez-nous</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Conditions générales de vente</a></li>
                </ul>
              </div>

              {/* Second column */}
              <div>
                <ul>
                    <li className="py-1"><a href="" className=" text-xl text-lime-950 font-thin">Destionations</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Haut Atlas</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Anti Atlas et Sous</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Moyen Atlas</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Parc Toubkal</a></li>
                </ul>
              </div>

              {/* Third column */}
              <div>
                <ul>
                    <li className="py-1"><a href="" className=" text-xl text-lime-950 font-thin">Activites</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Randonnee</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Montagne</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Bapteme de l&apos;air</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Bivouac</a></li>
                    
                </ul>
              </div>

              {/* Fourth column */}
              <div>
                <ul>
                    <li className="py-1"><a href="" className=" text-xl text-lime-950 font-thin">About us</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Our story</a></li>
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Work with us</a></li>
                </ul>
              </div>

              {/* Fifth column */}
              <div>
                <ul>
                    <li className="py-1"><a href="" className=" text-xl text-lime-950 font-thin">Contact Us</a></li>
                    <li className="py-1"><a href="tel:+212628324880" className="underline  text-lime-900 font-medium my-1">(212) 628324880</a></li>
                    <li className="py-1"><a href="mailto:happy.trip.voyage@gmail.com" className="underline text-lime-900 font-medium my-1">happy.trip.voyage@gmail.com</a></li>
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