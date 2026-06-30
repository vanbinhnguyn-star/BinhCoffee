import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isOpen: false // ✅ trạng thái mở/đóng sidebar
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  },
  actions: {
    _getId(product) {
      return product._id || product.id;
    },

    addItem(product, quantity = 1) {
      const pid = this._getId(product);
      const existing = this.items.find(i => this._getId(i) === pid);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ ...product, _id: pid, id: pid, quantity });
      }
    },

    removeItem(id) {
      this.items = this.items.filter(i => this._getId(i) !== id);
    },

    updateQuantity(id, qty) {
      const item = this.items.find(i => this._getId(i) === id);
      if (item) item.quantity = qty;
    },

    clearCart() {
      this.items = [];
    },

    openCart() { this.isOpen = true; },
    closeCart() { this.isOpen = false; },
    toggleCart() { this.isOpen = !this.isOpen; }
  }
});