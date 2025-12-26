import { describe, it, expect } from "vitest";

const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24);

describe("EventSchema - Walidacja dat", () => {
  it.each([
    {
      case: "Poprawne dane",
      shouldPass: true,
      data: {
        title: "Koncert",
        address: "Warszawa",
        date: futureDate,
        startTime: "19:00",
        thumbnail: "https://link-do-zdjecia.pl/img.jpg",
        lat: 52.2,
        lng: 21.0,
      },
    },
    {
      case: "Błędna godzina (pusta)",
      shouldPass: false,
      data: {
        title: "Koncert",
        address: "Warszawa",
        date: futureDate,
        startTime: "",
        thumbnail: "https://link-do-zdjecia.pl/img.jpg",
        lat: 52.2,
        lng: 21.0,
      },
    },
  ])("$case -> success should be $shouldPass", ({ data, shouldPass }) => {
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(shouldPass);
  });
});
