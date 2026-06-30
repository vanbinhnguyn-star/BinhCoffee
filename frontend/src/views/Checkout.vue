<template>
  <div class="container my-5" style="max-width: 700px;">
    <h2 class="mb-4">Thanh toán</h2>

    <div v-if="cart.items.length === 0" class="alert alert-info">
      Giỏ hàng trống. <router-link to="/products">Tiếp tục mua sắm</router-link>
    </div>

    <div v-else>
      <!-- Tóm tắt đơn hàng -->
      <div class="card p-3 mb-4">
        <h6 class="mb-3">Đơn hàng của bạn</h6>
        <div v-for="item in cart.items" :key="item._id || item.id" class="d-flex justify-content-between mb-2">
          <span>{{ item.name }} x{{ item.quantity }}</span>
          <span>{{ formatPrice(item.price * item.quantity) }}</span>
        </div>
        <hr />
        <div class="d-flex justify-content-between fw-bold">
          <span>Tổng cộng:</span>
          <span class="text-brown">{{ formatPrice(cart.totalPrice) }}</span>
        </div>
      </div>

      <!-- Form thông tin giao hàng -->
      <div class="card p-4">
        <h6 class="mb-3">Thông tin nhận hàng</h6>
        <form @submit.prevent="placeOrder">
          <div class="row g-3">
            <div class="col-12">
              <input type="text" class="form-control" v-model="shippingAddress.street" placeholder="Địa chỉ nhận hàng" required />
            </div>
            <div class="col-md-6">
              <input type="text" class="form-control" v-model="shippingAddress.city" placeholder="Thành phố" required />
            </div>
            <div class="col-md-6">
              <input type="text" class="form-control" v-model="shippingAddress.phone" placeholder="Số điện thoại" required />
            </div>
            <div class="col-12">
              <select class="form-select" v-model="paymentMethod" required>
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="banking">Chuyển khoản ngân hàng</option>
                <option value="momo">Ví MoMo</option>
              </select>
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-brown btn-lg" :disabled="loading">
                {{ loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import axios from 'axios';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);

const shippingAddress = ref({ street: '', city: '', phone: '' });
const paymentMethod = ref('cod');

const formatPrice = (p) => (p || 0).toLocaleString('vi-VN') + ' ₫';

const placeOrder = async () => {
  if (!auth.isLoggedIn) {
    alert('Vui lòng đăng nhập để đặt hàng!');
    router.push('/login');
    return;
  }

  loading.value = true;
  try {
    const orderData = {
      items: cart.items.map(item => ({
        productId: item._id || item.id,
        quantity: item.quantity
      })),
      shippingAddress: shippingAddress.value,
      paymentMethod: paymentMethod.value
    };

    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    await axios.post('/api/orders', orderData, config);

    cart.clearCart();
    alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    router.push('/my-orders');
  } catch (error) {
    alert(error.response?.data?.message || 'Đặt hàng thất bại! Vui lòng thử lại.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.text-brown { color: #6d4c41; }
.btn-brown {
  background-color: #6d4c41;
  border-color: #6d4c41;
  color: white;
}
.btn-brown:hover {
  background-color: #8d6242;
  border-color: #8d6242;
  color: white;
}
.btn-brown:disabled { opacity: 0.7; cursor: not-allowed; }
</style>