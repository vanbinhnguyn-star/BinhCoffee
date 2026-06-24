<template>
  <div class="container my-5">
    <h1 class="mb-4">Giỏ Hàng</h1>
    <div v-if="cart.items.length === 0" class="alert alert-info">
      Giỏ hàng trống
    </div>
    <div v-else>
      <CartItem v-for="item in cart.items" :key="item.id" :item="item" @update="updateQty" @remove="removeItem" />
      <div class="card mt-4 p-4 bg-light">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mb-0">Tổng cộng: <span class="text-brown fw-bold">{{ formatPrice(cart.totalPrice) }}</span></h4>
          <button class="btn btn-brown btn-lg">Thanh toán</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../store/cartStore';
import CartItem from '../components/CartItem.vue';

const cart = useCartStore();

const formatPrice = (price) => price.toLocaleString('vi-VN') + ' ₫';
const updateQty = (id, qty) => cart.updateQuantity(id, qty);
const removeItem = (id) => cart.removeItem(id);
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
}
</style>