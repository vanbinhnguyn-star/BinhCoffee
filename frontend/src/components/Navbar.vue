<template>
  <nav class="navbar">
    <div class="container nav-content">
      <router-link to="/" class="logo">☕ Bình Coffee</router-link>
      <div class="nav-links">
        <router-link to="/">Trang Chủ</router-link>
        <router-link to="/products">Sản Phẩm</router-link>
        <router-link to="/about">Về Chúng Tôi</router-link>
        <router-link to="/contact">Liên Hệ</router-link>
        <router-link to="/cart" class="cart-link">🛒 Giỏ Hàng <span v-if="cartTotal > 0" class="badge">{{ cartTotal }}</span></router-link>
        <router-link v-if="!auth.isLoggedIn" to="/login">Đăng Nhập</router-link>
        <a v-else href="#" @click.prevent="logout">Đăng Xuất</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const auth = useAuthStore();
const router = useRouter();

const cartTotal = computed(() => cartStore.totalItems);

const logout = () => {
  auth.logout();
  router.push('/');
};
</script>

<style scoped>
.navbar {
  background: #3e2723;
  color: #fff;
  padding: 15px 0;
}
.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
}
.nav-links a {
  margin-left: 20px;
  color: #fff;
  transition: 0.3s;
}
.nav-links a:hover {
  color: #d7a86e;
}
.cart-link {
  position: relative;
}
.badge {
  background: #d7a86e;
  color: #3e2723;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 0.7rem;
  margin-left: 5px;
}
</style>