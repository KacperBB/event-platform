import { describe, it, expect } from "vitest";
import { EventSchema } from "@/schemas";

describe("EventSchema - Walidacja dat", () => {
  const futureDate = new Date("2025-12-30T20:00:00");
  const earlierDate = new Date("2025-12-30T10:00:00");
  const laterDate = new Date("2025-12-31T10:00:00");

  it.each([
    {
      case: "Poprawne daty (deadline przed wydarzeniem)",
      data: {
        title: "Koncert",
        date: futureDate,
        bookingDeadline: earlierDate,
        address: "Warszawa", lat: 52, lng: 21
      },
      shouldPass: true
    },
    {
      case: "Błędne daty (deadline po wydarzeniu)",
      data: {
        title: "Koncert",
        date: futureDate,
        bookingDeadline: laterDate,
        address: "Warszawa", lat: 52, lng: 21
      },
      shouldPass: false
    },
    {
      case: "Brak deadline'u (opcjonalny)",
      data: {
        title: "Koncert",
        date: futureDate,
        address: "Warszawa", lat: 52, lng: 21
      },
      shouldPass: true
    }
  ])("$case -> success should be $shouldPass", ({ data, shouldPass }) => {
    const result = EventSchema.safeParse(data);
    expect(result.success).toBe(shouldPass);
  });
});