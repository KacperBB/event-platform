"use server"; 

import { db } from "@/lib/db"; 
import bcrypt from "bcryptjs"; 
import { RegisterSchema } from "@/schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {error: "Niepoprawne pola!"};
  }

  const {email, password, name, role} = validatedFields.data;


  const existingUser = await db.user.findFirst({
    where: {email}
  });

  if (existingUser) {
    return { error: "Ten e-mail jest już zajęty!"};
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const slug = name.toLowerCase().replace(/ /g, "-");

  const baseSlug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, "-");

    const randomId = Math.random().toString(36).substring(2, 6);
    const finalHandle = `${baseSlug}-${randomId}`;

  const user = await db.user.create({
    data: {
        name,
        email,
        password: hashedPassword,
        role,
        handle: finalHandle,
    }
  });

  return { success: "Konto utworzone! Możesz się teraz zalogować"};
  
}