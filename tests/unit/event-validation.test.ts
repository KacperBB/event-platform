import { describe, it, expect } from "vitest";
import { EventSchema } from "@/schemas";

describe("EventSchema - Walidacja dat", () => {
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const earlierDate = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
  const laterDate = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
  const validThumbnail =
    "https://res.cloudinary.com/demo/image/upload/sample.jpg";

  it.each([
    {
      case: "Poprawne daty (deadline przed wydarzeniem)",
      data: {
        title: "Koncert",
        date: futureDate,
        bookingDeadline: earlierDate,
        thumbnail: validThumbnail,
        startTime: "19:00",
        address: "Warszawa",
        lat: 52,
        lng: 21,
      },
      shouldPass: true,
    },
    {
      case: "Błędne daty (deadline po wydarzeniu)",
      data: {
        title: "Koncert",
        date: futureDate,
        bookingDeadline: laterDate,
        startTime: "19:00",
        address: "Warszawa",
        lat: 52,
        thumbnail: validThumbnail,
        lng: 21,
      },
      shouldPass: false,
    },
    {
      case: "Brak deadline'u (opcjonalny)",
      data: {
        title: "Koncert",
        date: futureDate,
        address: "Warszawa",
        lat: 52,
        thumbnail: validThumbnail,
        startTime: "19:00",
        lng: 21,
      },
      shouldPass: true,
    },
    {
      case: "Brak thumbnaila",
      shouldPass: false,
      data: {
        title: "Koncert",
        date: futureDate,
        startTime: "19:00",
        address: "Warszawa",
      },
    },
  ])("$case -> success should be $shouldPass", ({ data, shouldPass }) => {
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(shouldPass);
  });
});
