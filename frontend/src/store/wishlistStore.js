import { defineStore } from 'pinia';
import axios from 'axios';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    likedIds: new Set() // các productId đã thích, dùng Set để check nhanh O(1)
  }),
  actions: {
    isLiked(productId) {
      return this.likedIds.has(productId);
    },

    async loadLikedIds(token) {
      if (!token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('/api/wishlist/ids', config);
        this.likedIds = new Set(res.data);
      } catch {
        this.likedIds = new Set();
      }
    },

    async toggle(productId, token) {
      if (!token) return null;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.post(`/api/wishlist/${productId}/toggle`, {}, config);
        if (res.data.liked) {
          this.likedIds.add(productId);
        } else {
          this.likedIds.delete(productId);
        }
        return res.data.liked;
      } catch (err) {
        return null;
      }
    },

    clear() {
      this.likedIds = new Set();
    }
  }
});