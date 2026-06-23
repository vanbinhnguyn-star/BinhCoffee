<template>
  <div class="cart-item">
    <img :src="item.image" :alt="item.name" />
    <div class="details">
      <h4>{{ item.name }}</h4>
      <p>{{ formatPrice(item.price) }}</p>
      <div class="qty-control">
        <button @click="decrease">-</button>
        <span>{{ item.quantity }}</span>
        <button @click="increase">+</button>
      </div>
    </div>
    <button class="remove" @click="$emit('remove', item.id)">✕</button>
  </div>
</template>

<script setup>
const props = defineProps(['item']);
const emit = defineEmits(['update', 'remove']);

const formatPrice = (p) => p.toLocaleString('vi-VN') + ' ₫';

const increase = () => {
  emit('update', props.item.id, props.item.quantity + 1);
};
const decrease = () => {
  if (props.item.quantity > 1) {
    emit('update', props.item.id, props.item.quantity - 1);
  } else {
    emit('remove', props.item.id);
  }
};
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
.cart-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
}
.details {
  flex: 1;
}
.qty-control button {
  background: #eee;
  border: none;
  padding: 2px 10px;
  margin: 0 5px;
  cursor: pointer;
}
.remove {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #c62828;
}
</style>