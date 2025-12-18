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