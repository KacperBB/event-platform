import { MainMap } from "@/components/MainMap";
import { prisma } from "@/lib/db";
import { Event } from "@/types";
import React from "react";

export default async function Home() {
  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      parentId: null,
    },
    orderBy: {
      date: "asc",
    },
    select: {
      id: true,
      title: true,
      lat: true,
      lng: true,
      address: true,
    },
  });

  return (
    <div className="container mx-auto py-2">
      <section className="w-1/2 h-[70vh] min-h-[400px] relative border-1 rounded-lg">
        <MainMap events={events} />
      </section>
    </div>
  );
}
