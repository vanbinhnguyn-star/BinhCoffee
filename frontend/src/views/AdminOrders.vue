<template>
  <div class="container my-5">
    <h2>Quản lý đơn hàng</h2>
    
    <div class="table-responsive">
      <table class="table table-hover">
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
          <tr v-for="order in orders" :key="order._id">
            <td>#{{ order._id.slice(-6) }}</td>
            <td>{{ order.user?.name || 'N/A' }}</td>
            <td>{{ formatPrice(order.totalAmount) }}</td>
            <td>
              <span class="badge" :class="{
                'bg-warning': order.status === 'pending',
                'bg-info': order.status === 'processing',
                'bg-primary': order.status === 'shipped',
                'bg-success': order.status === 'delivered',
                'bg-danger': order.status === 'cancelled'
              }">
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td>{{ new Date(order.createdAt).toLocaleDateString('vi-VN') }}</td>
            <td>
              <select class="form-select form-select-sm" @change="updateStatus(order._id, $event.target.value)">
                <option value="pending" :selected="order.status === 'pending'">Chờ xử lý</option>
                <option value="processing" :selected="order.status === 'processing'">Đang xử lý</option>
                <option value="shipped" :selected="order.status === 'shipped'">Đang giao</option>
                <option value="delivered" :selected="order.status === 'delivered'">Đã giao</option>
                <option value="cancelled" :selected="order.status === 'cancelled'">Đã hủy</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const auth = useAuthStore();
const orders = ref([]);

const formatPrice = (price) => price.toLocaleString('vi-VN') + ' ₫';

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy'
  };
  return labels[status] || status;
};

const loadOrders = async () => {
  const config = { headers: { Authorization: `Bearer ${auth.token}` } };
  const res = await axios.get('/api/orders', config);
  orders.value = res.data;
};

const updateStatus = async (orderId, status) => {
  try {
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    await axios.put(`/api/orders/${orderId}/status`, { status }, config);
    await loadOrders();
    alert('Cập nhật trạng thái thành công!');
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi!');
  }
};

onMounted(loadOrders);
</script>