"use client";

import { useJsApiLoader, GoogleMap, MarkerF } from "@react-google-maps/api";
import { useCallback, useMemo, useRef } from "react";
import { Loader2 } from "lucide-react";
import { NearMeButton } from "./NearMeButton";

const libraries: ("places" | "maps" | "geometry")[] = ["places"];

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  scrollwheel: true,
  styles: [
    {
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#a2daf2" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "green" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }],
    },
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export const MainMap = ({ events }: any) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const center = useMemo(() => {
    if (events.length === 0) return { lat: 52.2297, lng: 21.0122 };

    let bestEvent = events[0];
    let minTotalDistance = Infinity;

    events.forEach((e1: any) => {
      let currentDistance = 0;
      events.forEach((e2: any) => {
        currentDistance += Math.sqrt(
          Math.pow(e1.lat - e2.lat, 2) + Math.pow(e1.lng - e2.lng, 2),
        );
      });
      if (currentDistance < minTotalDistance) {
        minTotalDistance = currentDistance;
        bestEvent = e1;
      }
    });

    return { lat: bestEvent.lat, lng: bestEvent.lng };
  }, [events]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      if (events.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        events.forEach((e: any) => bounds.extend({ lat: e.lat, lng: e.lng }));
      }
    },
    [events],
  );

  if (!isLoaded) return <Loader2 className="animate-spin" />;

  return (
    <div className="w-full h-full ">
      <div className="w-full h-full rounded-[2rem]  overflow-hidden relative shadow-md">
        <div className="w-full h-[calc(100%+30px)] -mb-[30px]">
          <NearMeButton mapRef={mapRef} />

          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={12}
            options={mapOptions}
            onLoad={onLoad}
          >
            {events.map((event: any) => (
              <MarkerF
                key={event.id}
                position={{ lat: event.lat, lng: event.lng }}
                icon={{
                  url: "/blue-pin.png",
                  scaledSize: new google.maps.Size(40, 40),
                }}
              />
            ))}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};
