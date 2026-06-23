<template>
  <div class="login container">
    <div class="tabs">
      <button :class="{ active: tab === 'login' }" @click="tab='login'">Đăng nhập</button>
      <button :class="{ active: tab === 'register' }" @click="tab='register'">Đăng ký</button>
    </div>
    <form v-if="tab === 'login'" @submit.prevent="handleLogin">
      <input type="email" placeholder="Email" v-model="loginForm.email" required />
      <input type="password" placeholder="Mật khẩu" v-model="loginForm.password" required />
      <button class="btn" type="submit">Đăng nhập</button>
    </form>
    <form v-else @submit.prevent="handleRegister">
      <input type="text" placeholder="Họ tên" v-model="registerForm.name" required />
      <input type="email" placeholder="Email" v-model="registerForm.email" required />
      <input type="password" placeholder="Mật khẩu" v-model="registerForm.password" required />
      <button class="btn" type="submit">Đăng ký</button>
    </form>
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
.login { max-width: 400px; margin: 50px auto; }
.tabs { display: flex; }
.tabs button { flex:1; padding:10px; cursor:pointer; background:#eee; border:none; }
.tabs button.active { background:#6d4c41; color:#fff; }
form { display:flex; flex-direction:column; gap:15px; margin-top:20px; }
input { padding:10px; border-radius:5px; border:1px solid #ccc; }
</style>