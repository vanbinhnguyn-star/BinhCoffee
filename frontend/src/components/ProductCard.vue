<template>
  <div class="card h-100 shadow-sm">
    <!-- Bấm vào ảnh hoặc tên để xem chi tiết -->
    <router-link :to="`/products/${product._id}`">
      <img :src="product.image" :alt="product.name" class="card-img-top" style="height: 200px; object-fit: cover;" />
    </router-link>
    <div class="card-body d-flex flex-column">
      <router-link :to="`/products/${product._id}`" class="text-decoration-none text-dark">
        <h5 class="card-title">{{ product.name }}</h5>
      </router-link>
      <p class="card-text text-muted small">{{ product.category }}</p>
      <p class="fw-bold text-brown mb-2">{{ formatPrice(product.price) }}</p>

      <!-- Bấm vào rating cũng chuyển đến trang chi tiết để xem đánh giá -->
      <router-link :to="`/products/${product._id}`" class="rating text-warning small mb-3 text-decoration-none">
        ★ {{ product.rating }} ({{ product.reviews }} đánh giá)
      </router-link>

      <button @click="addToCart" class="btn btn-brown btn-sm mt-auto">Thêm vào giỏ</button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../store/cartStore';

const props = defineProps(['product']);
const cartStore = useCartStore();

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + ' ₫';
};

const addToCart = () => {
  cartStore.addItem(props.product);
};
</script>

<style scoped>
.text-brown {
  color: #6d4c41;
}
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
</style>