"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { simulatePayment } from "@/actions/simulate-payment";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";

export const OrderPaymentForm = ({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    setLoading(true);

    const mode = localStorage.getItem("dev_payment_mode") || "success";
    const shouldSucceed = mode === "success";

    setTimeout(async () => {
      const res = await simulatePayment(orderId, shouldSucceed);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Zamówienie opłacone pomyślnie! ⚡");
        router.refresh();
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border space-y-4">
      <div className="flex justify-between items-center text-sm font-medium">
        <span>Bramka płatności:</span>
        <span className="text-orange-600 flex items-center gap-1">
          <Zap className="h-3 w-3" /> HTTP 402 Mock
        </span>
      </div>

      <div className="text-3xl font-bold text-slate-900 text-center py-4 border-y border-slate-200 bg-white rounded-lg">
        {amount} PLN
      </div>

      <Button
        onClick={handlePay}
        disabled={loading}
        className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800 transition-all active:scale-95"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Przetwarzanie...
          </>
        ) : (
          "Potwierdź i zapłać"
        )}
      </Button>
    </div>
  );
};
