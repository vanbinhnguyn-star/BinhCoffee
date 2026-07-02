<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #3e2723;">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold fs-5">☕ Bình Coffee</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto gap-2 align-items-center">
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

          <!-- Chưa đăng nhập -->
          <router-link v-if="!auth.isLoggedIn" to="/login" class="nav-link">Đăng Nhập</router-link>

          <!-- Đã đăng nhập: Giỏ hàng (chỉ user) + Dropdown tài khoản -->
          <template v-else>
            <!-- Giỏ hàng - chỉ user -->
            <a v-if="!auth.isAdmin" href="#" class="nav-link position-relative" @click.prevent="cartStore.openCart()">
              🛒
              <span v-if="cartTotal > 0" class="badge bg-warning text-dark badge-gold position-absolute top-0 start-100 translate-middle">
                {{ cartTotal }}
              </span>
            </a>

            <!-- Dropdown tài khoản -->
            <div class="account-dropdown-container">
              <button class="btn-account">
                <span class="account-icon">👤</span>
                <span class="account-name">{{ auth.user?.name }}</span>
              </button>

              <div class="account-menu">
                <!-- Header dropdown -->
                <div class="account-menu-header">
                  <div class="fw-semibold">{{ auth.user?.name }}</div>
                  <div class="text-muted small">{{ auth.user?.email }}</div>
                </div>
                <div class="account-menu-divider"></div>

                <!-- Menu user -->
                <template v-if="!auth.isAdmin">
                  <router-link to="/profile" class="account-menu-item">
                    👤 Hồ sơ tài khoản
                  </router-link>
                  <router-link to="/my-orders" class="account-menu-item">
                    📦 Đơn hàng của tôi
                  </router-link>
                  <router-link to="/wishlist" class="account-menu-item">
                    ❤️ Yêu thích
                  </router-link>
                  <a href="#" class="account-menu-item" @click.prevent="cartStore.openCart()">
                    🛒 Giỏ hàng
                    <span v-if="cartTotal > 0" class="badge bg-danger ms-1">{{ cartTotal }}</span>
                  </a>
                </template>

                <!-- Menu admin -->
                <template v-else>
                  <router-link to="/profile" class="account-menu-item">
                    👤 Hồ sơ tài khoản
                  </router-link>
                  <router-link to="/admin" class="account-menu-item">
                    ⚙️ Trang quản trị
                  </router-link>
                </template>

                <div class="account-menu-divider"></div>
                <a href="#" class="account-menu-item text-danger" @click.prevent="logout">
                  🚪 Đăng xuất
                </a>
              </div>
            </div>
          </template>

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
  margin: 0 4px;
  cursor: pointer;
}
.navbar-nav .nav-link:hover { color: #d7a86e !important; }

.badge-gold {
  background-color: #d7a86e !important;
  color: #3e2723 !important;
}

/* ============ Mega menu ============ */
.dropdown-container { position: relative; }
.mega-menu {
  pointer-events: none;
  position: absolute;
  top: 100%; left: 0;
  width: 420px;
  margin-top: 4px;
  padding: 22px 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(14px);
  transition: opacity 180ms ease, transform 180ms ease, visibility 180ms ease;
  z-index: 1000;
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
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}
.mega-menu-column h6 { font-weight: 700; color: #3e2723; margin-bottom: 12px; }
.dropdown-link {
  display: block;
  margin-bottom: 10px;
  color: #3e2723;
  font-size: 0.93rem;
  text-decoration: none;
  transition: color 0.2s;
}
.dropdown-link:hover { color: #6d4c41; }

/* ============ Account dropdown ============ */
.account-dropdown-container {
  position: relative;
}
.btn-account {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 5px 12px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-account:hover { background: rgba(255,255,255,0.2); }
.account-name {
  font-size: 0.88rem;
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.account-icon { font-size: 1rem; }

.account-menu {
  pointer-events: none;
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: opacity 180ms ease, transform 180ms ease, visibility 180ms ease;
  z-index: 1000;
  overflow: hidden;
}
.account-dropdown-container:hover .account-menu,
.account-dropdown-container:focus-within .account-menu {
  pointer-events: auto;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.account-menu-header {
  padding: 14px 16px 10px;
}
.account-menu-divider {
  height: 1px;
  background: #f0ebe6;
  margin: 4px 0;
}
.account-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: #3e2723;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.15s;
}
.account-menu-item:hover { background: #f9f4f0; color: #6d4c41; }
.account-menu-item.text-danger { color: #c0392b !important; }
.account-menu-item.text-danger:hover { background: #fdf0ef; }

@media (max-width: 991.98px) {
  .mega-menu {
    position: static; width: 100%;
    opacity: 1; visibility: visible;
    transform: none; pointer-events: auto;
    box-shadow: none; border-radius: 0;
    background: #f8f9fa; margin-top: 0;
  }
  .mega-menu-grid { grid-template-columns: 1fr; gap: 15px; }
  .account-menu {
    position: static; width: 100%;
    opacity: 1; visibility: visible;
    transform: none; pointer-events: auto;
    box-shadow: none; border-radius: 0;
    background: #f8f9fa;
  }
}
</style>