"use client";

import { ShoppingCart, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/actions/use-cart";

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

  // Sprawdzamy, czy bilet już jest w koszyku
  const isInCart = cart.items.some((item) => item.id === event.id);
  const isSoldOut = spotsLeft <= 0;

  const handleAddToCart = () => {
    cart.addItem({
      id: event.id,
      title: event.title,
      price: event.price,
      date: event.date,
      location: event.address,
    });
  };

  if (isSoldOut) {
    return (
      <Button
        disabled
        className="w-full bg-slate-200 text-slate-500 cursor-not-allowed"
      >
        Wyprzedane
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isInCart}
      className="w-full h-12 text-lg rounded-xl bg-sky-600 hover:bg-sky-700 transition-all shadow-md active:scale-95"
    >
      {isInCart ? (
        <>
          <Ticket className="mr-2 h-5 w-5" />
          Już w koszyku
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          {event.price > 0
            ? `Dodaj do koszyka (${event.price} PLN)`
            : "Odbierz darmowy bilet"}
        </>
      )}
    </Button>
  );
};
