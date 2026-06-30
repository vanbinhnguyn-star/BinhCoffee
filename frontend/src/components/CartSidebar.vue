<template>
  <!-- Lớp phủ tối phía sau -->
  <div
    v-if="cart.isOpen"
    class="cart-backdrop"
    @click="cart.closeCart()"
  ></div>

  <!-- Sidebar giỏ hàng -->
  <div class="cart-sidebar" :class="{ open: cart.isOpen }">
    <div class="cart-header">
      <h5 class="mb-0">Giỏ hàng của bạn</h5>
      <button class="btn-close-cart" @click="cart.closeCart()">✕</button>
    </div>

    <div class="cart-body">
      <div v-if="cart.items.length === 0" class="text-center text-muted py-5">
        🛒 Giỏ hàng trống
      </div>

      <div v-for="item in cart.items" :key="item._id || item.id" class="cart-item">
        <img :src="item.image" :alt="item.name" />
        <div class="cart-item-info">
          <div class="cart-item-name">{{ item.name }}</div>
          <div class="cart-item-qty-row">
            <div class="qty-control">
              <button @click="decrease(item)">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="increase(item)">+</button>
            </div>
          </div>
          <div class="cart-item-price">{{ formatPrice(item.price) }} / chiếc</div>
        </div>
        <button class="btn-remove" @click="cart.removeItem(item._id || item.id)">Xóa</button>
      </div>
    </div>

    <div v-if="cart.items.length > 0" class="cart-footer">
      <div class="cart-total">
        <span>Tạm tính:</span>
        <strong>{{ formatPrice(cart.totalPrice) }}</strong>
      </div>
      <div class="cart-actions">
        <router-link to="/checkout" class="btn btn-brown flex-grow-1" @click="cart.closeCart()">
          Thanh toán
        </router-link>
        <button class="btn btn-outline-secondary" @click="cart.clearCart()">
          Xóa giỏ hàng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../store/cartStore';

const cart = useCartStore();

const formatPrice = (p) => (p || 0).toLocaleString('vi-VN') + ' ₫';

const increase = (item) => {
  cart.updateQuantity(item._id || item.id, item.quantity + 1);
};
const decrease = (item) => {
  const id = item._id || item.id;
  if (item.quantity > 1) {
    cart.updateQuantity(id, item.quantity - 1);
  } else {
    cart.removeItem(id);
  }
};
</script>

<style scoped>
.cart-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1040;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: -420px;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: white;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 24px rgba(0,0,0,0.15);
  transition: right 0.3s ease;
}
.cart-sidebar.open {
  right: 0;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #eee;
}
.btn-close-cart {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #555;
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}
.cart-item img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}
.cart-item-info {
  flex: 1;
  min-width: 0;
}
.cart-item-name {
  font-weight: 600;
  font-size: 0.92rem;
  margin-bottom: 4px;
}
.cart-item-qty-row {
  margin-bottom: 4px;
}
.qty-control {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}
.qty-control button {
  width: 26px;
  height: 26px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 14px;
}
.qty-control button:hover { background: #e8e0db; }
.qty-control span {
  width: 30px;
  text-align: center;
  font-size: 0.88rem;
}
.cart-item-price {
  font-size: 0.82rem;
  color: #888;
}
.btn-remove {
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 0.78rem;
  color: #c0392b;
  cursor: pointer;
  flex-shrink: 0;
}
.btn-remove:hover {
  background: #fbeaea;
  border-color: #c0392b;
}

.cart-footer {
  padding: 16px 20px 20px;
  border-top: 1px solid #eee;
}
.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.05rem;
  margin-bottom: 14px;
}
.cart-actions {
  display: flex;
  gap: 8px;
}
.btn-brown {
  background-color: var(--coffee-brown, #6d4c41);
  border-color: var(--coffee-brown, #6d4c41);
  color: white;
  text-align: center;
}
.btn-brown:hover {
  background-color: var(--coffee-light, #8d6242);
  color: white;
}

@media (max-width: 480px) {
  .cart-sidebar { max-width: 100%; right: -100%; }
}
</style>