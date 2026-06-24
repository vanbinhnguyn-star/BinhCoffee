<template>
  <div class="card mb-3 shadow-sm">
    <div class="card-body">
      <div class="d-flex gap-3">
        <img :src="item.image" alt="" class="rounded" style="width: 100px; height: 100px; object-fit: cover;">
        <div class="flex-grow-1">
          <h5 class="card-title">{{ item.name }}</h5>
          <p class="text-brown fw-bold mb-2">{{ formatPrice(item.price) }}</p>
          <div class="d-flex gap-2 align-items-center">
            <button @click="decrease" class="btn btn-sm btn-outline-secondary">−</button>
            <span class="px-3">{{ item.quantity }}</span>
            <button @click="increase" class="btn btn-sm btn-outline-secondary">+</button>
          </div>
        </div>
        <button @click="$emit('remove', item.id)" class="btn btn-close text-danger"></button>
      </div>
    </div>
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

<style scoped>
.text-brown {
  color: #6d4c41;
}
</style>