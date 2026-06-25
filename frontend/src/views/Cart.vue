<template>
  <div class="container my-5">
    <h1 class="mb-4">Giỏ Hàng</h1>
    
    <div v-if="cart.items.length === 0" class="alert alert-info">
      <i class="fas fa-shopping-cart me-2"></i> Giỏ hàng trống
    </div>
    
    <div v-else>
      <CartItem v-for="item in cart.items" :key="item.id" :item="item" @update="updateQty" @remove="removeItem" />
      
      <div class="card mt-4 p-4 bg-light">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mb-0">
            Tổng cộng: 
            <span class="text-brown fw-bold">{{ formatPrice(cart.totalPrice) }}</span>
          </h4>
          <button class="btn btn-brown btn-lg" @click="showCheckout = !showCheckout">
            <i class="fas fa-credit-card me-2"></i> Thanh toán
          </button>
        </div>
      </div>

      <!-- Checkout Form -->
      <div v-if="showCheckout" class="card mt-4 p-4 shadow-sm">
        <h4 class="mb-3"><i class="fas fa-truck me-2"></i>Thông tin nhận hàng</h4>
        <form @submit.prevent="placeOrder">
          <div class="row g-3">
            <div class="col-md-12">
              <input 
                type="text" 
                class="form-control" 
                v-model="shippingAddress.street" 
                placeholder="Địa chỉ nhận hàng" 
                required 
              />
            </div>
            <div class="col-md-6">
              <input 
                type="text" 
                class="form-control" 
                v-model="shippingAddress.city" 
                placeholder="Thành phố" 
                required 
              />
            </div>
            <div class="col-md-6">
              <input 
                type="text" 
                class="form-control" 
                v-model="shippingAddress.phone" 
                placeholder="Số điện thoại" 
                required 
              />
            </div>
            <div class="col-md-12">
              <select class="form-select" v-model="paymentMethod" required>
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="banking">Chuyển khoản ngân hàng</option>
                <option value="momo">Ví MoMo</option>
              </select>
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-success btn-lg" :disabled="loading">
                <i v-if="loading" class="fas fa-spinner fa-spin me-2"></i>
                {{ loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng' }}
              </button>
              <button type="button" class="btn btn-secondary btn-lg ms-2" @click="showCheckout = false">
                Hủy
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
import CartItem from '../components/CartItem.vue';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();

const loading = ref(false);
const showCheckout = ref(false);

const shippingAddress = ref({
  street: '',
  city: '',
  phone: ''
});
const paymentMethod = ref('cod');

const formatPrice = (price) => price.toLocaleString('vi-VN') + ' ₫';
const updateQty = (id, qty) => cart.updateQuantity(id, qty);
const removeItem = (id) => cart.removeItem(id);

const placeOrder = async () => {
  // Kiểm tra đăng nhập
  if (!auth.isLoggedIn) {
    alert('Vui lòng đăng nhập để đặt hàng!');
    router.push('/login');
    return;
  }

  // Kiểm tra thông tin shipping
  if (!shippingAddress.value.street || !shippingAddress.value.city || !shippingAddress.value.phone) {
    alert('Vui lòng nhập đầy đủ thông tin nhận hàng!');
    return;
  }

  loading.value = true;
  try {
    const orderData = {
      items: cart.items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      })),
      shippingAddress: shippingAddress.value,
      paymentMethod: paymentMethod.value
    };

    const config = { 
      headers: { 
        Authorization: `Bearer ${auth.token}` 
      } 
    };
    
    const res = await axios.post('/api/orders', orderData, config);
    
    // Xóa giỏ hàng sau khi đặt hàng thành công
    cart.clearCart();
    
    alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    router.push('/my-orders');
    
  } catch (error) {
    console.error('Order error:', error);
    alert(error.response?.data?.message || 'Đặt hàng thất bại! Vui lòng thử lại.');
  } finally {
    loading.value = false;
    showCheckout.value = false;
  }
};
</script>

<style scoped>
.text-brown {
  color: #6d4c41;
}

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

.btn-success {
  background-color: #2e7d32;
  border-color: #2e7d32;
}

.btn-success:hover {
  background-color: #1b5e20;
  border-color: #1b5e20;
}

.btn-success:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .d-flex {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn-brown, .btn-success, .btn-secondary {
    width: 100%;
  }
}
</style>