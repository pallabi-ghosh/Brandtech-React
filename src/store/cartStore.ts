import { create } from 'zustand';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, size?: string | number, color?: string) => void;
  removeItem: (productId: number, size?: string | number, color?: string) => void;
  updateQuantity: (productId: number, quantity: number, size?: string | number, color?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (product, quantity, size, color) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id && item.selectedSize === size && item.selectedColor === color
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { ...product, quantity, selectedSize: size, selectedColor: color }],
      };
    }),

  removeItem: (productId, size?, color?) =>
    set((state) => ({
      items: state.items.filter(
        (item) =>
          !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
      ),
    })),

  updateQuantity: (productId, quantity, size?, color?) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity }
          : item
      ),
    })),

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },
}));
