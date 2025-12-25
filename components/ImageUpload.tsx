"use client";

import { CldImage, CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export const ImageUpload = ({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) => {
  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-[300px] h-[200px] rounded-md overflow-hidden border">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={onRemove}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative w-[300px] h-[200px] rounded-md overflow-hidden border">
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type="button"
                  onClick={onRemove}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <CldImage
                fill
                src={value}
                alt="Event Image"
                className="object-cover"
                crop="fill"
                gravity="auto"
              />
            </div>
          </div>
        ) : (
          <CldUploadWidget
            onSuccess={(result: any) => {
              onChange(result.info.secure_url);
              document.body.style.overflow = "auto";
            }}
            onClose={() => {
              document.body.style.overflow = "auto";
            }}
            uploadPreset="event_platform"
          >
            {({ open }) => {
              return (
                <div
                  onClick={() => open()}
                  className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-slate-300 flex flex-col justify-center items-center gap-4 text-slate-600 w-full"
                >
                  <ImagePlus className="h-10 w-10" />
                  <div className="font-semibold text-lg">
                    Kliknij, aby dodać zdjęcie
                  </div>
                </div>
              );
            }}
          </CldUploadWidget>
        )}
      </div>
    </div>
  );
};
