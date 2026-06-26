<template>
  <div class="container my-5">
    <h1>Quản trị</h1>
    <ul class="nav nav-tabs mt-4">
      <li class="nav-item">
        <router-link class="nav-link" :class="{ active: tab === 'products' }" to="/admin/products">Sản phẩm</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :class="{ active: tab === 'orders' }" to="/admin/orders">Đơn hàng</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :class="{ active: tab === 'chat' }" to="/admin/chat">
          💬 Chat
          <span v-if="unreadCount > 0" class="badge bg-danger ms-1">{{ unreadCount }}</span>
        </router-link>
      </li>
    </ul>
    <router-view />
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminChatStore } from '../store/adminChatStore';

const route = useRoute();
const router = useRouter();
const adminChat = useAdminChatStore();

const tab = computed(() => route.path.split('/').pop());
const unreadCount = computed(() => adminChat.totalUnread);

watch(tab, (newTab) => {
  if (['products', 'orders', 'chat'].includes(newTab)) {
    localStorage.setItem('adminLastTab', newTab);
  }
});

if (route.path === '/admin' || route.path === '/admin/') {
  const lastTab = localStorage.getItem('adminLastTab') || 'products';
  router.replace(`/admin/${lastTab}`);
}
</script>