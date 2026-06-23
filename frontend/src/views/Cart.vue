<template>
  <div class="cart container">
    <h1>Giỏ Hàng</h1>
    <div v-if="cart.items.length === 0">Giỏ hàng trống</div>
    <div v-else>
      <CartItem v-for="item in cart.items" :key="item.id" :item="item" @update="updateQty" @remove="removeItem" />
      <div class="total">
        <strong>Tổng cộng: {{ formatPrice(cart.totalPrice) }}</strong>
        <button class="btn checkout">Thanh toán</button>
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