"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { simulatePayment } from "@/actions/simulate-payment";
import { Zap, Loader2 } from "lucide-react";

export const MockLightningPayment = ({
  bookingId,
  amount,
}: {
  bookingId: string;
  amount: number;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    setLoading(true);

    const mode = localStorage.getItem("dev_payment_mode") || "success";
    const shouldSucceed = mode === "success";

    // simulate latency (1.5s)
    setTimeout(async () => {
      const res = await simulatePayment(bookingId, shouldSucceed);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("⚡ Płatność Lightning przyjęta!");
        router.refresh();
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-950 text-green-400 p-4 border border-slate-800 rounded-xl font-mono text-xs break-all shadow-inner">
        <span className="text-slate-500 select-none">$ </span>
        lnbc{amount}u1p1z...{bookingId.substring(0, 8)}
      </div>

      <Button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-xl transition-all active:scale-95"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Przetwarzanie...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4 fill-white" />
            Zapłać {amount} sats
          </>
        )}
      </Button>

      <p className="text-[10px] text-center text-muted-foreground">
        Symulacja modułu HTTP 402 Payment Required
      </p>
    </div>
  );
};
