<template>
  <div class="container my-5">
    <h1 class="text-center mb-5 display-5">Liên Hệ Chúng Tôi</h1>

    <div class="row g-5">
      <div class="col-lg-5">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <h5 class="card-title text-brown mb-3">Thông Tin Liên Hệ</h5>
            <p class="mb-2"><strong>Địa chỉ:</strong><br>123 Đường Nguyễn Huệ, Quận 1, TP HCM</p>
            <p class="mb-2"><strong>Điện thoại:</strong><br>1900 1234</p>
            <p class="mb-2"><strong>Email:</strong><br>info@binhcoffee.com</p>
            <p class="mb-0"><strong>Giờ làm việc:</strong><br>Thứ 2 - Chủ Nhật: 7AM - 10PM</p>
          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <!-- Thông báo gửi thành công -->
        <div v-if="success" class="alert alert-success mb-4">
          ✅ Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.
        </div>

        <form class="card shadow-sm border-0 p-4" @submit.prevent="submitContact">
          <div class="mb-3">
            <label class="form-label">Tên của bạn</label>
            <input
              type="text"
              class="form-control"
              v-model="form.name"
              placeholder="Nhập tên..."
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              v-model="form.email"
              placeholder="Nhập email..."
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Tin nhắn</label>
            <textarea
              class="form-control"
              v-model="form.message"
              rows="5"
              placeholder="Nhập tin nhắn của bạn..."
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-brown" :disabled="sending">
            {{ sending ? 'Đang gửi...' : 'Gửi Tin Nhắn' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({ name: '', email: '', message: '' });
const sending = ref(false);
const success = ref(false);

const submitContact = async () => {
  sending.value = true;
  success.value = false;
  try {
    await axios.post('/api/contact', form.value);
    success.value = true;
    form.value = { name: '', email: '', message: '' };
    setTimeout(() => { success.value = false; }, 5000);
  } catch (err) {
    alert(err.response?.data?.message || 'Gửi thất bại, vui lòng thử lại.');
  } finally {
    sending.value = false;
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
.btn-brown:hover { background-color: #8d6242; color: white; }
.btn-brown:disabled { opacity: 0.7; cursor: not-allowed; }
</style>