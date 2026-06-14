import { create } from 'zustand';

export type CartItemType = {
  menuItemId: string;
  name: string;
  nameHindi?: string;
  price: number;
  quantity: number;
  isVeg: boolean;
};

interface CartState {
  items: CartItemType[];
  addItem: (item: Omit<CartItemType, 'quantity'>) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, delta: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.menuItemId === item.menuItemId);
    if (existing) {
      return {
        items: state.items.map(i => 
          i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (menuItemId) => set((state) => ({
    items: state.items.filter(i => i.menuItemId !== menuItemId)
  })),
  updateQuantity: (menuItemId, delta) => set((state) => ({
    items: state.items.map(i => {
      if (i.menuItemId === menuItemId) {
        const newQuantity = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQuantity };
      }
      return i;
    }).filter(i => i.quantity > 0)
  })),
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
