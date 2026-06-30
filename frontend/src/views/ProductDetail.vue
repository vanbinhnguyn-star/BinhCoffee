<template>
  <div class="container my-5">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-secondary"></div>
    </div>

    <div v-else-if="product" class="row g-5">
      <!-- Ảnh sản phẩm -->
      <div class="col-md-5">
        <img
          :src="product.image"
          :alt="product.name"
          class="img-fluid rounded-3 shadow"
          style="width:100%; max-height:420px; object-fit:cover;"
        />
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="col-md-7">
        <span class="badge bg-warning text-dark mb-2" v-if="product.isNew">Mới</span>
        <span class="badge bg-danger mb-2 ms-1" v-if="product.isBestSeller">Bán chạy</span>

        <h1 class="mb-2">{{ product.name }}</h1>

        <div class="d-flex align-items-center gap-2 mb-3">
          <div class="stars">
            <span v-for="i in 5" :key="i" :class="i <= Math.round(product.rating) ? 'text-warning' : 'text-muted'">★</span>
          </div>
          <span class="text-muted small">{{ product.rating }} ({{ product.reviews }} đánh giá)</span>
        </div>

        <div class="fs-3 fw-bold text-brown mb-3">{{ formatPrice(product.price) }}</div>

        <p class="text-muted mb-4">{{ product.description }}</p>

        <div class="d-flex align-items-center gap-2 mb-3">
          <span class="small text-muted">Danh mục:</span>
          <span class="badge bg-light text-dark border">{{ product.category }}</span>
        </div>

        <div class="d-flex align-items-center gap-2 mb-4">
          <span class="small text-muted">Tồn kho:</span>
          <span :class="product.stock > 0 ? 'text-success fw-semibold' : 'text-danger fw-semibold'">
            {{ product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng' }}
          </span>
        </div>

        <!-- Số lượng + Thêm giỏ -->
        <div class="d-flex align-items-center gap-3">
          <div class="input-group" style="width:130px">
            <button class="btn btn-outline-secondary" @click="qty > 1 && qty--">−</button>
            <input type="number" class="form-control text-center" v-model="qty" min="1" :max="product.stock" />
            <button class="btn btn-outline-secondary" @click="qty < product.stock && qty++">+</button>
          </div>
          <button
            class="btn btn-brown btn-lg px-4"
            :disabled="product.stock === 0"
            @click="addToCart"
          >
            🛒 Thêm vào giỏ
          </button>
        </div>
      </div>

      <!-- Reviews -->
      <div class="col-12">
        <hr />
        <ProductReviews :productId="product._id" />
      </div>
    </div>

    <div v-else class="text-center text-muted py-5">
      Không tìm thấy sản phẩm.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import ProductReviews from '../components/ProductReviews.vue';

const route = useRoute();
const cart = useCartStore();

const product = ref(null);
const loading = ref(false);
const qty = ref(1);

const formatPrice = (p) => (p || 0).toLocaleString('vi-VN') + ' ₫';

const loadProduct = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`/api/products/${route.params.id}`);
    product.value = res.data;
  } catch {
    product.value = null;
  } finally {
    loading.value = false;
  }
};

const addToCart = () => {
  cart.addItem(product.value, qty.value);
  alert(`Đã thêm ${qty.value} "${product.value.name}" vào giỏ hàng!`);
};

onMounted(loadProduct);
</script>

<style scoped>
.text-brown { color: #6d4c41; }
.btn-brown { background-color: #6d4c41; border-color: #6d4c41; color: white; }
.btn-brown:hover { background-color: #8d6242; color: white; }
.stars span { font-size: 1rem; }
</style>