import { logout } from '@/actions/logout';
import { updateHandle } from '@/actions/settings';
import { auth } from '@/auth'
import Image from 'next/image';
import React from 'react'

export default async function Dashboard() {
    const session = await auth();

    const userImage = session?.user?.image;
    const userName = session?.user?.name || "Użytkownik";
    
return ( 
    <div className="p-10 flex flex-col gap-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <p className="text-sm text-muted-foreground">Zalogowany jako:</p>
        <div className="flex items-center gap-x-3 mt-2">
          {session?.user?.image && (
            <Image 
                width={24}
                height={24}
              src={session.user.image} 
              alt="Avatar" 
              className="h-10 w-10 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">{session?.user?.name}</p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>

          <div>
        <h2 className="text-xl font-bold">Twój profil</h2>
        <p className="text-gray-500 text-sm">Twój aktualny handle: @{session?.user?.handle}</p>
      </div>
        </div>
      </div>

      <form action={async (formData: FormData) => {
        "use server";
        const h = formData.get("handle") as string;
        await updateHandle(h);
      }} className="flex gap-x-2">
        <input 
          name="handle" 
          placeholder="Nowy handle" 
          className="border p-2 rounded-md"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Zapisz
        </button>
      </form>

        <form action={logout}>
            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
            Wyloguj się
            </button>
        </form>
    </div>
  );
}
