<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <h1>Hương Vị Cà Phê Thế Giới, Sản Xuất Tại Việt Nam</h1>
        <p>Từ những hạt cà phê được chọn lọc kỹ càng đến từng tách cà phê hoàn hảo</p>
        <router-link to="/products" class="btn hero-btn">Khám Phá Ngay</router-link>
      </div>
    </section>

    <section class="spotlight container">
      <h2>Gợi ý hôm nay</h2>
      <p class="spot-note">Ba lựa chọn được chúng tôi đề xuất để bạn bắt đầu ngày mới thật trọn vẹn.</p>
      <div class="spot-grid">
        <div class="spot-card" v-for="p in spotlightProducts" :key="p.id">
          <img :src="p.image" :alt="p.name" />
          <h3>{{ p.name }}</h3>
          <p class="intro">{{ p.intro }}</p>
          <router-link to="/products" class="btn small">Xem thêm</router-link>
        </div>
      </div>
    </section>

    <section class="featured container">
      <h2>Sản Phẩm Nổi Bật</h2>
      <div class="product-grid">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProductCard from '../components/ProductCard.vue';
import cafeRangXay from '../assets/media/anh2.jpg';
import espressoBlend from '../assets/media/anh5.jpg';
import caPheSuaDa from '../assets/media/anh8.jpg';

const spotlightProducts = ref([
  { id: 's1', name: 'Cà Phê Rang Xay Đặc Biệt', image: cafeRangXay, intro: 'Hạt chọn lọc, rang tại chỗ, hương thơm đậm đà cho buổi sáng tỉnh táo.' },
  { id: 's2', name: 'Blend Espresso Sáng Tạo', image: espressoBlend, intro: 'Dành cho fan espresso: crema đẹp, vị cân bằng và hậu ngọt.' },
  { id: 's3', name: 'Cà Phê Sữa Đá Thơm Ngon', image: caPheSuaDa, intro: 'Kết hợp sữa béo và cà phê rang kỹ — mát lạnh và ngọt ngào.' }
]);

const featuredProducts = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get('/api/products');
    // Lấy sản phẩm bán chạy hoặc mới
    featuredProducts.value = res.data.filter(p => p.isBestSeller || p.isNew).slice(0, 4);
  } catch (error) {
    // Nếu API lỗi, giữ nguyên featuredProducts rỗng — spotlight vẫn hiển thị
    console.error(error);
  }
});
</script>

<style scoped>
.hero {
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://via.placeholder.com/1200x400?text=Coffee+Banner');
  background-size: cover;
  background-position: center;
  color: #fff;
  padding: 100px 0;
  text-align: center;
}
.hero h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}
.hero p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}
.hero-btn {
  font-size: 1.2rem;
  padding: 15px 30px;
}
.featured {
  margin-top: 50px;
}
.featured h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.spotlight {
  margin-top: 40px;
}
.spotlight h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 10px;
}
.spot-note {
  text-align: center;
  color: #6d4c41;
  margin-bottom: 20px;
}
.spot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.spot-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
.spot-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}
.spot-card h3 {
  margin-bottom: 8px;
}
.spot-card .intro {
  color: #555;
  font-size: 0.95rem;
  margin-bottom: 12px;
}
.btn.small {
  padding: 8px 14px;
  font-size: 0.9rem;
}
</style>