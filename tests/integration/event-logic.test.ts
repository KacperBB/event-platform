import { describe, it, expect } from "vitest";

const getStatus = (isPublished: boolean) =>
  isPublished ? "PUBLISHED" : "DRAFT";

describe("Event Status Logic", () => {
  it("powinien poprawnie mapować checkbox na status PUBLISHED", () => {
    expect(getStatus(true)).toBe("PUBLISHED");
  });

  it("powinien poprawnie mapować checkbox na status DRAFT", () => {
    expect(getStatus(false)).toBe("DRAFT");
  });
});
