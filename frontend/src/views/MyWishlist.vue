<template>
  <div class="container my-5">
    <h2 class="mb-4">Sản phẩm yêu thích</h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-secondary"></div>
    </div>

    <div v-else-if="items.length === 0" class="text-center text-muted py-5">
      🤍 Bạn chưa thích sản phẩm nào.
      <router-link to="/products" class="d-block mt-2 text-brown fw-semibold">Khám phá sản phẩm</router-link>
    </div>

    <div v-else class="row g-4">
      <div v-for="item in items" :key="item._id" class="col-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm position-relative">
          <button class="btn-wishlist liked" @click="removeItem(item.product._id)">❤️</button>
          <router-link :to="`/products/${item.product._id}`">
            <img :src="item.product.image" class="card-img-top" style="height:180px; object-fit:cover;" />
          </router-link>
          <div class="card-body d-flex flex-column">
            <router-link :to="`/products/${item.product._id}`" class="text-decoration-none text-dark">
              <h6 class="card-title">{{ item.product.name }}</h6>
            </router-link>
            <p class="fw-bold text-brown mb-2">{{ formatPrice(item.product.price) }}</p>
            <button class="btn btn-brown btn-sm mt-auto" @click="addToCart(item.product)">
              🛒 Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

const auth = useAuthStore();
const cart = useCartStore();
const wishlist = useWishlistStore();

const items = ref([]);
const loading = ref(false);

const formatPrice = (p) => (p || 0).toLocaleString('vi-VN') + ' ₫';

const loadWishlist = async () => {
  loading.value = true;
  try {
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    const res = await axios.get('/api/wishlist', config);
    // Lọc bỏ trường hợp product đã bị xóa khỏi hệ thống
    items.value = res.data.filter(i => i.product);
  } catch (err) {
    alert('Không thể tải danh sách yêu thích');
  } finally {
    loading.value = false;
  }
};

const removeItem = async (productId) => {
  await wishlist.toggle(productId, auth.token);
  items.value = items.value.filter(i => i.product._id !== productId);
};

const addToCart = (product) => {
  cart.addItem(product);
  alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
};

onMounted(loadWishlist);
</script>

<style scoped>
.text-brown { color: #6d4c41; }
.btn-brown {
  background-color: #6d4c41;
  border-color: #6d4c41;
  color: white;
}
.btn-brown:hover { background-color: #8d6242; color: white; }
.btn-wishlist {
  position: absolute;
  top: 10px; right: 10px;
  z-index: 5;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: none;
  font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
</style>