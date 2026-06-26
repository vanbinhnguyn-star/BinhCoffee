<template>
  <div class="card mb-3 shadow-sm">
    <div class="card-body">
      <div class="d-flex gap-3">
        <img :src="item.image" :alt="item.name" class="rounded" style="width: 100px; height: 100px; object-fit: cover;">
        <div class="flex-grow-1">
          <h5 class="card-title">{{ item.name }}</h5>
          <p class="text-brown fw-bold mb-2">{{ formatPrice(item.price) }}</p>
          <div class="d-flex gap-2 align-items-center">
            <button @click="decrease" class="btn btn-sm btn-outline-secondary">−</button>
            <span class="px-3">{{ item.quantity }}</span>
            <button @click="increase" class="btn btn-sm btn-outline-secondary">+</button>
          </div>
        </div>
        <button @click="$emit('remove', itemId)" class="btn btn-close text-danger"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['item']);
const emit = defineEmits(['update', 'remove']);

// Dùng computed để lấy id thống nhất
const itemId = computed(() => props.item._id || props.item.id);

const formatPrice = (p) => p.toLocaleString('vi-VN') + ' ₫';

const increase = () => {
  emit('update', itemId.value, props.item.quantity + 1);
};

const decrease = () => {
  if (props.item.quantity > 1) {
    emit('update', itemId.value, props.item.quantity - 1);
  } else {
    emit('remove', itemId.value);
  }
};
</script>

<style scoped>
.text-brown {
  color: #6d4c41;
}
</style>