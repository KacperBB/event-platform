"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RedirectTimer({ eventId }: { eventId: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/events/${eventId}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [eventId, router]);

  return (
    <p className="text-sm text-muted-foreground mt-4">
      Za chwilę zostaniesz przekierowany...
    </p>
  );
}
