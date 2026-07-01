<template>
  <div class="card h-100 shadow-sm position-relative">
    <!-- Nút tim yêu thích -->
    <button
      v-if="auth.isLoggedIn && !auth.isAdmin"
      class="btn-wishlist"
      :class="{ liked: wishlist.isLiked(product._id) }"
      @click.prevent="toggleLike"
    >
      {{ wishlist.isLiked(product._id) ? '❤️' : '🤍' }}
    </button>

    <router-link :to="`/products/${product._id}`">
      <img :src="product.image" :alt="product.name" class="card-img-top" style="height: 200px; object-fit: cover;" />
    </router-link>
    <div class="card-body d-flex flex-column">
      <router-link :to="`/products/${product._id}`" class="text-decoration-none text-dark">
        <h5 class="card-title">{{ product.name }}</h5>
      </router-link>
      <p class="card-text text-muted small">{{ product.category }}</p>
      <p class="fw-bold text-brown mb-2">{{ formatPrice(product.price) }}</p>

      <router-link :to="`/products/${product._id}`" class="rating text-warning small mb-3 text-decoration-none">
        ★ {{ product.rating }} ({{ product.reviews }} đánh giá)
      </router-link>

      <button @click="addToCart" class="btn btn-brown btn-sm mt-auto">Thêm vào giỏ</button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';

const props = defineProps(['product']);
const cartStore = useCartStore();
const wishlist = useWishlistStore();
const auth = useAuthStore();

const formatPrice = (price) => price.toLocaleString('vi-VN') + ' ₫';

const addToCart = () => {
  cartStore.addItem(props.product);
};

const toggleLike = async () => {
  await wishlist.toggle(props.product._id, auth.token);
};
</script>

<style scoped>
.text-brown { color: #6d4c41; }
.btn-brown {
  background-color: #6d4c41;
  border-color: #6d4c41;
  color: white;
}
.btn-brown:hover {
  background-color: #8d6242;
  border-color: #8d6242;
  color: white;
}
.btn-wishlist {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  transition: transform 0.15s;
}
.btn-wishlist:hover { transform: scale(1.15); }
.btn-wishlist.liked { animation: pop 0.3s ease; }
@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
</style>