import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Products from '../views/Products.vue';
import About from '../views/About.vue';
import Contact from '../views/Contact.vue';
import Cart from '../views/Cart.vue';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/cart', component: Cart },
  { path: '/login', component: Login },
  { path: '/admin', component: Admin, meta: { requiresAdmin: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard – dùng dynamic import để tránh lỗi circular
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAdmin || to.meta.requiresAuth) {
    const { useAuthStore } = await import('../store/authStore.js');
    const auth = useAuthStore();
    auth.loadFromStorage(); // lấy token từ localStorage
    if (to.meta.requiresAdmin && !auth.isAdmin) {
      next('/login');
    } else if (to.meta.requiresAuth && !auth.isLoggedIn) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;