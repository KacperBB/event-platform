import { prisma } from "@/lib/db";
import { Event } from "@/types";
import React from "react";

export default async function Home() {
  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      date: "asc",
    },
  });

  const featuredEvent: Event = {
    id: "1",
    title: "Sample Event",
    description: "This is a sample event description.",
    location: "Sample Location",
    price: 0,
    date: new Date(),
    organizerId: "org1",
  };

  return (
    <main className="p-24">
      <div>
        <h1 className="text-4xl font-bold mb-8">{featuredEvent.title}</h1>
        <p className="mb-4">{featuredEvent.description}</p>
        <p className="mb-2">
          <strong>Location:</strong> {featuredEvent.location}
        </p>
        <p className="mb-2">
          <strong>Date:</strong> {featuredEvent.date.toDateString()}
        </p>
        <p className="mb-2">
          <strong>Price:</strong>{" "}
          {featuredEvent.price === 0 ? "Free" : `$${featuredEvent.price}`}
        </p>
      </div>
    </main>
  );
}
