<template>
  <Navbar />
  <router-view />
  <Footer />
  <ChatWidget v-if="!auth.isAdmin" />
  <CartSidebar v-if="!auth.isAdmin" />
</template>

<script setup>
import { watch } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import ChatWidget from './components/ChatWidget.vue';
import CartSidebar from './components/CartSidebar.vue';
import { useAuthStore } from './store/authStore';
import { useWishlistStore } from './store/wishlistStore';

const auth = useAuthStore();
const wishlist = useWishlistStore();

// Tự load danh sách yêu thích mỗi khi đăng nhập/đăng xuất
watch(
  () => auth.token,
  (token) => {
    if (token) {
      wishlist.loadLikedIds(token);
    } else {
      wishlist.clear();
    }
  },
  { immediate: true }
);
</script>