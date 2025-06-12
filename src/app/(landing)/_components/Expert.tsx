/* eslint-disable @next/next/no-img-element */
import React from "react";

const Expert = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-24 bg-white">
      <div className="text-center mb-24">
        <h1 className="text-4xl font-bold mb-6">Partir avec HAPPY TRIP</h1>
        <p className="max-w-3xl mx-auto text-gray-700">
          Nous sommes à votre écoute pour transformer vos idées d&apos;évasion en réalité. Parlez-nous de votre projet, même
          s&apos;il n&apos;en est qu&apos;au stade de rêve — nous vous aiderons à lui donner vie.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-16">
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-6 flex items-center justify-center">
            <img src="/icons/location.png" alt="path" className="w-16 h-16 object-contain" />
          </div>
          <h3 className="font-bold mb-3">Expertise locale et internationale</h3>
          <p className="text-sm text-gray-700">
            Notre équipe de professionnels passionnés met à votre service une parfaite connaissance des destinations,
            pour des voyages authentiques, bien organisés et sans imprévus.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-6 flex items-center justify-center">
            <img src="/icons/path.png" alt="path" className="w-16 h-16 object-contain" />
          </div>
          <h3 className="font-bold mb-3">Séjours sur mesure</h3>
          <p className="text-sm text-gray-700">
            Que vous rêviez d&apos;une escapade romantique, d&apos;un circuit culturel ou d&apos;un séjour en famille, nous concevons
            des voyages entièrement personnalisés, selon vos envies et votre budget.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-6 flex items-center justify-center">
            <img src="/icons/diamond.png" alt="diamond" className="w-16 h-16 object-contain" />
            </div>
          <h3 className="font-bold mb-3">Accompagnement complet</h3>
          <p className="text-sm text-gray-700">
            De la réservation à votre retour, nous vous accompagnons à chaque étape avec un service client réactif, à
            l&apos;écoute et disponible 7j/7.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-6 flex items-center justify-center">
            <img src="/icons/badge.png" alt="badge" className="w-16 h-16 object-contain" />
          </div>
          <h3 className="font-bold mb-3">Des expériences inoubliables</h3>
          <p className="text-sm text-gray-700">
            Notre objectif : faire de chaque voyage une expérience unique, riche en découvertes, émotions et souvenirs
            mémorables.
          </p>
        </div>
      </div>
    </div>
    );
}
export default Expert;