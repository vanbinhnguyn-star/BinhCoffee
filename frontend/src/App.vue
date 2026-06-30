<template>
  <Navbar />
  <router-view />
  <Footer />
  <ChatWidget v-if="!auth.isAdmin" />
  <CartSidebar v-if="!auth.isAdmin" />
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import ChatWidget from './components/ChatWidget.vue';
import CartSidebar from './components/CartSidebar.vue';
import { useAuthStore } from './store/authStore';

const auth = useAuthStore();
</script>