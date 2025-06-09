"use client";
import { useEffect, useState } from "react";

const DiscountTimer = ({ endDate }: { endDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (!endDate) return;

    const updateCountdown = () => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateCountdown(); // immediate run
    const interval = setInterval(updateCountdown, 1000); // every second

    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="absolute top-0 w-full  space-y-2 z-10  bg-gradient-to-b from-red-500 via-red-500/70 to-red-500/0 rounded-md px-3 py-2 shadow-md">
    <h1 className="text-xs text-white text-center">Réduction de temps limité</h1>
      <div className="flex items-center justify-between gap-1 text-white font-bold size-full">
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div key={unit} className="flex flex-col items-center">
            <div className="bg-white text-red-600 rounded-md px-2 py-1 text-sm font-extrabold min-w-[40px] text-center">
              {timeLeft[unit as keyof typeof timeLeft]}
            </div>
            <span className="text-[10px] uppercase mt-1 tracking-wider">
              {unit}
            </span>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountTimer;
