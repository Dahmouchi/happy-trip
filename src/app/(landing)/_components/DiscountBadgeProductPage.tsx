"use client";
import { useEffect, useRef, useState } from "react";

const DiscountTimerProduct = ({ endDate }: { endDate: string }) => {

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [hasTimeLeft, setHasTimeLeft] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!endDate) return;

   const end = new Date(endDate).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      let diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        setHasTimeLeft(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      setHasTimeLeft(true);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * (1000 * 60);
      const seconds = Math.floor(diff / 1000);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateCountdown();

    // Use setTimeout recursively for more accurate ticking
    const tick = () => {
      updateCountdown();
      intervalRef.current = setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    intervalRef.current = setTimeout(tick, 1000 - (Date.now() % 1000));

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [endDate]);

  if (!hasTimeLeft) return null;

  return (
    <div className="lg:absolute top-0 w-full lg:w-fit lg:right-0 px-5  space-y-2 z-10  bg-gradient-to-b from-red-500 via-red-500/70 to-red-500/0 py-2">
    <h1 className="text-xs text-white text-center">Réduction de temps limité</h1>
      <div className="flex items-center justify-between gap-4 text-white font-bold size-full">
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div key={unit} className="flex flex-col items-center">
             <span className="text-[10px] uppercase mt-1 tracking-wider">
              {unit}
            </span>
            <div className="bg-white text-red-600 rounded-md px-2 py-1 text-sm font-extrabold min-w-[40px] text-center">
              {timeLeft[unit as keyof typeof timeLeft]}
            </div>
           
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscountTimerProduct;
