<template>
  <div class="home">

    <!-- ===== HERO ===== -->
    <section class="hero-section">
      <video autoplay muted loop playsinline>
        <source :src="heroVideo2" type="video/mp4" />
      </video>
      <div class="hero-overlay"></div>
      <div class="hero-content container text-center text-white">
        <p class="hero-sub mb-3">☕ Chào mừng đến với Bình Coffee</p>
        <h1 class="hero-title mb-4">Hương Vị Cà Phê Thế Giới<br/><em>Sản Xuất Tại Việt Nam</em></h1>
        <p class="hero-desc mb-5">Từ những hạt cà phê được chọn lọc kỹ càng đến từng tách cà phê hoàn hảo</p>
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          <router-link to="/products" class="btn btn-gold btn-lg px-5">Khám Phá Ngay</router-link>
          <router-link to="/about" class="btn btn-outline-light btn-lg px-5">Về Chúng Tôi</router-link>
        </div>
      </div>
      <!-- Scroll indicator -->
      <div class="hero-scroll">
        <div class="scroll-dot"></div>
      </div>
    </section>

    <!-- ===== STATS ===== -->
    <section class="stats-section">
      <div class="container">
        <div class="row g-0">
          <div v-for="stat in stats" :key="stat.label" class="col-6 col-md-3 stat-item" v-fade-in>
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== GỢI Ý HÔM NAY ===== -->
    <section class="py-5 my-3">
      <div class="container">
        <div class="section-header text-center mb-5" v-fade-in>
          <span class="section-tag">✦ Nổi bật</span>
          <h2 class="section-title">Gợi Ý Hôm Nay</h2>
          <p class="section-sub">Ba lựa chọn được chúng tôi đề xuất để bạn bắt đầu ngày mới thật trọn vẹn</p>
        </div>
        <div class="row g-4">
          <div v-for="p in spotlightProducts" :key="p.id" class="col-md-4" v-fade-in>
            <div class="spotlight-card">
              <div class="spotlight-img-wrap">
                <img :src="p.image" :alt="p.name" />
                <div class="spotlight-badge" v-if="p.badge">{{ p.badge }}</div>
              </div>
              <div class="spotlight-body">
                <h5>{{ p.name }}</h5>
                <p class="text-muted small">{{ p.intro }}</p>
                <router-link to="/products" class="btn btn-brown btn-sm">Xem thêm →</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== SẢN PHẨM NỔI BẬT ===== -->
    <section class="featured-section py-5">
      <div class="container">
        <div class="section-header text-center mb-5" v-fade-in>
          <span class="section-tag">✦ Bán chạy</span>
          <h2 class="section-title">Sản Phẩm Nổi Bật</h2>
          <p class="section-sub">Những sản phẩm được yêu thích nhất tại Bình Coffee</p>
        </div>
        <div class="row g-4">
          <div v-for="product in featuredProducts" :key="product._id" class="col-6 col-md-3" v-fade-in>
            <ProductCard :product="product" />
          </div>
        </div>
        <div class="text-center mt-5" v-fade-in>
          <router-link to="/products" class="btn btn-brown btn-lg px-5">
            Xem tất cả sản phẩm →
          </router-link>
        </div>
      </div>
    </section>

    <!-- ===== CHẤT LƯỢNG ===== -->
    <section class="quality-section py-5 my-3">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6" v-fade-in>
            <span class="section-tag">✦ Cam kết</span>
            <h2 class="section-title text-start mt-2 mb-3">Chất Lượng Là<br/>Ưu Tiên Hàng Đầu</h2>
            <p class="text-muted mb-3">Bình Coffee được thành lập với sứ mệnh mang đến cho khách hàng những tách cà phê tuyệt vời nhất. Chúng tôi sử dụng các hạt cà phê cao cấp được chọn lọc kỹ từ các vùng trồng nổi tiếng nhất trên thế giới.</p>
            <p class="text-muted mb-4">Mỗi sản phẩm đều trải qua quy trình kiểm định nghiêm ngặt để đảm bảo hương vị hoàn hảo và nhất quán.</p>
            <div class="d-flex gap-3 flex-wrap">
              <div class="quality-badge">🌱 Tự nhiên 100%</div>
              <div class="quality-badge">🏆 Đạt chuẩn quốc tế</div>
              <div class="quality-badge">🚚 Giao hàng nhanh</div>
            </div>
          </div>
          <div class="col-lg-6" v-fade-in>
            <div class="row g-3">
              <div v-for="s in statCards" :key="s.label" class="col-6">
                <div class="stat-card text-center p-4">
                  <div class="stat-card-icon">{{ s.icon }}</div>
                  <div class="stat-card-num">{{ s.num }}</div>
                  <div class="stat-card-label">{{ s.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== QUY TRÌNH ===== -->
    <section class="process-section py-5 my-3">
      <div class="container">
        <div class="section-header text-center mb-5" v-fade-in>
          <span class="section-tag">✦ Quy trình</span>
          <h2 class="section-title">Từ Hạt Đến Tách</h2>
          <p class="section-sub">Hành trình tạo nên những tách cà phê hoàn hảo</p>
        </div>
        <div class="row g-4">
          <div v-for="step in steps" :key="step.title" class="col-6 col-md-3 text-center" v-fade-in>
            <div class="process-step">
              <div class="process-icon">{{ step.icon }}</div>
              <div class="process-num">{{ step.num }}</div>
              <h6 class="mt-3 mb-2">{{ step.title }}</h6>
              <p class="text-muted small mb-0">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONIALS ===== -->
    <section class="testimonials-section py-5 my-3">
      <div class="container">
        <div class="section-header text-center mb-5" v-fade-in>
          <span class="section-tag">✦ Đánh giá</span>
          <h2 class="section-title">Khách Hàng Nói Gì</h2>
        </div>
        <div class="row g-4">
          <div v-for="t in testimonials" :key="t.name" class="col-md-4" v-fade-in>
            <div class="testimonial-card">
              <div class="text-warning mb-3">★★★★★</div>
              <p class="testimonial-text">"{{ t.text }}"</p>
              <div class="testimonial-author">
                <div class="testimonial-avatar">{{ t.name[0] }}</div>
                <div>
                  <div class="fw-semibold small">{{ t.name }}</div>
                  <div class="text-muted small">{{ t.role }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== NEWSLETTER ===== -->
    <section class="newsletter-section py-5">
      <div class="container">
        <div class="newsletter-card text-center" v-fade-in>
          <h2 class="mb-2">Nhận Ưu Đãi Độc Quyền</h2>
          <p class="text-muted mb-4">Đăng ký nhận email để cập nhật sản phẩm mới và khuyến mãi đặc biệt</p>
          <form class="newsletter-form" @submit.prevent>
            <input type="email" placeholder="Nhập email của bạn..." />
            <button type="submit" class="btn btn-brown">Đăng Ký</button>
          </form>
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

const stats = [
  { number: '500+', label: 'Khách hàng hài lòng' },
  { number: '10+',  label: 'Loại cà phê' },
  { number: '5+',   label: 'Năm kinh nghiệm' },
  { number: '100%', label: 'Nguyên liệu tự nhiên' },
];

const statCards = [
  { icon: '😊', num: '500+', label: 'Khách hàng hài lòng' },
  { icon: '☕', num: '10+',  label: 'Loại cà phê' },
  { icon: '⭐', num: '5+',   label: 'Năm kinh nghiệm' },
  { icon: '🌱', num: '100%', label: 'Tự nhiên' },
];

const steps = [
  { icon: '🌿', num: '01', title: 'Chọn hạt',    desc: 'Hạt cà phê được chọn lọc kỹ từ những vùng cao nguyên tốt nhất' },
  { icon: '🔥', num: '02', title: 'Rang kỹ',     desc: 'Rang theo công thức riêng, kiểm soát nhiệt độ chính xác' },
  { icon: '⚙️', num: '03', title: 'Xay & Pha',   desc: 'Xay đúng độ mịn, pha theo phương pháp phù hợp từng loại' },
  { icon: '📦', num: '04', title: 'Đóng gói',    desc: 'Đóng gói bảo quản hương vị, giao nhanh đến tay bạn' },
];

const spotlightProducts = ref([
  { id: 's1', name: 'Cà Phê Rang Xay Đặc Biệt', image: cafeRangXay, intro: 'Hạt chọn lọc, rang tại chỗ, hương thơm đậm đà cho buổi sáng tỉnh táo.', badge: '🔥 Hot' },
  { id: 's2', name: 'Blend Espresso Sáng Tạo',  image: espressoBlend, intro: 'Dành cho fan espresso: crema đẹp, vị cân bằng và hậu ngọt.', badge: '⭐ Mới' },
  { id: 's3', name: 'Cà Phê Sữa Đá Thơm Ngon', image: caPheSuaDa, intro: 'Kết hợp sữa béo và cà phê rang kỹ — mát lạnh và ngọt ngào.', badge: null },
]);

const testimonials = [
  { name: 'Nguyễn Văn An',  role: 'Khách hàng thường xuyên', text: 'Cà phê của Bình Coffee thực sự tuyệt vời! Hương vị đậm đà, mùi thơm quyến rũ. Tôi đã trở thành khách hàng thường xuyên.' },
  { name: 'Trần Thị Bình',  role: 'Khách hàng mới',          text: 'Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm chất lượng cao và giá cả hợp lý. Rất hài lòng!' },
  { name: 'Lê Hoàng Minh',  role: 'Người yêu cà phê',        text: 'Tôi là người yêu thích cà phê, và Bình Coffee là lựa chọn tốt nhất. Chất lượng không thua các thương hiệu quốc tế.' },
];

const featuredProducts = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get('/api/products');
    featuredProducts.value = res.data.filter(p => p.isBestSeller || p.isNew).slice(0, 4);
  } catch {}
});
</script>

