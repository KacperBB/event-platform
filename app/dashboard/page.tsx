import { logout } from "@/actions/logout";
import { updateHandle } from "@/actions/settings";
import { auth } from "@/auth";
import HandleDescription from "@/components/auth/HandleDescription";
import { HandleForm } from "@/components/auth/HandleForm";
import OrganizerPanel from "@/components/dashboard/OrganizerPanel";
import { UserTickets } from "@/components/dashboard/UserTickets";
import { prisma } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Image from "next/image";
import React from "react";

export default async function Dashboard() {
  const session = await auth();

  const myEvents = await prisma.event.findMany({
    where: {
      creatorId: session?.user.id,
    },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  const isOrganizer = session?.user.role === "ORGANIZER";

  return (
    <div className="p-10 flex flex-col gap-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Witaj, {session.user.name}</h1>

        <Tabs
          defaultValue={isOrganizer ? "organizer" : "tickets"}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="tickets">Moje Bilety</TabsTrigger>
            {isOrganizer && (
              <TabsTrigger value="organizer">Panel Organizatora</TabsTrigger>
            )}
            <TabsTrigger value="settings">Ustawienia</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets">
            <UserTickets userId={session.user.id} />
          </TabsContent>

          {isOrganizer && (
            <TabsContent value="organizer">
              <OrganizerPanel userId={session.user.id} />
            </TabsContent>
          )}

          <TabsContent value="settings">
            <div className="p-4 border rounded">
              Ustawienia Twojego profilu...
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
            <p className="text-gray-500 text-sm">
              Twój aktualny handle: @{session?.user?.handle}
            </p>
          </div>
        </div>
      </div>

      <HandleForm />
      <HandleDescription />

      <form action={logout}>
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Wyloguj się
        </button>
      </form>
    </div>
  );
}
