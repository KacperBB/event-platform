import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  date?: Date | null;
  location: string;
  quantity: number;
  maxQuantity?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          if (
            existingItem.maxQuantity &&
            existingItem.quantity + 1 > existingItem.maxQuantity
          ) {
            return toast.error("Brak większej liczby miejsc.");
          }

          set({
            items: currentItems.map((item) =>
              item.id === data.id
                ? { ...item, quantity: item.quantity + (data.quantity || 1) }
                : item,
            ),
          });
          toast.success("Zaktualizowano ilość w koszyku");
        } else {
          set({
            items: [...get().items, { ...data, quantity: data.quantity || 1 }],
          });
          toast.success("Dodano do koszyka");
        }
      },

      decreaseItem: (id: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === id);

        if (existingItem?.quantity === 1) {
          set({ items: currentItems.filter((item) => item.id !== id) });
        } else {
          set({
            items: currentItems.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
            ),
          });
        }
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.success("Usunięto z koszyka");
      },

      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
