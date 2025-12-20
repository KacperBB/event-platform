"use client";

import { useState, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod"; 
import { useRouter } from "next/navigation"; 

import { EventSchema } from "@/schemas";
import { createEvent } from "@/actions/create-event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const libraries: ("places")[] = ["places"];

export const EventForm = () => {
  const router = useRouter(); 
  const [isPending, startTransition] = useTransition();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: "",
      address: "",
      lat: 0,
      lng: 0,
      description: "", 
    },
  });

  const { errors } = form.formState;

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      if (lat && lng) {
        form.setValue("lat", lat);
        form.setValue("lng", lng);
        form.setValue("address", place.formatted_address || "");
        form.clearErrors(["lat", "lng", "address"]);
      }
    }
  };
  const onSubmit = (values: z.infer<typeof EventSchema>) => {
    startTransition(() => {
      createEvent(values)
        .then((data) => {
          if (data?.error) {
            toast.error(data.error);
          }
          if (data?.success) {
            toast.success(data.success);
            router.push(`/events/${data.id}`);
          }
        })
        .catch(() => toast.error("Coś poszło nie tak..."));
    });
  };

  if (!isLoaded) return (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Ładowanie map...
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        {/* Tytuł */}
        <div className="space-y-2">
          <Input 
            {...form.register("title")} 
            placeholder="Nazwa wydarzenia" 
            disabled={isPending}
          />
            <Input 
              placeholder="Wpisz opis wydarzenia..." 
              disabled={isPending}
              {...form.register("description")} 
            />
          {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
        </div>

        {/* Google Places Autocomplete */}
        <div className="space-y-2">
          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={onPlaceChanged}
          >
            <Input 
              placeholder="Wpisz adres wydarzenia..." 
              disabled={isPending}
              {...form.register("address")} 
            />
          </Autocomplete>
          {(errors.address || errors.lat) && (
            <p className="text-sm text-red-500">
              {errors.address?.message || "Proszę wybrać dokładny adres z podpowiedzi."}
            </p>
          )}
        </div>

        {/* Data Picker */}
        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                disabled={isPending}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.getValues("date") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("date") ? (
                  format(form.getValues("date"), "PPP")
                ) : (
                  <span>Wybierz datę</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("date")}
                onSelect={(selectedDate) => {
                   // Kluczowy moment: synchronizacja z form
                  form.setValue("date", selectedDate as Date, { shouldValidate: true });
                }}
                initialFocus
                disabled={(date) => date < new Date() || isPending}
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Tworzenie...
          </>
        ) : (
          "Stwórz Wydarzenie"
        )}
      </Button>
    </form>
  );
};