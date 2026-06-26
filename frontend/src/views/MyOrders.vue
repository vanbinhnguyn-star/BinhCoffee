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
            <div v-for="item in order.items" :key="item._id" class="d-flex align-items-center mb-2">
              <img :src="item.image" style="width:50px; height:50px; object-fit:cover; margin-right:15px;" />
              <div>
                <div>{{ item.name }}</div>
                <small>{{ item.quantity }} x {{ formatPrice(item.price) }}</small>
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

const formatPrice = (price) => price.toLocaleString('vi-VN') + ' ₫';

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
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    const res = await axios.get('/api/orders/my-orders', config);
    orders.value = res.data;
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Không thể tải đơn hàng. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};

onMounted(loadOrders);
</script>