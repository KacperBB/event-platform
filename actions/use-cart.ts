import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";




export interface CartItem {
    id: string;
    title: string;
    price: number;
    date?: Date | null; 
    location: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (data: CartItem) => void;
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
          return toast.info("Ten bilet jest już w koszyku.");
        }

        set({ items: [...get().items, data] });
        toast.success("Dodano bilet do koszyka! 🛒");
      },

      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success("Usunięto bilet.");
      },

      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // Klucz w LocalStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);