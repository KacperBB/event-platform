"use client";

import { CldImage } from "next-cloudinary";

interface EventImageProps {
  src: string;
  alt: string;
}

export const EventImage = ({ src, alt }: EventImageProps) => {
  return (
    <div className="relative w-20 h-20 overflow-hidden rounded-md border">
      <CldImage
        width="80"
        height="80"
        src={src}
        alt={alt}
        className="object-cover"
        crop="fill"
        gravity="auto"
      />
    </div>
  );
};
