<template>
  <Navbar />
  <router-view />
  <Footer />
  <!-- Chat widget: chỉ hiện với user thường, ẩn với admin -->
  <ChatWidget v-if="!auth.isAdmin" />
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import ChatWidget from './components/ChatWidget.vue';
import { useAuthStore } from './store/authStore';

const auth = useAuthStore();
</script>