import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/styles/main.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);

// ✅ Directive v-fade-in: tự động thêm hiệu ứng fade khi element xuất hiện trong viewport
app.directive('fade-in', {
  mounted(el) {
    el.classList.add('fade-in');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el); // chỉ chạy 1 lần
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
  }
});

app.mount('#app');