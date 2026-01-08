export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  date: Date;
  organizerId: string;
}

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}
