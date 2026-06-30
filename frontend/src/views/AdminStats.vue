<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Thống kê doanh thu</h2>
      <div class="btn-group">
        <button
          v-for="p in periods" :key="p.value"
          class="btn btn-sm"
          :class="period === p.value ? 'btn-brown' : 'btn-outline-secondary'"
          @click="changePeriod(p.value)"
        >{{ p.label }}</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-secondary"></div>
    </div>

    <template v-else>
      <!-- Tổng quan -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
          <div class="card text-center p-3 h-100">
            <div class="fs-1">💰</div>
            <div class="text-muted small">Tổng doanh thu</div>
            <div class="fw-bold fs-5 text-brown mt-1">{{ formatPrice(stats.overview.totalRevenue) }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card text-center p-3 h-100">
            <div class="fs-1">📦</div>
            <div class="text-muted small">Tổng đơn hàng</div>
            <div class="fw-bold fs-5 text-brown mt-1">{{ stats.overview.totalOrders }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card text-center p-3 h-100">
            <div class="fs-1">👤</div>
            <div class="text-muted small">Khách hàng</div>
            <div class="fw-bold fs-5 text-brown mt-1">{{ stats.overview.totalUsers }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card text-center p-3 h-100">
            <div class="fs-1">☕</div>
            <div class="text-muted small">Sản phẩm</div>
            <div class="fw-bold fs-5 text-brown mt-1">{{ stats.overview.totalProducts }}</div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <!-- Biểu đồ doanh thu -->
        <div class="col-12 col-lg-8">
          <div class="card p-3 h-100">
            <h6 class="mb-3">Doanh thu theo thời gian</h6>
            <div v-if="stats.revenueByTime.length === 0" class="text-center text-muted py-4">
              Chưa có dữ liệu trong khoảng thời gian này
            </div>
            <div v-else class="chart-container">
              <div class="chart-bars d-flex align-items-end gap-1">
                <div
                  v-for="item in stats.revenueByTime"
                  :key="item._id"
                  class="chart-bar-wrap text-center flex-fill"
                >
                  <div class="chart-value small text-muted mb-1">{{ shortPrice(item.revenue) }}</div>
                  <div
                    class="chart-bar rounded-top"
                    :style="{ height: barHeight(item.revenue) + 'px' }"
                    :title="item._id + ': ' + formatPrice(item.revenue)"
                  ></div>
                  <div class="chart-label small text-muted mt-1">{{ shortDate(item._id) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Trạng thái đơn hàng -->
        <div class="col-12 col-lg-4">
          <div class="card p-3 h-100">
            <h6 class="mb-3">Trạng thái đơn hàng</h6>
            <div v-for="item in stats.ordersByStatus" :key="item._id" class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <span class="small">{{ statusLabel(item._id) }}</span>
                <span class="fw-bold small">{{ item.count }}</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div
                  class="progress-bar"
                  :class="statusColor(item._id)"
                  :style="{ width: statusPercent(item.count) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <!-- Top sản phẩm -->
        <div class="col-12 col-lg-6">
          <div class="card p-3 h-100">
            <h6 class="mb-3">Top 5 sản phẩm bán chạy</h6>
            <div v-for="(item, i) in stats.topProducts" :key="item._id" class="d-flex align-items-center mb-3">
              <span class="badge bg-brown me-2">{{ i + 1 }}</span>
              <div class="flex-grow-1">
                <div class="small fw-semibold">{{ item._id }}</div>
                <div class="small text-muted">{{ item.totalQty }} sản phẩm · {{ formatPrice(item.totalRevenue) }}</div>
              </div>
            </div>
            <div v-if="stats.topProducts.length === 0" class="text-center text-muted py-3">
              Chưa có dữ liệu
            </div>
          </div>
        </div>

        <!-- Phương thức thanh toán -->
        <div class="col-12 col-lg-6">
          <div class="card p-3 h-100">
            <h6 class="mb-3">Phương thức thanh toán</h6>
            <div v-for="item in stats.revenueByPayment" :key="item._id" class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
              <div>
                <div class="fw-semibold small">{{ paymentLabel(item._id) }}</div>
                <div class="text-muted small">{{ item.count }} đơn hàng</div>
              </div>
              <div class="text-brown fw-bold">{{ formatPrice(item.total) }}</div>
            </div>
            <div v-if="stats.revenueByPayment.length === 0" class="text-center text-muted py-3">
              Chưa có dữ liệu
            </div>
          </div>
        </div>
      </div>

      <!-- Đơn hàng gần nhất -->
      <div class="card p-3">
        <h6 class="mb-3">Đơn hàng gần nhất</h6>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in stats.recentOrders" :key="order._id">
                <td class="small text-muted">#{{ order._id.slice(-6) }}</td>
                <td>
                  <div class="fw-semibold small">{{ order.user?.name }}</div>
                  <div class="text-muted small">{{ order.user?.email }}</div>
                </td>
                <td class="fw-bold text-brown">{{ formatPrice(order.totalAmount) }}</td>
                <td>
                  <span class="badge" :class="statusBadge(order.status)">
                    {{ statusLabel(order.status) }}
                  </span>
                </td>
                <td class="small text-muted">{{ formatDate(order.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const auth = useAuthStore();
const loading = ref(false);
const period = ref('month');

const periods = [
  { value: 'week',  label: '7 ngày' },
  { value: 'month', label: 'Tháng này' },
  { value: 'year',  label: 'Năm nay' }
];

const stats = ref({
  overview: { totalRevenue: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0 },
  revenueByTime: [],
  ordersByStatus: [],
  topProducts: [],
  revenueByPayment: [],
  recentOrders: []
});

const formatPrice = (p) => (p || 0).toLocaleString('vi-VN') + ' ₫';
const shortPrice = (p) => {
  if (p >= 1_000_000) return (p / 1_000_000).toFixed(1) + 'M';
  if (p >= 1_000)     return (p / 1_000).toFixed(0) + 'K';
  return p;
};
const shortDate  = (d) => d?.slice(5) || d;
const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN');

const maxRevenue = computed(() =>
  Math.max(...stats.value.revenueByTime.map(i => i.revenue), 1)
);
const barHeight = (revenue) => Math.max((revenue / maxRevenue.value) * 160, 4);

const totalOrders = computed(() =>
  stats.value.ordersByStatus.reduce((s, i) => s + i.count, 0) || 1
);
const statusPercent = (count) => Math.round((count / totalOrders.value) * 100);

const statusLabel = (s) => ({
  pending:    'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped:    'Đang giao',
  delivered:  'Đã giao',
  cancelled:  'Đã hủy'
}[s] || s);

const statusColor = (s) => ({
  pending:    'bg-warning',
  processing: 'bg-info',
  shipped:    'bg-primary',
  delivered:  'bg-success',
  cancelled:  'bg-danger'
}[s] || 'bg-secondary');

const statusBadge = (s) => ({
  pending:    'bg-warning text-dark',
  processing: 'bg-info text-dark',
  shipped:    'bg-primary',
  delivered:  'bg-success',
  cancelled:  'bg-danger'
}[s] || 'bg-secondary');

const paymentLabel = (p) => ({
  cod:     '💵 Thanh toán khi nhận hàng (COD)',
  banking: '🏦 Chuyển khoản ngân hàng',
  momo:    '📱 Ví MoMo'
}[p] || p);

const loadStats = async () => {
  loading.value = true;
  try {
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    const res = await axios.get(`/api/stats?period=${period.value}`, config);
    stats.value = res.data;
  } catch (err) {
    alert('Không thể tải dữ liệu thống kê');
  } finally {
    loading.value = false;
  }
};

// ✅ Gộp "load lần đầu" và "load lại khi đổi period" làm một
// immediate: true → chạy ngay lúc component mount, không cần onMounted riêng
watch(period, loadStats, { immediate: true });

const changePeriod = (p) => {
  period.value = p; // chỉ cần đổi giá trị, watch tự gọi loadStats()
};
</script>

<style scoped>
.chart-container { overflow-x: auto; }
.chart-bars {
  min-height: 200px;
  align-items: flex-end;
  padding-bottom: 4px;
}
.chart-bar-wrap { min-width: 32px; }
.chart-bar {
  background: var(--coffee-brown);
  width: 100%;
  transition: height 0.4s ease;
}
.chart-bar:hover { background: var(--coffee-gold); }
.chart-value { font-size: 0.65rem; }
.chart-label { font-size: 0.65rem; }
.bg-brown { background-color: var(--coffee-brown) !important; }
.text-brown { color: var(--coffee-brown) !important; }
</style>