"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Plus, Minus } from "lucide-react";

interface AddToCartButtonProps {
  event: {
    id: string;
    title: string;
    price: number;
    date: Date;
    address: string;
    maxCapacity: number | null;
  };
  spotsLeft: number;
}

export const AddToCartButton = ({ event, spotsLeft }: AddToCartButtonProps) => {
  const cart = useCart();
  const [count, setCount] = useState(1);

  const isSoldOut = spotsLeft <= 0;

  const onIncrease = () => {
    if (count < spotsLeft) {
      setCount(count + 1);
    }
  };

  const onDecrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const onAddToCart = () => {
    cart.addItem({
      id: event.id,
      title: event.title,
      price: event.price,
      date: event.date,
      location: event.address,
      quantity: count,
      maxQuantity: event.maxCapacity || undefined,
    });
  };

  if (isSoldOut) {
    return (
      <Button
        disabled
        className="w-full bg-slate-300 text-slate-500 cursor-not-allowed"
      >
        Wyczerpano miejsca
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-slate-100 rounded-xl p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDecrease}
          disabled={count <= 1}
          className="h-8 w-8 rounded-lg bg-white shadow-sm hover:bg-slate-50"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="font-bold text-lg w-12 text-center">{count}</span>

        <Button
          variant="ghost"
          size="icon"
          onClick={onIncrease}
          disabled={count >= spotsLeft}
          className="h-8 w-8 rounded-lg bg-white shadow-sm hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        onClick={onAddToCart}
        className="w-full h-12 text-lg font-bold bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-200 transition-all active:scale-[0.98]"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Dodaj do koszyka ({(event.price * count).toFixed(2)} zł)
      </Button>
    </div>
  );
};
