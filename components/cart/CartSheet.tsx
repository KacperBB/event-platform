"use client";

import { ShoppingBag, Trash2, Plus, Minus, Loader2 } from "lucide-react";
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  const totalItemsCount = cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const handleCheckout = () => {
    startTransition(async () => {
      const flattenedEventIds = cart.items.flatMap((item) =>
        Array(item.quantity).fill(item.id),
      );

      const result = await createOrder(flattenedEventIds);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.orderId) {
        toast.success("Zamówienie utworzone! Przekierowywanie...");
        cart.removeAll();
        setOpen(false);
        router.push(`/checkout/${result.orderId}`);
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-slate-200"
        >
          <ShoppingBag className="h-5 w-5 text-slate-700" />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white">
              {totalItemsCount}
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
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
              <div className="bg-slate-50 p-6 rounded-full">
                <ShoppingBag className="h-10 w-10 text-slate-300" />
              </div>
              <p>Twój koszyk jest pusty.</p>
            </div>
          ) : (
            <ScrollArea className="h-[60vh] pr-4">
              <ul className="space-y-4">
                {cart.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 bg-white p-4 rounded-xl border shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.date
                            ? format(new Date(item.date), "dd.MM.yyyy")
                            : "Bilet otwarty"}
                        </p>
                      </div>
                      <p className="font-bold text-sky-600">
                        {(item.price * item.quantity).toFixed(2)} PLN
                      </p>
                    </div>

                    <Separator />

                    {/* Kontrolki Ilości w Koszyku */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => cart.decreaseItem(item.id)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => cart.addItem({ ...item, quantity: 1 })}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2 text-xs"
                        onClick={() => cart.removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Usuń
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="space-y-4 pt-4 bg-white">
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Razem:</span>
              <span>{totalPrice.toFixed(2)} PLN</span>
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
