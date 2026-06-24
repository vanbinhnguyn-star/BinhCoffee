<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section py-5">
      <video class="hero-bg-video" autoplay muted loop playsinline>
        <source :src="heroVideo2" type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>
      <div class="container text-center text-white hero-content">
        <h1 class="display-4 fw-bold mb-3">Hương Vị Cà Phê Thế Giới, Sản Xuất Tại Việt Nam</h1>
        <p class="lead mb-4">Từ những hạt cà phê được chọn lọc kỹ càng đến từng tách cà phê hoàn hảo</p>
        <router-link to="/products" class="btn btn-light btn-lg">Khám Phá Ngay</router-link>
      </div>
    </section>

    <!-- Spotlight Section -->
    <section class="spotlight py-5 my-5">
      <div class="container">
        <h2 class="text-center mb-2">Gợi ý hôm nay</h2>
        <p class="text-center text-brown mb-4">Ba lựa chọn được chúng tôi đề xuất để bạn bắt đầu ngày mới thật trọn vẹn.</p>
        
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="p in spotlightProducts" :key="p.id">
            <div class="card h-100 shadow-sm text-center">
              <img :src="p.image" :alt="p.name" class="card-img-top" style="height: 160px; object-fit: cover;">
              <div class="card-body">
                <h5 class="card-title">{{ p.name }}</h5>
                <p class="card-text text-muted small">{{ p.intro }}</p>
                <router-link to="/products" class="btn btn-brown btn-sm">Xem thêm</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quality Section -->
    <section class="quality py-5 my-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
            <h2 class="mb-3">Chất Lượng Là Ưu Tiên Hàng Đầu</h2>
            <p class="text-muted">Bình Coffee được thành lập với sứ mệnh mang đến cho khách hàng những tách cà phê tuyệt vời nhất. Chúng tôi sử dụng các hạt cà phê cao cấp được nhập khẩu từ các vùng trồng cà phê nổi tiếng nhất trên thế giới.</p>
            <p class="text-muted">Mỗi sản phẩm của chúng tôi đều trải qua quá trình kiểm định chất lượng nghiêm ngặt để đảm bảo hương vị tuyệt hảo và tỉ mỉ nhất quán.</p>
          </div>

          <div class="col-lg-6">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="stat-card">
                  <div class="fs-1 fw-bold text-brown">500+</div>
                  <p class="mb-0">Khách Hàng Hài Lòng</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="stat-card">
                  <div class="fs-1 fw-bold text-brown">10+</div>
                  <p class="mb-0">Loại Cà Phê</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="stat-card">
                  <div class="fs-1 fw-bold text-brown">5+</div>
                  <p class="mb-0">Năm Kinh Nghiệm</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="stat-card">
                  <div class="fs-1 fw-bold text-brown">100%</div>
                  <p class="mb-0">Tự Nhiên</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials py-5 my-5">
      <div class="container">
        <h2 class="text-center mb-5">Khách Hàng Nói Gì Về Chúng Tôi</h2>
        
        <div class="row g-4">
          <div class="col-md-6 col-lg-4">
            <div class="testimonial-card h-100">
              <div class="stars mb-3">★★★★★</div>
              <p class="mb-3">"Cà phê của Bình Coffee thực sự tuyệt vời! Hương vị đậm đà, mùi thơm quyến rũ. Tôi đã trở thành khách hàng thường xuyên."</p>
              <strong>- Nguyễn Văn A</strong>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="testimonial-card h-100">
              <div class="stars mb-3">★★★★★</div>
              <p class="mb-3">"Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm chất lượng cao và giá cả hợp lý. Rất hài lòng!"</p>
              <strong>- Trần Thị B</strong>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="testimonial-card h-100">
              <div class="stars mb-3">★★★★★</div>
              <p class="mb-3">"Tôi là người yêu thích cà phê, và Bình Coffee là lựa chọn tốt nhất của tôi. Chất lượng không thua các thương hiệu quốc tế."</p>
              <strong>- Lê Văn C</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 text-center">
            <h2 class="mb-2">Nhận Thông Tin Khuyến Mãi</h2>
            <p class="mb-4">Đăng ký nhận email để cập nhật các sản phẩm mới và khuyến mãi độc quyền</p>
            <form class="d-flex gap-2" @submit.prevent>
              <input type="email" class="form-control" placeholder="Nhập email của bạn..." aria-label="Email" />
              <button class="btn btn-light" type="submit">Đăng Ký</button>
            </form>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import heroVideo2 from '../assets/media/video2.mp4';
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
.text-brown {
  color: #6d4c41;
}

.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 420px;
  display: flex;
  align-items: center;
}

.hero-bg-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  z-index: 0;
  filter: brightness(0.55) saturate(0.9);
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45));
  z-index: 1;
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
</style>