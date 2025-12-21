import * as z from "zod";

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Adres e-mail jest wymagany",
    }),
    password: z.string()
    .min(8, {message: "Minimum 8 znaków"})
    .regex(/[A-Z]/, { message: "Wymagana jedna wielka litera"})
    .regex(/[^a-zA-Z0-9]/, {message: "Wymagany znak specjalny"}),
    name: z.string().min(1, {
        message: "Imię i nazwisko (lub nazwa) są wymagane",
    }),
    role: z.enum(["USER", "ORGANIZER"], {
        invalid_type_error: "Wybierz poprawną rolę",
    }),
});

export const LoginSchema = z.object ({
    email: z.string().email({
        message: "Adres e-mail jest wymagany",
    }),
    password: z.string().min(1, {
        message: "Hasło jest wymagane",
    }),
});

export const EventSchema = z.object({
    title: z.string().min(3, "Tytuł musi mieć min. 3 znaki").max(100),
    description: z.string().min(10, "Opis jest za kótki").max(1000).optional(),
    address: z.string().min(5, "podaj dokładny adres"),
    date: z.date().refine((date) => date > new Date(), {
        message: "Data wydarzenia musi być w przyszłości",
    }),
    lat: z.number().refine(val => val !== 0, "Proszę wybrać adres z podpowiedzi"),
    lng: z.number().refine(val => val !== 0, "Proszę wybrać adres z podpowiedzi"),
    maxCapacity: z.number().optional(),
    bookingDeadline: z.date().optional(),
    thumbnail: z.string().optional(),
    images: z.array(z.string()).optional(),
});