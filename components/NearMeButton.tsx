"use client";

import { useState } from "react";
import { Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NearMeButtonProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

export const NearMeButton = ({ mapRef }: NearMeButtonProps) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert("Twoja przeglądarka nie wspiera lokalizacji.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (mapRef.current) {
          mapRef.current.panTo(pos);
          mapRef.current.setZoom(14);
        }
        setIsLocating(false);
      },
      () => {
        alert("Nie udało się pobrać Twojej lokalizacji.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="absolute top-6 right-2 z-10">
      <Button
        onClick={handleNearMe}
        disabled={isLocating}
        className="bg-white hover:bg-slate-50 text-black rounded-full shadow-xl border !px-6  py-6 gap-2 transition-all active:scale-95"
      >
        {isLocating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Navigation className="h-3 w-3 fill-sky-500 text-sky-500" />
        )}
        <span className="font-semibold text-sm">Near Me</span>
      </Button>
    </div>
  );
};
