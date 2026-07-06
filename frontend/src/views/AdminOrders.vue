<template>
  <div class="container-fluid py-4">

    <!-- Panel thông báo đơn chờ xử lý -->
    <div class="pending-panel mb-4" v-if="pendingOrders.length > 0">
      <div class="pending-header">
        <span>🔔 Có <strong>{{ pendingOrders.length }}</strong> đơn hàng đang chờ xử lý</span>
      </div>
      <div class="pending-list">
        <div v-for="order in pendingOrders" :key="order._id" class="pending-item">
          <div>
            <span class="fw-semibold">{{ order.user?.name }}</span>
            <span class="text-muted small ms-2">#{{ order._id.slice(-6) }}</span>
            <span class="ms-2 text-muted small">{{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="fw-bold text-brown">{{ formatPrice(order.totalAmount) }}</span>
            <select
              class="form-select form-select-sm"
              style="width:140px"
              @change="updateStatus(order._id, $event.target.value)"
            >
              <option value="pending"    selected>Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">Tất cả đơn hàng</h5>
      <button class="btn btn-sm btn-outline-secondary" @click="loadOrders">↺ Làm mới</button>
    </div>

    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-secondary"></div>
    </div>

    <div class="table-responsive" v-if="!loading">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày đặt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="orders.length === 0">
            <td colspan="6" class="text-center text-muted py-4">Chưa có đơn hàng nào.</td>
          </tr>
          <tr
            v-for="order in orders"
            :key="order._id"
            :class="{ 'pending-row': order.status === 'pending' }"
          >
            <td>
              <div class="d-flex align-items-center gap-2">
                <span class="text-muted small">#{{ order._id.slice(-6) }}</span>
                <span v-if="order.status === 'pending'" class="badge bg-danger new-badge">MỚI</span>
              </div>
            </td>
            <td>{{ order.user?.name || 'N/A' }}</td>
            <td class="fw-semibold text-brown">{{ formatPrice(order.totalAmount) }}</td>
            <td>
              <span class="badge" :class="{
                'bg-warning text-dark': order.status === 'pending',
                'bg-info text-dark':    order.status === 'processing',
                'bg-primary':           order.status === 'shipped',
                'bg-success':           order.status === 'delivered',
                'bg-danger':            order.status === 'cancelled'
              }">{{ getStatusLabel(order.status) }}</span>
            </td>
            <td class="small text-muted">{{ formatDate(order.createdAt) }}</td>
            <td>
              <select
                class="form-select form-select-sm"
                style="width:150px"
                @change="updateStatus(order._id, $event.target.value)"
              >
                <option value="pending"    :selected="order.status === 'pending'">Chờ xử lý</option>
                <option value="processing" :selected="order.status === 'processing'">Đang xử lý</option>
                <option value="shipped"    :selected="order.status === 'shipped'">Đang giao</option>
                <option value="delivered"  :selected="order.status === 'delivered'">Đã giao</option>
                <option value="cancelled"  :selected="order.status === 'cancelled'">Đã hủy</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const auth = useAuthStore();
const orders = ref([]);
const loading = ref(false);
const errorMsg = ref('');

// Tất cả đơn đang chờ xử lý = đơn mới cần duyệt
const pendingOrders = computed(() =>
  orders.value.filter(o => o.status === 'pending')
);

const formatPrice = (p) => (p || 0).toLocaleString('vi-VN') + ' ₫';
const formatDate = (d) => new Date(d).toLocaleString('vi-VN');

const getStatusLabel = (s) => ({
  pending:    'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped:    'Đang giao',
  delivered:  'Đã giao',
  cancelled:  'Đã hủy'
}[s] || s);

const loadOrders = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    const res = await axios.get('/api/orders', config);
    orders.value = res.data;
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Không thể tải danh sách đơn hàng.';
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (orderId, status) => {
  try {
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    await axios.put(`/api/orders/${orderId}/status`, { status }, config);
    // Cập nhật trực tiếp trong mảng — không cần gọi lại API
    const order = orders.value.find(o => o._id === orderId);
    if (order) order.status = status;
  } catch (error) {
    alert(error.response?.data?.message || 'Cập nhật thất bại!');
  }
};

onMounted(loadOrders);
</script>

<style scoped>
.text-brown { color: #6d4c41; }

/* Panel đơn chờ xử lý */
.pending-panel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(62,39,35,0.15);
}
.pending-header {
  background: #c0392b;
  color: white;
  padding: 12px 18px;
  font-size: 0.95rem;
}
.pending-list {
  background: white;
  max-height: 220px;
  overflow-y: auto;
}
.pending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px;
  border-bottom: 1px solid #f0ebe6;
  animation: slideIn 0.3s ease;
}
.pending-item:last-child { border-bottom: none; }
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Hàng đơn pending trong bảng */
.pending-row {
  background-color: #fffbf0 !important;
}
.pending-row:hover {
  background-color: #fff3cd !important;
}

/* Badge MỚI nhấp nháy */
.new-badge {
  font-size: 0.62rem;
  padding: 2px 5px;
  border-radius: 4px;
  animation: blink 1.2s step-start infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}
</style>