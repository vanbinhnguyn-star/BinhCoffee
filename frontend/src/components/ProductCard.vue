<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.name" />
    <div class="info">
      <h3>{{ product.name }}</h3>
      <p class="category">{{ product.category }}</p>
      <p class="price">{{ formatPrice(product.price) }}</p>
      <div class="rating">★ {{ product.rating }} ({{ product.reviews }} đánh giá)</div>
      <button class="btn add-cart" @click="addToCart">Thêm vào giỏ</button>
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
.product-card {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: 0.3s;
}
.product-card:hover {
  transform: translateY(-5px);
}
.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.info {
  padding: 15px;
}
.info h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}
.category {
  color: #888;
  font-size: 0.9rem;
}
.price {
  font-weight: bold;
  color: #6d4c41;
  margin: 10px 0;
}
.rating {
  font-size: 0.9rem;
  color: #f9a825;
}
.add-cart {
  margin-top: 10px;
  width: 100%;
}
</style>