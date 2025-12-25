import { EventSchema } from "@/schemas";
import { describe, it, expect } from "vitest";

describe("EventSchema logic", () => {
  it("powinien odrzucić wydarzenie z pustym tytułem", () => {
    const result = EventSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("powinien wymagać poprawnego adresu URL obrazka (jeśli podany)", () => {
    const result = EventSchema.safeParse({ thumbnail: "nie-url" });
    if (!result.success) {
      const error = result.error.format();
      expect(error.thumbnail).toBeDefined();
    }
  });
});
