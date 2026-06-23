<template>
  <div class="cart-item">
    <img :src="item.image" alt="" />
    <div class="details">
      <h4>{{ item.name }}</h4>
      <p>{{ formatPrice(item.price) }}</p>
      <div>
        <button @click="decrease">-</button>
        <span>{{ item.quantity }}</span>
        <button @click="increase">+</button>
      </div>
    </div>
    <button class="remove" @click="$emit('remove', item.id)">✕</button>
  </div>
</template>

<script setup>
defineProps(['item']);
defineEmits(['update', 'remove']);

const formatPrice = (p) => p.toLocaleString('vi-VN') + ' ₫';

const increase = () => {
  // emit update với số lượng mới
};
const decrease = () => {
  // tương tự
};
</script>