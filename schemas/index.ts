import { EventStatus } from "@/app/generated/prisma";
import { toast } from "sonner";
import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Adres e-mail jest wymagany",
  }),
  password: z
    .string()
    .min(8, { message: "Minimum 8 znaków" })
    .regex(/[A-Z]/, { message: "Wymagana jedna wielka litera" })
    .regex(/[^a-zA-Z0-9]/, { message: "Wymagany znak specjalny" }),
  name: z.string().min(1, {
    message: "Imię i nazwisko (lub nazwa) są wymagane",
  }),
  role: z.enum(["USER", "ORGANIZER"], {
    invalid_type_error: "Wybierz poprawną rolę",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Adres e-mail jest wymagany",
  }),
  password: z.string().min(1, {
    message: "Hasło jest wymagane",
  }),
});

export const EventSchema = z
  .object({
    title: z.string().min(3, "Tytuł musi mieć min. 3 znaki").max(100),
    description: z
      .string()
      .min(10, "Opis jest za krótki")
      .max(3000)
      .optional()
      .or(z.literal("")),
    address: z.string().min(5, "Podaj dokładny adres"),
    // Poprawiona definicja startTime
    startTime: z.string().min(1, "Godzina rozpoczęcia jest wymagana"),
    // Poprawiona definicja date
    date: z.date({
      required_error: "Data wydarzenia jest wymagana",
    }),
    lat: z
      .number()
      .refine((val) => val !== 0, "Proszę wybrać adres z podpowiedzi"),
    lng: z
      .number()
      .refine((val) => val !== 0, "Proszę wybrać adres z podpowiedzi"),
    maxCapacity: z.number().optional().nullable(),
    bookingDeadline: z.date().optional().nullable(),
    thumbnail: z.string().url("Błędny URL").min(1, "Wymagany"),
    isPublished: z.boolean().default(false),
    images: z.array(z.string()).optional(),
    status: z.nativeEnum(EventStatus).optional().default(EventStatus.DRAFT),
    parentId: z.string().optional().nullable(),
    categories: z
      .array(z.string())
      .min(1, "Wybierz przynajmniej jedną kategorię"),
    price: z.coerce.number().min(0, "Cena nie może być ujemna").default(0),
    locations: z
      .array(
        z.object({
          date: z.date(),
          startTime: z.string(),
          address: z.string(),
          lat: z.number(),
          lng: z.number(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    const now = new Date();

    if (data.date && data.startTime) {
      const [hours, minutes] = data.startTime.split(":").map(Number);
      const eventDateTime = new Date(data.date);
      eventDateTime.setHours(hours, minutes);

      if (eventDateTime < now) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Data i godzina wydarzenia muszą być w przyszłości",
          path: ["date"],
        });
      }

      if (data.bookingDeadline && data.bookingDeadline >= eventDateTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Termin rezerwacji musi być wcześniejszy niż start wydarzenia",
          path: ["bookingDeadline"],
        });
      }
    }

    if (data.bookingDeadline && data.bookingDeadline < now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Termin rezerwacji nie może być w przeszłości",
        path: ["bookingDeadline"],
      });
    }
  });
