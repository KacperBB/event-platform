"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useTransition, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { updateEvent } from "@/actions/update-event";
import { ImageUpload } from "./ImageUpload";
import { pl } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const libraries: "places"[] = ["places"];

interface EventFormProps {
  initialData?: any;
  id?: string;
  parents?: { id: string; title: string }[];
}

export const EventForm = ({
  initialData,
  id,
  parents = [],
}: EventFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [hasCapacity, setHasCapacity] = useState(!!initialData?.maxCapacity);
  const [hasDeadline, setHasDeadline] = useState(
    !!initialData?.bookingDeadline
  );

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const getTimeString = (date: Date | string | null) => {
    if (!date) return "18:00";
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          isPublished: initialData.status === "PUBLISHED",
          thumbnail: initialData.image || "",
          date: initialData.date ? new Date(initialData.date) : undefined,
          startTime: initialData.startTime
            ? getTimeString(initialData.startTime)
            : "18:00",
          bookingDeadline: initialData.bookingDeadline
            ? new Date(initialData.bookingDeadline)
            : undefined,
          parentId: initialData.parentId,
        }
      : {
          title: "",
          address: "",
          lat: 0,
          lng: 0,
          description: "",
          thumbnail: "",
          startTime: "18:00",
          maxCapacity: undefined,
          isPublished: false,
          parentId: null,
        },
  });

  const { errors } = form.formState;

  const onSubmit = (values: z.infer<typeof EventSchema>) => {
    startTransition(async () => {
      try {
        const data = id
          ? await updateEvent(id, values)
          : await createEvent(values);

        if (data?.error) {
          toast.error(data.error);
        } else if (data?.success) {
          toast.success(data.success);
          router.push("/dashboard");
          router.refresh();
        }
      } catch (err) {
        toast.error("Wystąpił nieoczekiwany błąd.");
      }
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl pb-20"
      >
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-bold">Podstawowe informacje</h3>
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wydarzenie nadrzędne</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz wydarzenie główne" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">
                      Brak (wydarzenie główne)
                    </SelectItem>
                    {parents.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Input
            {...form.register("title")}
            placeholder="Nazwa wydarzenia"
            disabled={isPending}
          />

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Zdjęcie wydarzenia</Label>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onRemove={() => field.onChange("")}
                  />
                  {errors.thumbnail && (
                    <p className="text-sm text-red-500">
                      {errors.thumbnail.message}
                    </p>
                  )}
                </div>
              )}
            />
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
          {/* Autocomplete dla adresu */}
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
            <div className="space-y-2">
              <Label>Lokalizacja</Label>
              <Input
                placeholder="Gdzie odbędzie się wydarzenie?"
                {...form.register("address")}
                disabled={isPending}
              />
            </div>
          </Autocomplete>

          <div className="space-y-2">
            <Label>Data i godzina</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("date")
                      ? format(form.watch("date"), "PPP", { locale: pl })
                      : "Wybierz datę"}
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

              {/* POLE START TIME */}
              <Input
                type="time"
                className="w-[120px]"
                {...form.register("startTime")}
                disabled={isPending}
              />
            </div>
            {errors.startTime && (
              <p className="text-xs text-red-500">{errors.startTime.message}</p>
            )}
          </div>
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
            <Switch
              checked={hasDeadline}
              onCheckedChange={(checked) => {
                setHasDeadline(checked);
                if (!checked) {
                  form.setValue("bookingDeadline", null);
                }
              }}
            />
          </div>

          {hasDeadline && (
            <div className="animate-in fade-in slide-in-from-top-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {form.watch("bookingDeadline")
                      ? format(
                          new Date(form.watch("bookingDeadline")!),
                          "PPP HH:mm",
                          { locale: pl }
                        )
                      : "Wybierz termin zakończenia"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      form.watch("bookingDeadline")
                        ? new Date(form.watch("bookingDeadline")!)
                        : undefined
                    }
                    onSelect={(d) => form.setValue("bookingDeadline", d)}
                    disabled={(date) => {
                      const eventDate = form.watch("date");
                      return (
                        date < today ||
                        (eventDate ? date >= new Date(eventDate) : false)
                      );
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.bookingDeadline && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.bookingDeadline.message}
                </p>
              )}
            </div>
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

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : id ? (
            "Zapisz zmiany"
          ) : (
            "Opublikuj wydarzenie"
          )}
        </Button>
      </form>
    </Form>
  );
};
