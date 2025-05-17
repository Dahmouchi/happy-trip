'use client'

import React from "react";


const Trust = () => {
    return (
        <div>
            <div className="text-center mb-24">
        <h1 className="text-4xl font-bold mb-6">ILS NOUS ONT FAIT CONFIANCE</h1>
        <p className="max-w-3xl mx-auto text-gray-700">
         Des organisations qui nous soutiennent et approuvent toujours notre bon travail.
        </p>
      </div>

        <div className="w-full overflow-x-hidden relative pb-20">
            <div
                className="flex items-center gap-8 gap-x-24 animate-scroll-logos py-4"
                style={{
                    minWidth: "max-content",
                    width: "fit-content",
                }}
            >
                {/* Repeat logos twice for seamless scroll */}
                {[
                    "/partners/lear.png",
                    "/partners/alomran.png",
                    "/partners/gpc.png",
                    "/partners/marsa-maroc.png",
                    "/partners/hem.png",
                    "/partners/cnss.png",
                    "/partners/attijariwafa-bank-seeklogo.png",
                    "/partners/lear.png",
                    "/partners/alomran.png",
                    "/partners/gpc.png",
                    "/partners/marsa-maroc.png",
                    "/partners/hem.png",
                    "/partners/cnss.png",
                    "/partners/attijariwafa-bank-seeklogo.png",
                ].map((src, idx) => (
                    <div className="flex justify-center items-center" key={idx}>
                        <img src={src} alt={`logo-${idx}`} className="w-32 h-32 object-contain" />
                    </div>
                ))}
            </div>
            <style>
                {`
                @keyframes scroll-logos {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-logos {
                    display: flex;
                    width: 200%;
                    animation: scroll-logos 20s linear infinite;
                }
                `}
            </style>
        </div>
        </div>

    );
}

export default Trust;