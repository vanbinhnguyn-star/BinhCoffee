<template>
  <div class="mt-5">
    <h4 class="mb-4">Đánh giá sản phẩm</h4>

    <!-- Tổng quan rating -->
    <div class="card p-4 mb-4">
      <div class="row align-items-center">
        <div class="col-md-3 text-center border-end">
          <div class="display-3 fw-bold text-brown">{{ avgRating }}</div>
          <div class="stars mb-1">
            <span v-for="i in 5" :key="i" :class="i <= Math.round(avgRating) ? 'text-warning' : 'text-muted'">★</span>
          </div>
          <div class="text-muted small">{{ reviews.length }} đánh giá</div>
        </div>
        <div class="col-md-9 ps-4">
          <div v-for="star in [5,4,3,2,1]" :key="star" class="d-flex align-items-center gap-2 mb-1">
            <span class="small text-muted" style="width:12px">{{ star }}</span>
            <span class="text-warning small">★</span>
            <div class="progress flex-grow-1" style="height:8px">
              <div class="progress-bar bg-warning" :style="{ width: starPercent(star) + '%' }"></div>
            </div>
            <span class="small text-muted" style="width:24px">{{ starCount(star) }}</span>
          </div>
        </div>
      </div>
    </div>

    <p class="text-muted small mb-3">
      💡 Đánh giá được viết ngay tại đơn hàng sau khi sản phẩm đã giao thành công.
      <router-link v-if="auth.isLoggedIn" to="/my-orders" class="text-brown fw-semibold">Xem đơn hàng của bạn</router-link>
    </p>

    <!-- Danh sách review -->
    <div v-if="reviews.length === 0" class="text-center text-muted py-4">
      Chưa có đánh giá nào. Hãy là người đầu tiên!
    </div>

    <div v-for="review in reviews" :key="review._id" class="card p-3 mb-3">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <div class="fw-semibold">{{ review.user?.name }}</div>
          <div class="stars">
            <span v-for="i in 5" :key="i" :class="i <= review.rating ? 'text-warning' : 'text-muted'">★</span>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
          <button
            v-if="auth.isAdmin || review.user?._id === auth.user?._id"
            class="btn btn-sm btn-outline-danger"
            @click="deleteReview(review._id)"
          >✕</button>
        </div>
      </div>
      <p class="mt-2 mb-0 text-muted">{{ review.comment }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const props = defineProps(['productId']);
const auth = useAuthStore();

const reviews = ref([]);

const avgRating = computed(() => {
  if (!reviews.value.length) return '0.0';
  const avg = reviews.value.reduce((s, r) => s + r.rating, 0) / reviews.value.length;
  return avg.toFixed(1);
});

const starCount = (star) => reviews.value.filter(r => r.rating === star).length;
const starPercent = (star) => reviews.value.length
  ? (starCount(star) / reviews.value.length) * 100 : 0;

const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');

const loadReviews = async () => {
  try {
    const res = await axios.get(`/api/products/${props.productId}/reviews`);
    reviews.value = res.data;
  } catch {}
};

const deleteReview = async (reviewId) => {
  if (!confirm('Xóa đánh giá này?')) return;
  try {
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    await axios.delete(`/api/products/${props.productId}/reviews/${reviewId}`, config);
    reviews.value = reviews.value.filter(r => r._id !== reviewId);
  } catch (err) {
    alert(err.response?.data?.message || 'Xóa thất bại');
  }
};

onMounted(loadReviews);
</script>

<style scoped>
.text-brown { color: #6d4c41; }
.stars span { font-size: 1.1rem; }
</style>