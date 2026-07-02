<template>
  <div class="container my-5" style="max-width: 600px;">
    <h2 class="mb-4">Thông tin tài khoản</h2>

    <!-- Avatar + tên -->
    <div class="card p-4 mb-4 text-center">
      <div class="avatar-circle mx-auto mb-3">
        {{ initials }}
      </div>
      <h4 class="mb-0">{{ auth.user?.name }}</h4>
      <p class="text-muted small">{{ auth.user?.email }}</p>
      <span class="badge bg-brown">{{ auth.user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng' }}</span>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: tab === 'info' }" @click="tab = 'info'">
          Thông tin
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: tab === 'password' }" @click="tab = 'password'">
          Đổi mật khẩu
        </button>
      </li>
    </ul>

    <!-- Tab thông tin -->
    <div v-if="tab === 'info'" class="card p-4">
      <h6 class="mb-3">Cập nhật thông tin</h6>
      <div class="mb-3">
        <label class="form-label">Họ tên</label>
        <input type="text" class="form-control" v-model="nameForm.name" />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" :value="auth.user?.email" disabled />
        <div class="form-text">Email không thể thay đổi.</div>
      </div>
      <div class="mb-3">
        <label class="form-label">Ngày tham gia</label>
        <input type="text" class="form-control" :value="joinDate" disabled />
      </div>
      <button class="btn btn-brown" @click="updateName" :disabled="saving">
        {{ saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
      </button>
    </div>

    <!-- Tab đổi mật khẩu -->
    <div v-if="tab === 'password'" class="card p-4">
      <h6 class="mb-3">Đổi mật khẩu</h6>
      <div class="mb-3">
        <label class="form-label">Mật khẩu hiện tại</label>
        <input type="password" class="form-control" v-model="pwForm.currentPassword" autocomplete="current-password" />
      </div>
      <div class="mb-3">
        <label class="form-label">Mật khẩu mới</label>
        <input type="password" class="form-control" v-model="pwForm.newPassword" autocomplete="new-password" />
      </div>
      <div class="mb-3">
        <label class="form-label">Xác nhận mật khẩu mới</label>
        <input type="password" class="form-control" v-model="pwForm.confirmPassword" autocomplete="new-password" />
        <div v-if="pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword" class="text-danger small mt-1">
          Mật khẩu xác nhận không khớp
        </div>
      </div>
      <button
        class="btn btn-brown"
        @click="updatePassword"
        :disabled="saving || !canSubmitPassword"
      >
        {{ saving ? 'Đang lưu...' : 'Đổi mật khẩu' }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const auth = useAuthStore();
const tab = ref('info');
const saving = ref(false);

const nameForm = ref({ name: '' });
const pwForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' });

const initials = computed(() => {
  const name = auth.user?.name || '';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
});

const joinDate = computed(() => {
  if (!profile.value?.createdAt) return '';
  return new Date(profile.value.createdAt).toLocaleDateString('vi-VN');
});

const canSubmitPassword = computed(() =>
  pwForm.value.currentPassword &&
  pwForm.value.newPassword &&
  pwForm.value.newPassword === pwForm.value.confirmPassword &&
  pwForm.value.newPassword.length >= 6
);

const profile = ref(null);

const config = () => ({ headers: { Authorization: `Bearer ${auth.token}` } });

const loadProfile = async () => {
  try {
    const res = await axios.get('/api/auth/profile', config());
    profile.value = res.data;
    nameForm.value.name = res.data.name;
  } catch {}
};

const updateName = async () => {
  if (!nameForm.value.name.trim()) return;
  saving.value = true;
  try {
    const res = await axios.put('/api/auth/profile', { name: nameForm.value.name }, config());
    // Cập nhật lại store để navbar hiện tên mới
    auth.user = { ...auth.user, name: res.data.user.name };
    localStorage.setItem('user', JSON.stringify(auth.user));
    alert('Cập nhật tên thành công!');
  } catch (err) {
    alert(err.response?.data?.message || 'Cập nhật thất bại');
  } finally {
    saving.value = false;
  }
};

const updatePassword = async () => {
  saving.value = true;
  try {
    await axios.put('/api/auth/profile', {
      currentPassword: pwForm.value.currentPassword,
      newPassword: pwForm.value.newPassword
    }, config());
    pwForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
    alert('Đổi mật khẩu thành công!');
  } catch (err) {
    alert(err.response?.data?.message || 'Đổi mật khẩu thất bại');
  } finally {
    saving.value = false;
  }
};

onMounted(loadProfile);
</script>

<style scoped>
.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #6d4c41;
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg-brown { background-color: #6d4c41 !important; }
.btn-brown {
  background-color: #6d4c41;
  border-color: #6d4c41;
  color: white;
}
.btn-brown:hover { background-color: #8d6242; color: white; }
.btn-brown:disabled { opacity: 0.7; cursor: not-allowed; }
.nav-link { color: #6d4c41; cursor: pointer; }
.nav-link.active {
  color: #6d4c41;
  border-bottom: 2px solid #6d4c41;
  background: transparent;
}
</style>