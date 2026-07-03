<template>
  <!-- Ẩn Navbar khi ở trang admin vì admin có sidebar riêng -->
  <Navbar v-if="!isAdminRoute" />
  <router-view />
  <Footer v-if="!isAdminRoute" />
  <ChatWidget v-if="!auth.isAdmin" />
  <CartSidebar v-if="!auth.isAdmin" />
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import ChatWidget from './components/ChatWidget.vue';
import CartSidebar from './components/CartSidebar.vue';
import { useAuthStore } from './store/authStore';
import { useWishlistStore } from './store/wishlistStore';

const auth = useAuthStore();
const wishlist = useWishlistStore();
const route = useRoute();

// Ẩn navbar/footer khi đang ở trang /admin/*
const isAdminRoute = computed(() => route.path.startsWith('/admin'));

watch(
  () => auth.token,
  (token) => {
    if (token) wishlist.loadLikedIds(token);
    else wishlist.clear();
  },
  { immediate: true }
);
</script>