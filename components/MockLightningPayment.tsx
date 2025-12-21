"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { simulatePayment } from "@/actions/simulate-payment";

export const MockLightningPayment = ({ bookingId, amount } : { bookingId: string, amount: number}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePay = async () => {
        setLoading(true);
        // Network simulation

        const mode = localStorage.getItem("dev_payment_mode") || "success";
        const shouldSucced = mode === "success";
        
        setTimeout( async() => {
            const res = await simulatePayment(bookingId, shouldSucced);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Płatność się powiodła");
                router.refresh(); 
            }
            setLoading(false);
        }, 1500 );
    };

return (
    <div className="space-y-4">
      <div className="bg-white p-4 border rounded-lg font-mono text-xs break-all">
        lnbc{amount}u1p1z... (MOCK_INVOICE)
      </div>
      <Button onClick={handlePay} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600">
        {loading ? "Przetwarzanie płatności..." : `Zapłać ${amount} sats`}
      </Button>
    </div>
  );
}