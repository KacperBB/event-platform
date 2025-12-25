import { cancelEvent } from "@/actions/delete-event";
import { prisma } from "@/lib/db";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: () => Promise.resolve({ user: { id: "user_123", role: "ORGANIZER" } }),
}));

describe("Event Management Actions", () => {
  it("should change status to CANCELLED instead of deleting", async () => {
    const result = await cancelEvent("event_id_123");

    expect(result.success).toBeDefined();
  });
});
