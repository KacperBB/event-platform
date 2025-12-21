"use client";

import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";

const libraries: "places"[] = ["places"]; // Musi być poza komponentem!

interface EventMapProps {
  lat: number;
  lng: number;
  title: string;
  address: string;
}

export const EventMap = ({ lat, lng, title, address }: EventMapProps) => {
  const [showInfo, setShowInfo] = useState(false);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const center = { lat, lng };

  if (!isLoaded) return <div>Ładowanie mapy... ⏳</div>;

  return (
    <div className="rounded-xl overflow-hidden border h-full w-full">
        <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={center}
                zoom={15}
            >
                <MarkerF 
                position={center} 
                onClick={() => setShowInfo(true)}
                >
                {showInfo && (
                    <InfoWindowF onCloseClick={() => setShowInfo(false)} position={center}>
                    <div className="p-2 min-w-[150px]">
                        <h3 className="font-bold text-sm text-black">{title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{address}</p>
                    </div>
                    </InfoWindowF>
                )}
                </MarkerF>
            </GoogleMap>
    </div>
  );
};