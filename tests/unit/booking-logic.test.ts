import { calculateActiveOccupancy, MockBooking } from "@/lib/booking-logic";
import { describe, it, expect, vi } from "vitest";

describe("calculateActiveOccupancy - Testy krewędziowe", () => {
    it.each([
    {
        case: "Pusta lista rezerwacji",
        bookings: [],
        expected: 0,
    },
    {
        case: "Tylko potwierdzone rezerwacje",
        bookings: [
            { status: "CONFIRMED", guestsCount: 5, expiresAt: null},
            { status: "CONFIRMED", guestsCount: 3, expiresAt: null}
        ],
        expected: 8
    },
    {
        case: "Oczekiwanie (PENDING) przed czasem wygaśnięcia",
        bookings: [
            { status: "PENDING", guestsCount: 4, expiresAt: new Date(Date.now() + 60000)}
        ],
        expected: 4
    },
    {
        case: "Oczekiwanie (PENDING) po czasie wygaśnięcia",
        bookings: [
            { status: "PENDING", guestsCount: 4, expiresAt: new Date(Date.now() - 60000)}
        ],
        expected: 0
    }
    ])("$case 0> powinno zwrócić $expected", ({bookings, expected}) => {
        const result = calculateActiveOccupancy(bookings as MockBooking[]);
        expect(result).toBe(expected);
    });
});

const NOW = new Date("2025-12-22T15:00:00");

describe("calculateActiveOccupancy - Granice czasu", () => {
  it.each([
    { 
      case: "Sekunda przed wygaśnięciem", 
      now: NOW,
      expiresAt: new Date("2025-12-22T15:00:01"),
      expected: 1 
    },
    { 
      case: "Dokładnie w momencie wygaśnięcia", 
      now: NOW,
      expiresAt: new Date("2025-12-22T15:00:00"),
      expected: 1 
    },
    { 
      case: "Sekunda po wygaśnięciu", 
      now: NOW,
      expiresAt: new Date("2025-12-22T14:59:59"), 
      expected: 0 
    }
  ])("$case -> powinno zwrócić $expected", ({ now, expiresAt, expected }) => {
    vi.setSystemTime(now); 

    const bookings = [{ status: "PENDING", guestsCount: 1, expiresAt }];
    expect(calculateActiveOccupancy(bookings as any)).toBe(expected);
  });
});