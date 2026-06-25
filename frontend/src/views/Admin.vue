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
    </ul>
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const tab = route.path.split('/').pop();
</script>