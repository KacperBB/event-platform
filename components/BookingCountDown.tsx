"use client";

import React, { useEffect, useState } from "react";

interface BookingCountDownProps {
  deadline: Date;
}

const BookingCountDown = ({ deadline }: BookingCountDownProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(deadline).getTime() - now;

      if (distance < 0) {
        setTimeLeft("SPRZEDAŻ ZAKOŃCZONA");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 1000 * 60 * 60) setIsUrgent(true);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft === "SPRZEDAŻ ZAKOŃCZONA") {
    return (
      <div className="text-red-600 font-bold border-2 border-red-600 p-2 rounded">
        KONIEC SPRZEDAŻY
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all ${
        isUrgent ? "border-red-500 bg-red-50 animate-pulse" : "border-slate-200"
      }`}
    >
      <p className="text-xs uppercase font-bold text-muted-foreground">
        Koniec sprzedaży za:
      </p>
      <p
        className={`text-2xl font-mono font-black ${
          isUrgent ? "text-red-600" : "text-slate-800"
        }`}
      >
        {timeLeft}
      </p>
    </div>
  );
};

export default BookingCountDown;
