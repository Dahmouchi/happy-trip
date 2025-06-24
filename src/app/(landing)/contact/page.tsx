/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import HeroSub from "../_components/hero-sub";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  ChevronRight,
  MessageSquareText,
} from "lucide-react";
import { createNewsLetter } from "@/actions/saveLandingConfig";
import { toast } from "react-toastify";

const Contact = () => {
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const form = e.target;
    const data = {
      prenom: form.prenom.value,
      nom: form.nom.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      const res = await createNewsLetter(
        data.nom,
        data.prenom,
        data.email,
        data.message
      );
      if (res) {
        toast.success("votre message a été envoyer");
      }
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi du message.");
    }
  };
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/contact", text: "Contact" },
  ];
  return (
    <div>
      <HeroSub
        title="Contactez Happy Trip Voyage"
        description={
          "Nous sommes à votre écoute pour créer le voyage de vos rêves au Maroc et au-delà."
        }
        breadcrumbLinks={breadcrumbLinks}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Phone Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Phone className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
            <p className="text-gray-600 mb-4">
              Disponible 24/7 pour vos urgences
            </p>
            <div className="space-y-2">
              <a
                href="tel:2120628324880"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Phone className="w-4 h-4 mr-2" /> (212) 0628-324880
              </a>
              <a
                href="tel:2120628324880"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Phone className="w-4 h-4 mr-2" /> (212) 0628-324880
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Mail className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-600 mb-4">Réponse garantie sous 24h</p>
            <a
              href="mailto:happy.trip.voyage@gmail.com"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Mail className="w-4 h-4 mr-2" /> happy.trip.voyage@gmail.com
            </a>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <MapPin className="text-orange-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Bureau</h3>
            <p className="text-gray-600 mb-4">Visitez-nous sur rendez-vous</p>
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-gray-500" />
              <span>Rabat, Maroc</span>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[#D2E094] rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
            <div className="flex flex-col items-left rounded-l-2xl lg:py-8 md:py-16 py-4 lg:pl-12 md:p-16 p-4">
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
          </div>

          {/* Additional Info */}
          <div>
            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-xl overflow-hidden mb-8 h-64 flex items-center justify-center">
              <div className="text-center p-4">
                <Globe className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.2961954953207!2d-6.839816424484885!3d34.02026867316902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76de9c8728317%3A0x46dc98bb0096920e!2sHappy%20Trip!5e1!3m2!1sfr!2sma!4v1750765946737!5m2!1sfr!2sma"
                  width="600"
                  height="450"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Horaires d&apos;ouverture
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-600">Lundi - Vendredi</span>
                  <span className="font-medium">09:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Samedi</span>
                  <span className="font-medium">10:00 - 16:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Dimanche</span>
                  <span className="font-medium">Fermé</span>
                </li>
              </ul>
            </div>

            {/* Emergency Contact */}
            <div className="bg-[#8EBD22] rounded-xl shadow-md p-6 border-l-4 border-[#628315]">
              <h3 className="text-xl font-semibold mb-3 flex items-center text-white">
                <MessageSquareText className="w-5 h-5 mr-2 text-white" />
                Contact Rapide
              </h3>
              <p className="text-gray-50 mb-4">
                Bonjour! Cliquez sur l&apos;un de nos représentants ci-dessous
                pour discuter sur WhatsApp ou envoyez-nous un e-mail à
                happy.trip.voyage@gmail.com
              </p>

              <div className="space-y-3">
                {/* WhatsApp Contact 1 */}
                <a
                  href="https://wa.me/212628324880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-green-50 hover:bg-green-100 p-3 rounded-lg border border-green-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <div>
                      <p className="font-medium">Salima</p>
                      <p className="text-sm text-gray-600">
                        Chargée Programmes et Réservations
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>

                {/* WhatsApp Contact 2 - You can duplicate this for more agents */}
                <a
                  href="https://wa.me/212628324880"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-green-50 hover:bg-green-100 p-3 rounded-lg border border-green-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <div>
                      <p className="font-medium">Autre Représentant</p>
                      <p className="text-sm text-gray-600">Service Client</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
              </div>

              <div className="mt-4 text-center text-sm text-gray-50">
                Powered by{" "}
                <a
                  href="https://www.happytrip.ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-900 hover:underline"
                >
                  www.happytrip.ma
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Nos voyageurs témoignent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "L'équipe de Happy Trip a organisé un voyage exceptionnel au Sahara. Professionnalisme et réactivité!",
                author: "Sophie D., Paris",
              },
              {
                quote:
                  "Service client disponible à tout moment. Ils ont sauvé nos vacances quand notre vol a été annulé.",
                author: "Ahmed T., Casablanca",
              },
              {
                quote:
                  "Des conseillers qui connaissent parfaitement le Maroc. Circuit personnalisé parfait pour notre famille.",
                author: "La famille Martin, Lyon",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-yellow-400 mb-4">★★★★★</div>
                <p className="text-gray-600 italic mb-4">
                  &quot;{testimonial.quote}&quot;
                </p>
                <p className="text-gray-800 font-medium">
                  {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
