import { Instagram, Youtube } from "lucide-react";
import React from "react";

const Footer = () => {
    return (
        <footer>
           <div>
            <div className="w-full flex justify-center"><img src="/footer/happy-trip.png" alt="happy-trip logo" className="max-w-3xl"/></div>
            <div><img src="/footer/mountain.png" alt="mountain" className="max-w-screen"/></div>
            
            <div className="absolute left-1/2 transform -translate-x-1/2 -mt-34 w-[80%] self-center rounded-2xl grid grid-cols-2 bg-[#D2E094] shadow-xl">
                <div className="flex flex-col items-left rounded-l-2xl py-16 pl-12">
                    <div className="text-5xl text-lime-950 font-thin mb-2">Newsletter</div>
                    <p className="text-[18px] text-lime-900 font-medium my-1">Besoin de conseil ? un projet de voyage, une question ?</p>
                    <form className="flex items-center mt-2">
                        <input type="email" placeholder="Votre email address" className="w-2xl p-4 rounded  bg-white placeholder:text-lime-900"/>
                        <button type="submit" className="bg-lime-950 text-white p-4 rounded ml-4">Subscribe</button>
                    </form>
                </div>
                <div className="flex flex-col items-center absolute rounded-r-2xl -right-34 -mt-38">
                    <img src="/footer/flight.png" alt="" className="max-w-xl max-h-xl"/>
                </div>
            </div>
           
          </div>
        <div className="bg-[#8EBD22] w-full grid grid-flow-col pt-52 pb-16 pl-44 ">
           <div className="w-fit flex flex-col items-center">
                <div className="flex flex-col items-center bg-white rounded-2xl w-fit p-1">
                    <img src="/footer/happy-trip-logo.png" alt="logo" className="w-40 h-34"/>
                    <div className="flex gap-2">
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
                    <li className="py-1"><a href="" className="underline text-lime-900 font-medium my-1">Bapteme de l'air</a></li>
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
        </div>
        </footer>
    );
};

export default Footer;