<style scoped>
/* ===== HERO ===== */
.hero-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.hero-section video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(62,39,35,0.7) 100%);
}
.hero-content {
  position: relative;
  z-index: 2;
  padding: 40px 20px;
}
.hero-sub {
  font-size: 0.95rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.8;
}
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 700;
  line-height: 1.2;
}
.hero-title em { color: #d7a86e; font-style: italic; }
.hero-desc { font-size: 1.1rem; opacity: 0.85; max-width: 550px; margin: 0 auto; }

.btn-gold {
  background: #d7a86e;
  border-color: #d7a86e;
  color: #3e2723;
  font-weight: 600;
}
.btn-gold:hover { background: #c49050; border-color: #c49050; color: #3e2723; }

.hero-scroll {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
.scroll-dot {
  width: 6px; height: 30px;
  border-radius: 3px;
  background: rgba(255,255,255,0.5);
  animation: scrollAnim 1.5s ease-in-out infinite;
}
@keyframes scrollAnim {
  0%, 100% { transform: scaleY(1); opacity: 0.5; }
  50% { transform: scaleY(0.5); opacity: 1; }
}

/* ===== STATS BAR ===== */
.stats-section {
  background: #3e2723;
  padding: 0;
}
.stat-item {
  padding: 28px 20px;
  text-align: center;
  border-right: 1px solid rgba(255,255,255,0.1);
}
.stat-item:last-child { border-right: none; }
.stat-number { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: #d7a86e; }
.stat-label { font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-top: 4px; }

/* ===== SECTION HEADER ===== */
.section-tag {
  font-size: 0.78rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #d7a86e;
  font-weight: 600;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #3e2723;
  margin-top: 8px;
}
.section-sub { color: #9e8075; font-size: 0.95rem; }

/* ===== SPOTLIGHT ===== */
.spotlight-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(62,39,35,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.spotlight-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(62,39,35,0.16);
}
.spotlight-img-wrap {
  position: relative;
  overflow: hidden;
  height: 200px;
}
.spotlight-img-wrap img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.spotlight-card:hover .spotlight-img-wrap img { transform: scale(1.06); }
.spotlight-badge {
  position: absolute;
  top: 12px; left: 12px;
  background: #d7a86e;
  color: #3e2723;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.spotlight-body { padding: 20px; }
.spotlight-body h5 { font-family: 'Playfair Display', serif; margin-bottom: 8px; }

/* ===== FEATURED ===== */
.featured-section { background: #f9f6f0; }

/* ===== QUALITY ===== */
.quality-badge {
  background: #f0e9e5;
  color: #6d4c41;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}
.stat-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(62,39,35,0.08);
}
.stat-card-icon { font-size: 1.8rem; margin-bottom: 8px; }
.stat-card-num { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: #6d4c41; }
.stat-card-label { font-size: 0.82rem; color: #9e8075; margin-top: 4px; }

/* ===== PROCESS ===== */
.process-section { background: #f9f6f0; }
.process-step { padding: 20px; }
.process-icon { font-size: 2.5rem; margin-bottom: 8px; }
.process-num { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; color: #e8ddd8; line-height: 1; }

/* ===== TESTIMONIALS ===== */
.testimonial-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(62,39,35,0.08);
  height: 100%;
}
.testimonial-text { font-style: italic; color: #555; line-height: 1.7; margin-bottom: 20px; }
.testimonial-author { display: flex; align-items: center; gap: 12px; }
.testimonial-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: #6d4c41;
  color: white;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

/* ===== NEWSLETTER ===== */
.newsletter-section { background: #3e2723; }
.newsletter-card { padding: 60px 20px; }
.newsletter-card h2 { font-family: 'Playfair Display', serif; color: white; }
.newsletter-card p { color: rgba(255,255,255,0.7); }
.newsletter-form {
  display: flex;
  gap: 8px;
  max-width: 480px;
  margin: 0 auto;
}
.newsletter-form input {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.9rem;
  outline: none;
}
.btn-brown {
  background-color: #d7a86e;
  border-color: #d7a86e;
  color: #3e2723;
  font-weight: 600;
  white-space: nowrap;
}
.btn-brown:hover { background-color: #c49050; color: #3e2723; }

@media (max-width: 768px) {
  .hero-title { font-size: 1.8rem; }
  .newsletter-form { flex-direction: column; }
  .newsletter-form input, .newsletter-form button { width: 100%; }
}
</style>