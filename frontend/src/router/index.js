import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Products from '../views/Products.vue';
import About from '../views/About.vue';
import Contact from '../views/Contact.vue';
import Checkout from '../views/Checkout.vue';
import Login from '../views/Login.vue';
import Admin from '../views/Admin.vue';
import AdminStats from '../views/AdminStats.vue';
import AdminProducts from '../views/AdminProducts.vue';
import AdminOrders from '../views/AdminOrders.vue';
import AdminChat from '../components/AdminChat.vue';
import MyOrders from '../views/MyOrders.vue';
import MyWishlist from '../views/MyWishlist.vue';
import ProductDetail from '../views/ProductDetail.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/checkout', component: Checkout, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/products/:id', component: ProductDetail },
  { path: '/my-orders', component: MyOrders, meta: { requiresAuth: true } },
  { path: '/wishlist', component: MyWishlist, meta: { requiresAuth: true } },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAdmin: true },
    children: [
      { path: 'stats',    component: AdminStats },
      { path: 'products', component: AdminProducts },
      { path: 'orders',   component: AdminOrders },
      { path: 'chat',     component: AdminChat }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 };
    return { top: 0 };
  }
});

router.beforeEach(async (to, from, next) => {
  const requiresAdmin = to.matched.some(r => r.meta.requiresAdmin);
  const requiresAuth  = to.matched.some(r => r.meta.requiresAuth);

  if (requiresAdmin || requiresAuth) {
    const { useAuthStore } = await import('../store/authStore.js');
    const auth = useAuthStore();
    if (!auth.token) auth.loadFromStorage();

    if (requiresAdmin && !auth.isAdmin) next('/login');
    else if (requiresAuth && !auth.isLoggedIn) next('/login');
    else next();
  } else {
    next();
  }
});

export default router;