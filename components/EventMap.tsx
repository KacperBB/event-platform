"use client";

import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";

interface EventMapProps {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

export const EventMap = ({ lat, lng }: EventMapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const center = { lat, lng };

  if (!isLoaded) return <div>Ładowanie mapy...</div>;

  return (
    <div className="rounded-xl overflow-hidden border">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <MarkerF position={center} />
      </GoogleMap>
    </div>
  );
};