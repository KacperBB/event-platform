"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner';
import { Button } from './ui/button';
import { createBooking } from '@/actions/create-booking';
import { Input } from './ui/input';

interface BookingButtonProps {
    eventId: string;
    disabled: boolean;
    spotsLeft: number;
}

export const BookingButton = ({ eventId, disabled, spotsLeft }:  BookingButtonProps) => {
    const [isPending, startTransition] = useTransition();
    const [count, setCount] = useState(1);
    const router = useRouter();

    const handleBooking = () => {
        if (count > spotsLeft) {
            toast.error("Nie ma tylu wolnych miejsc!");
            return;
        }
        startTransition(async () => {
            const result = await createBooking(eventId, count);

            if (result.error) {
                toast.error(result.error);
            }

            if (result.success) {
                toast.success(result.success);
                router.push(`/events/${eventId}/ticket/${result.bookingId}`)
            }
        });
    };

return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Liczba osób:</p>
        <Input 
          type="number" 
          min={1} 
          max={spotsLeft} 
          value={count} 
          onChange={(e) => setCount(parseInt(e.target.value))}
          className="w-20"
          disabled={disabled || isPending}
        />
      </div>
      <Button 
        size="lg" 
        onClick={handleBooking} 
        disabled={disabled || isPending || count < 1}
      >
        {isPending ? "Rezerwowanie..." : disabled ? "Brak miejsc" : `Zarezerwuj dla ${count}`}
      </Button>
    </div>
  );
};