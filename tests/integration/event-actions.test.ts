import { cancelEvent } from "@/actions/cancel-event";
import { prisma } from "@/lib/db";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/auth", () => ({
  auth: () => Promise.resolve({ user: { id: "user_123", role: "ORGANIZER" } }),
}));

//Prisma MOCK
vi.mock("@/lib/db", () => ({
  prisma: {
    event: {
      update: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

describe("Event Management Actions", () => {
  it("should change status to CANCELLED instead of deleting", async () => {
    prisma.event.update.mockResolvedValue({
      id: "event_id_123",
      status: "CANCELLED",
    });

    const result = await cancelEvent("event_id_123");

    expect(result.success).toBeDefined();
    expect(result.success).toBe("Wydarzenie zostało odwołane!");

    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "event_id_123", creatorId: "user_123" },
        data: { status: "CANCELLED" },
      }),
    );
  });
});
