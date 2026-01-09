"use client";

import { Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrder } from "@/actions/create-order";

export const CartSheet = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  // HYDRATION FIX: 
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Obliczanie sumy
  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const handleCheckout = () => {
    startTransition(async () => {
      const eventIds = cart.items.map((item) => item.id);

      const result = await createOrder(eventIds);

      if(result.error) {
        toast.error(result.error)
      } else if (result.success && result.orderId) {
        toast.success("Zamówienie utworzone! Przekierowywanie...");
        cart.removeAll(); 
        setOpen(false);  
        router.push(`/checkout/${result.orderId}`);
      }
    })
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <ShoppingBag className="h-5 w-5" />
          {cart.items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
              {cart.items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Twój Koszyk</SheetTitle>
        </SheetHeader>

        <div className="flex-1 mt-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
              <ShoppingBag className="h-12 w-12 opacity-20" />
              <p>Koszyk jest pusty.</p>
            </div>
          ) : (
            <ScrollArea className="h-[60vh] pr-4">
              <ul className="space-y-4">
                {cart.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-start bg-slate-50 p-4 rounded-xl border"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.date
                          ? format(new Date(item.date), "dd.MM.yyyy")
                          : "Bilet otwarty"}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium text-sky-600">
                        {Number(item.price) === 0
                          ? "Bezpłatny"
                          : `${item.price} PLN`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                      onClick={() => cart.removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="space-y-4 pt-4">
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Razem:</span>
              <span>{totalPrice} PLN</span>
            </div>
<Button 
    className="w-full h-12 rounded-xl text-md bg-sky-600 hover:bg-sky-700"
    onClick={handleCheckout}
    disabled={isPending}
  >
    {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
    Przejdź do kasy
  </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
