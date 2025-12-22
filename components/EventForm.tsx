"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { format } from "date-fns";
import { CalendarIcon, Loader2, ImagePlus, Users } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { EventSchema } from "@/schemas";
import { createEvent } from "@/actions/create-event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TiptapEditor } from "./TiptapEditor";
import { FormField } from "./ui/form";

const libraries: "places"[] = ["places"];

export const EventForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasCapacity, setHasCapacity] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(false);

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
      maxCapacity: undefined,
    },
  });

  const { errors } = form.formState;

  const onSubmit = (values: z.infer<typeof EventSchema>) => {
    startTransition(() => {
      createEvent(values)
        .then((data) => {
          if (data?.error) toast.error(data.error);
          if (data?.success) {
            toast.success(data.success);
            router.push(`/events/${data.id}`);
          }
        })
        .catch(() => toast.error("Coś poszło nie tak..."));
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!isLoaded)
    return (
      <div className="flex gap-2">
        <Loader2 className="animate-spin" /> Mapy...
      </div>
    );

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 max-w-3xl pb-20"
    >
      <div className="space-y-4 border-b pb-6">
        <h3 className="text-lg font-bold">Podstawowe informacje</h3>
        <Input
          {...form.register("title")}
          placeholder="Nazwa wydarzenia"
          disabled={isPending}
        />

        <div className="flex gap-4">
          <Input
            {...form.register("thumbnail")}
            placeholder="URL Thumbnaila (obrazek główny)"
            disabled={isPending}
          />
          <Button type="button" variant="outline">
            <ImagePlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Pełny opis wydarzenia</Label>
        <TiptapEditor
          value={form.getValues("description")}
          onChange={(val) =>
            form.setValue("description", val, { shouldValidate: true })
          }
          disabled={isPending}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={() => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.geometry?.location) {
              form.setValue("lat", place.geometry.location.lat());
              form.setValue("lng", place.geometry.location.lng());
              form.setValue("address", place.formatted_address || "");
            }
          }}
        >
          <Input
            placeholder="Gdzie odbędzie się wydarzenie?"
            {...form.register("address")}
          />
        </Autocomplete>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.watch("date")
                ? format(form.getValues("date"), "PPP")
                : "Data wydarzenia"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={form.watch("date")}
              onSelect={(d) => form.setValue("date", d as Date)}
              disabled={(date) => date < today}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-6 bg-slate-50 p-6 rounded-xl border">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Limit miejsc</Label>
            <p className="text-xs text-muted-foreground">
              Ogranicz liczbę dostępnych biletów
            </p>
          </div>
          <Switch checked={hasCapacity} onCheckedChange={setHasCapacity} />
        </div>
        {hasCapacity && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <Users className="h-4 w-4 text-slate-500" />
            <Input
              type="number"
              placeholder="Liczba miejsc (np. 50)"
              {...form.register("maxCapacity", { valueAsNumber: true })}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Koniec sprzedaży</Label>
            <p className="text-xs text-muted-foreground">
              Kiedy ma zniknąć licznik i opcja zakupu?
            </p>
          </div>
          <Switch checked={hasDeadline} onCheckedChange={setHasDeadline} />
        </div>
        {hasDeadline && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {form.watch("bookingDeadline")
                  ? format(form.watch("bookingDeadline")!, "PPP HH:mm")
                  : "Wybierz termin zakończenia"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("bookingDeadline")}
                onSelect={(d) => form.setValue("bookingDeadline", d as Date)}
                disabled={(date) => {
                  const eventDate = form.watch("date");
                  return (
                    date < today || (eventDate ? date >= eventDate : false)
                  );
                }}
              />
            </PopoverContent>
          </Popover>
        )}
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Switch
                id="published-mode"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="published-mode">
                Opublikuj wydarzenie od razu
              </Label>
            </div>
          )}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Opublikuj wydarzenie"
        )}
      </Button>
    </form>
  );
};
