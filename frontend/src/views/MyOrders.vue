<template>
  <div class="container my-5">
    <h2>Đơn hàng của tôi</h2>

    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-secondary"></div>
    </div>

    <div v-if="!loading && orders.length === 0 && !errorMsg" class="text-center text-muted py-4">
      Bạn chưa có đơn hàng nào.
    </div>

    <div v-if="!loading" v-for="order in orders" :key="order._id" class="card mb-3">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>Đơn hàng #{{ order._id.slice(-6) }}</span>
        <span class="badge" :class="{
          'bg-warning': order.status === 'pending',
          'bg-info':    order.status === 'processing',
          'bg-primary': order.status === 'shipped',
          'bg-success': order.status === 'delivered',
          'bg-danger':  order.status === 'cancelled'
        }">
          {{ getStatusLabel(order.status) }}
        </span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-8">
            <div v-for="item in order.items" :key="item._id" class="d-flex align-items-center mb-3">
              <img :src="item.image" style="width:50px; height:50px; object-fit:cover; margin-right:15px;" />
              <div class="flex-grow-1">
                <div>{{ item.name }}</div>
                <small class="text-muted">{{ item.quantity }} x {{ formatPrice(item.price) }}</small>
              </div>

              <!-- Nút đánh giá: chỉ hiện khi đơn đã giao -->
              <div v-if="order.status === 'delivered'">
                <span v-if="reviewedProducts.has(getProductId(item))" class="badge bg-success">
                  ✓ Đã đánh giá
                </span>
                <button
                  v-else
                  class="btn btn-sm btn-outline-brown"
                  @click="openReviewModal(item)"
                >
                  ⭐ Đánh giá
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <p><strong>Tổng tiền:</strong> {{ formatPrice(order.totalAmount) }}</p>
            <p><strong>Phương thức:</strong> {{ order.paymentMethod }}</p>
            <p><strong>Ngày đặt:</strong> {{ new Date(order.createdAt).toLocaleDateString('vi-VN') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal đánh giá -->
    <div v-if="showModal" class="review-modal-backdrop" @click.self="closeModal">
      <div class="review-modal">
        <h5 class="mb-3">Đánh giá sản phẩm</h5>
        <div class="d-flex align-items-center gap-3 mb-3">
          <img :src="selectedItem?.image" style="width:60px; height:60px; object-fit:cover; border-radius:8px;" />
          <div class="fw-semibold">{{ selectedItem?.name }}</div>
        </div>

        <label class="form-label small fw-semibold">Số sao</label>
        <div class="star-picker mb-3">
          <span
            v-for="i in 5" :key="i"
            class="star-pick"
            :class="i <= hoverStar || i <= form.rating ? 'active' : ''"
            @mouseenter="hoverStar = i"
            @mouseleave="hoverStar = 0"
            @click="form.rating = i"
          >★</span>
        </div>

        <label class="form-label small fw-semibold">Nhận xét</label>
        <textarea
          class="form-control mb-3"
          v-model="form.comment"
          rows="3"
          placeholder="Chia sẻ cảm nhận của bạn..."
        ></textarea>

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-secondary" @click="closeModal">Hủy</button>
          <button
            class="btn btn-brown"
            :disabled="!form.rating || !form.comment.trim() || submitting"
            @click="submitReview"
          >
            {{ submitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const auth = useAuthStore();
const orders = ref([]);
const loading = ref(false);
const errorMsg = ref('');

// Modal đánh giá
const showModal = ref(false);
const selectedItem = ref(null);
const form = ref({ rating: 0, comment: '' });
const hoverStar = ref(0);
const submitting = ref(false);
const reviewedProducts = ref(new Set()); // các productId đã review

const config = () => ({ headers: { Authorization: `Bearer ${auth.token}` } });

const formatPrice = (price) => price.toLocaleString('vi-VN') + ' ₫';

// item.product có thể là string id hoặc object đã populate
const getProductId = (item) => item.product?._id || item.product;

const getStatusLabel = (status) => {
  const labels = {
    pending:    'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped:    'Đang giao',
    delivered:  'Đã giao',
    cancelled:  'Đã hủy'
  };
  return labels[status] || status;
};

const loadOrders = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const res = await axios.get('/api/orders/my-orders', config());
    orders.value = res.data;
    await loadMyReviews();
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Không thể tải đơn hàng. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};

// Lấy danh sách sản phẩm user đã review để ẩn nút "Đánh giá"
const loadMyReviews = async () => {
  try {
    const productIds = new Set();
    orders.value.forEach(order => {
      if (order.status === 'delivered') {
        order.items.forEach(item => productIds.add(getProductId(item)));
      }
    });

    const checks = await Promise.all(
      [...productIds].map(async (pid) => {
        try {
          const res = await axios.get(`/api/products/${pid}/reviews`);
          const reviewed = res.data.some(r =>
            (r.user?._id || r.user) === auth.user?._id
          );
          return reviewed ? pid : null;
        } catch {
          return null;
        }
      })
    );

    reviewedProducts.value = new Set(checks.filter(Boolean));
  } catch {}
};

const openReviewModal = (item) => {
  selectedItem.value = item;
  form.value = { rating: 0, comment: '' };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedItem.value = null;
};

const submitReview = async () => {
  if (!form.value.rating || !form.value.comment.trim()) return;
  submitting.value = true;
  try {
    const productId = getProductId(selectedItem.value);
    await axios.post(
      `/api/products/${productId}/reviews`,
      form.value,
      config()
    );
    reviewedProducts.value.add(productId);
    closeModal();
    alert('Cảm ơn bạn đã đánh giá!');
  } catch (err) {
    alert(err.response?.data?.message || 'Gửi đánh giá thất bại');
  } finally {
    submitting.value = false;
  }
};

onMounted(loadOrders);
</script>

<style scoped>
.btn-outline-brown {
  border: 1px solid #6d4c41;
  color: #6d4c41;
  background: transparent;
}
.btn-outline-brown:hover {
  background: #6d4c41;
  color: white;
}
.btn-brown {
  background-color: #6d4c41;
  border-color: #6d4c41;
  color: white;
}
.btn-brown:hover { background-color: #8d6242; color: white; }
.btn-brown:disabled { opacity: 0.6; cursor: not-allowed; }

.review-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.review-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 420px;
}
.star-picker { display: flex; gap: 6px; cursor: pointer; }
.star-pick { font-size: 2rem; color: #ddd; transition: color 0.1s; }
.star-pick.active { color: #ffc107; }
</style>