<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #3e2723;">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold fs-5">☕ Bình Coffee</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto gap-2">
          <router-link to="/" class="nav-link">Trang Chủ</router-link>
          <router-link to="/products" class="nav-link">Sản Phẩm</router-link>
          <div class="nav-item dropdown-container">
            <router-link to="/about" class="nav-link">Về Chúng Tôi</router-link>
            <div class="mega-menu">
              <div class="mega-menu-grid">
                <div class="mega-menu-column">
                  <h6>CÀ PHÊ</h6>
                  <router-link :to="{ path: '/about', hash: '#coffee-journey' }" class="dropdown-link">Hành trình tách cà phê</router-link>
                  <router-link :to="{ path: '/about', hash: '#coffee-beans' }" class="dropdown-link">Hạt cà phê Bình Coffee</router-link>
                  <router-link :to="{ path: '/about', hash: '#brewing-art' }" class="dropdown-link">Nghệ thuật pha chế</router-link>
                </div>
                <div class="mega-menu-column">
                  <h6>VỀ BÌNH COFFEE</h6>
                  <router-link :to="{ path: '/about', hash: '#company' }" class="dropdown-link">Giới thiệu công ty</router-link>
                  <router-link :to="{ path: '/about', hash: '#gallery' }" class="dropdown-link">Thư viện hình ảnh</router-link>
                  <router-link :to="{ path: '/about', hash: '#contact' }" class="dropdown-link">Liên hệ</router-link>
                  <router-link :to="{ path: '/about', hash: '#menu' }" class="dropdown-link">Hình ảnh menu</router-link>
                </div>
              </div>
            </div>
          </div>
          <router-link to="/contact" class="nav-link">Liên Hệ</router-link>
          <router-link to="/cart" class="nav-link position-relative">
            🛒 Giỏ Hàng
            <span v-if="cartTotal > 0" class="badge bg-warning text-dark badge-gold position-absolute top-0 start-100 translate-middle">{{ cartTotal }}</span>
          </router-link>
          <router-link v-if="!auth.isLoggedIn" to="/login" class="nav-link">Đăng Nhập</router-link>
          <a v-else href="#" @click.prevent="logout" class="nav-link">Đăng Xuất</a>
        </div>
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
.navbar-nav .nav-link {
  color: #fff !important;
  transition: color 0.3s;
  margin: 0 5px;
}

.navbar-nav .nav-link:hover {
  color: #d7a86e !important;
}

.badge-gold {
  background-color: #d7a86e !important;
  color: #3e2723 !important;
}

.dropdown-container {
  position: relative;
}

.mega-menu {
  pointer-events: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 420px;
  margin-top: 4px;
  padding: 22px 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(14px);
  transition: opacity 180ms ease, transform 180ms ease, visibility 180ms ease;
}

.dropdown-container:hover .mega-menu,
.dropdown-container:focus-within .mega-menu {
  pointer-events: auto;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.mega-menu-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.mega-menu-column h6 {
  margin-bottom: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #264d24;
}

.dropdown-link {
  display: block;
  margin-bottom: 10px;
  color: #3e2723;
  font-size: 0.93rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.dropdown-link:hover {
  color: #7b4f31;
}
</style>