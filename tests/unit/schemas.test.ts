import { EventSchema } from "@/schemas";
import { describe, it, expect } from "vitest";

const validData = {
  title: "Koncert",
  description: "Opis wydarzenia",
  address: "Warszawa, ul. Testowa 1",
  date: new Date(Date.now() + 1000 * 60 * 60 * 24),
  startTime: "19:00",
  lat: 52.2297,
  lng: 21.0122,
  thumbnail: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  isPublished: true,
};

describe("EventSchema logic", () => {
  it("powinien odrzucić wydarzenie z pustym tytułem", () => {
    const result = EventSchema.safeParse({
      ...validData,
      title: "",
    });
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.format().title).toBeDefined();
    }
  });

  it("powinien wymagać poprawnego adresu URL obrazka", () => {
    const result = EventSchema.safeParse({
      ...validData,
      thumbnail: "nie-url",
    });
    expect(result.success).toBe(false);

    if (!result.success) {
      const error = result.error.format();
      expect(error.thumbnail).toBeDefined();
    }
  });

  it("powinien przejść z kompletnymi, poprawnymi danymi", () => {
    const result = EventSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
