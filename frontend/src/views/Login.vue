<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow">
          <div class="card-body p-5">
            <!-- Tabs -->
            <ul class="nav nav-tabs mb-4" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="login-tab" @click="tab='login'" type="button" role="tab">
                  Đăng nhập
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="register-tab" @click="tab='register'" type="button" role="tab">
                  Đăng ký
                </button>
              </li>
            </ul>

            <!-- Login Form -->
            <form v-if="tab === 'login'" @submit.prevent="handleLogin" class="login-form">
              <div class="mb-3">
                <label for="loginEmail" class="form-label">Email</label>
                <input 
                  type="email" 
                  id="loginEmail"
                  class="form-control" 
                  placeholder="Nhập email của bạn" 
                  v-model="loginForm.email" 
                  required 
                />
              </div>
              <div class="mb-3">
                <label for="loginPassword" class="form-label">Mật khẩu</label>
                <input 
                  type="password" 
                  id="loginPassword"
                  class="form-control" 
                  placeholder="Nhập mật khẩu" 
                  v-model="loginForm.password" 
                  required 
                />
              </div>
              <button type="submit" class="btn btn-brown w-100">Đăng nhập</button>
            </form>

            <!-- Register Form -->
            <form v-if="tab === 'register'" @submit.prevent="handleRegister" class="register-form">
              <div class="mb-3">
                <label for="registerName" class="form-label">Họ tên</label>
                <input 
                  type="text" 
                  id="registerName"
                  class="form-control" 
                  placeholder="Nhập họ tên" 
                  v-model="registerForm.name" 
                  required 
                />
              </div>
              <div class="mb-3">
                <label for="registerEmail" class="form-label">Email</label>
                <input 
                  type="email" 
                  id="registerEmail"
                  class="form-control" 
                  placeholder="Nhập email của bạn" 
                  v-model="registerForm.email" 
                  required 
                />
              </div>
              <div class="mb-3">
                <label for="registerPassword" class="form-label">Mật khẩu</label>
                <input 
                  type="password" 
                  id="registerPassword"
                  class="form-control" 
                  placeholder="Nhập mật khẩu" 
                  v-model="registerForm.password" 
                  required 
                />
              </div>
              <button type="submit" class="btn btn-brown w-100">Đăng ký</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import axios from 'axios';

const auth = useAuthStore();
const router = useRouter();
const tab = ref('login');

const loginForm = ref({ email: '', password: '' });
const registerForm = ref({ name: '', email: '', password: '' });

const handleLogin = async () => {
  try {
    const res = await axios.post('/api/auth/login', loginForm.value);
    auth.login(res.data.user, res.data.token);
    router.push('/');
  } catch (err) {
    alert(err.response?.data?.message || 'Đăng nhập thất bại');
  }
};

const handleRegister = async () => {
  try {
    const res = await axios.post('/api/auth/register', registerForm.value);
    auth.login(res.data.user, res.data.token);
    router.push('/');
  } catch (err) {
    alert(err.response?.data?.message || 'Đăng ký thất bại');
  }
};
</script>

<style scoped>
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

.nav-link {
  color: #6d4c41;
  border-bottom: 2px solid transparent;
}

.nav-link.active {
  color: #6d4c41;
  background-color: transparent;
  border-bottom: 2px solid #6d4c41;
}

.card {
  border: none;
}
</style>