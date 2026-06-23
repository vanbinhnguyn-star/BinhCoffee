import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  },
  actions: {
    addItem(product, quantity = 1) {
      const existing = this.items.find(i => i.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ ...product, quantity });
      }
    },
    removeItem(id) {
      this.items = this.items.filter(i => i.id !== id);
    },
    updateQuantity(id, qty) {
      const item = this.items.find(i => i.id === id);
      if (item) item.quantity = qty;
    },
    clearCart() {
      this.items = [];
    }
  }
});