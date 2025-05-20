/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState } from "react";
import Hero from "./_components/Hero";
import { Navbar } from "./_components/Header";
import National from "./_components/National";
import International from "./_components/International";
import Mesure from "./_components/Mesure";
import ReviewsSection from "./_components/Reviews";
import Meeting from "./_components/Meeting";
import Expert from "./_components/Expert";
import Trust from "./_components/Trust";
import Footer from "./_components/Footer";
import { getLanding } from "@/actions/saveLandingConfig";

const LandigPage =  () => {
const [sections, setSections] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getLanding()
      setSections(res)
      console.log(res)
    }

    fetchData()
  }, [])
  return (
    <div>
      {(sections?.navbar ?? true) && 
        <div className="lg:px-6 w-full px-3">
          <div className="bg-[#8EBD22] lg:rounded-b-2xl rounded-b-lg shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] flex items-center justify-center py-4">
            <h1 className="text-white text-xs lg:text-lg text-center">
              Nos packs SUMMER 2025 sont disponibles Dés Maintenant!
            </h1>
          </div>
        </div>
      }
      <Navbar />
      {(sections?.hero ?? true) && <Hero inp={sections?.search}/>}
      {(sections?.national ?? true) && <National />}
      {(sections?.international ?? true) && <International />}
      {(sections?.mesure ?? true) && <Mesure />}
      {(sections?.reviews ?? true) && <ReviewsSection />}
      {(sections?.meeting ?? true) && <Meeting />}
      {(sections?.expert ?? true) && <Expert />}
      {(sections?.trust ?? true) && <Trust />}
      {(sections?.footer ?? true) && <Footer />}
    </div>
  );
};

export default LandigPage;
