<template>
  <div class="container my-5">
    <h1 class="text-center mb-5 display-5">Về Bình Coffee</h1>
    <div class="about-hero mb-4 text-center">
      <video class="w-100 rounded-4 shadow-sm" autoplay muted loop playsinline>
        <source :src="heroVideo" type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>
    </div>

    <div class="row justify-content-center">
      <div class="col-lg-10">
        <p class="lead text-center text-muted mb-5">
          Bình Coffee là điểm đến cho những ai yêu cà phê nguyên chất, trải nghiệm pha chế tinh tế và bộ menu đa dạng. Mỗi câu chuyện của chúng tôi đều bắt đầu từ hạt cà phê, lan tỏa đến tay khách hàng qua từng tách đồ uống chất lượng.
        </p>

        <section id="coffee-journey" class="about-section mb-5">
          <div class="row align-items-center g-4">
            <div class="col-md-6">
              <h3>Hành trình tách cà phê</h3>
              <p>
                Mỗi tách cà phê tại Bình Coffee là một hành trình tinh tế từ hạt đến ly. Chúng tôi tuyển chọn hạt từ những vùng trồng nổi tiếng, rang xay kỹ lưỡng và pha chế theo quy trình chuẩn mực để giữ trọn hương vị tự nhiên.
              </p>
              <p>
                Từ nông trại đến bàn phục vụ, chúng tôi luôn theo dõi từng bước: thu hái chín đúng mùa, ủ ấm đúng cách và kiểm soát độ mịn khi xay. Kết quả là mỗi ngụm cà phê đều cân bằng giữa độ đậm, mùi thơm và hậu vị dịu nhẹ.
              </p>
            </div>
            <div class="col-md-6 text-center">
              <img :src="coffeeJourneyImg" alt="Hành trình tách cà phê" class="img-fluid rounded shadow-sm" />
            </div>
          </div>
        </section>

        <section id="coffee-beans" class="about-section mb-5 bg-light p-4 rounded-4">
          <div class="row g-4">
            <div class="col-md-6 text-center order-md-2">
              <img :src="coffeeBeansImg" alt="Hạt cà phê Bình Coffee" class="img-fluid rounded shadow-sm" />
            </div>
            <div class="col-md-6 order-md-1">
              <h3>Hạt cà phê Bình Coffee</h3>
              <p>
                Chúng tôi tự hào về nguồn hạt cà phê cao cấp, từ Arabica dịu êm đến Robusta đậm đà. Mỗi lô nguyên liệu đều được kiểm định chặt chẽ về độ ẩm, kích thước và chất lượng để đảm bảo tách cà phê luôn ổn định.
              </p>
              <p>
                Hạt được rang trong ngày, bảo quản cẩn thận để giữ trọn hương thơm và độ tươi. Điều này giúp Bình Coffee mang đến trải nghiệm tươi mới, đậm đà cho khách hàng tại quán lẫn khi mang về nhà.
              </p>
            </div>
          </div>
        </section>

        <section id="brewing-art" class="about-section mb-5">
          <div class="row align-items-center g-4">
            <div class="col-md-6">
              <h3>Nghệ thuật pha chế</h3>
              <p>
                Nghệ thuật pha chế tại Bình Coffee là sự hòa quyện giữa kỹ thuật và sáng tạo. Barista của chúng tôi được đào tạo bài bản để cân bằng nước, nhiệt độ và thời gian chiết xuất, tạo nên những tách cà phê có cấu trúc mượt mà và vị ngon tinh tế.
              </p>
              <p>
                Bên cạnh cà phê truyền thống, chúng tôi cũng nghiên cứu các thức uống đặc sắc như latte nghệ, cà phê sữa đá đặc biệt và đồ uống matcha. Mỗi món đều được chuẩn bị với tâm huyết và niềm đam mê phục vụ.
              </p>
            </div>
            <div class="col-md-6 text-center">
              <img :src="brewingArtImg" alt="Nghệ thuật pha chế" class="img-fluid rounded shadow-sm" />
            </div>
          </div>
        </section>

        <section id="company" class="about-section mb-5 bg-light p-4 rounded-4">
          <div class="row g-4">
            <div class="col-md-6 text-center order-md-2">
              <img :src="companyImg" alt="Giới thiệu công ty" class="img-fluid rounded shadow-sm" />
            </div>
            <div class="col-md-6 order-md-1">
              <h3>Giới thiệu công ty</h3>
              <p>
                Bình Coffee được xây dựng từ khát vọng mang phong cách cà phê Việt lên tầm cao mới. Công ty tập trung vào chất lượng dịch vụ, không gian ấm cúng và sản phẩm luôn tươi ngon.
              </p>
              <p>
                Chúng tôi đồng hành cùng khách hàng bằng những giá trị: thân thiện, chuyên nghiệp và sáng tạo. Bình Coffee không chỉ là nơi uống cà phê, mà còn là điểm gặp gỡ, chia sẻ trải nghiệm và thưởng thức nghệ thuật ẩm thực.
              </p>
            </div>
          </div>
        </section>

        <section id="gallery" class="about-section mb-5">
          <h3 class="mb-4">Thư viện hình ảnh</h3>
          <div class="row g-3 gallery-row">
            <div class="col-sm-6 col-lg-4">
              <img :src="gallery1Img" alt="Thư viện ảnh 1" class="img-fluid rounded shadow-sm" />
            </div>
            <div class="col-sm-6 col-lg-4">
              <img :src="gallery2Img" alt="Thư viện ảnh 2" class="img-fluid rounded shadow-sm" />
            </div>
            <div class="col-sm-6 col-lg-4">
              <img :src="gallery3Img" alt="Thư viện ảnh 3" class="img-fluid rounded shadow-sm" />
            </div>
          </div>
          <p class="mt-3 text-muted">
            Thư viện của Bình Coffee lưu giữ những khoảnh khắc đẹp: từ không gian quán, bàn pha chế chuyên nghiệp đến những ly đồ uống được hoàn thiện tỉ mỉ.
          </p>
        </section>

        <section id="contact" class="about-section mb-5 bg-light p-4 rounded-4">
          <div class="row g-4">
            <div class="col-md-6">
              <h3>Liên hệ</h3>
              <p>
                Nếu bạn muốn đặt hàng, hợp tác hay có câu hỏi về menu, hãy liên hệ với chúng tôi qua số điện thoại, email hoặc đến trực tiếp quán. Đội ngũ Bình Coffee luôn sẵn sàng tư vấn và phục vụ bạn chu đáo.
              </p>
              <ul class="contact-list">
                <li>Địa chỉ: 123 Đường Cà Phê, Quận 1, TP. HCM</li>
                <li>Hotline: 0900 123 456</li>
                <li>Email: info@binhcoffee.vn</li>
              </ul>
            </div>
            <div class="col-md-6 text-center">
              <img :src="contactImg" alt="Liên hệ Bình Coffee" class="img-fluid rounded shadow-sm" />
            </div>
          </div>
        </section>

        <section id="menu" class="about-section mb-5">
          <h3 class="mb-4">Hình ảnh menu</h3>
          <div class="row g-3">
            <div class="col-md-4">
              <img :src="menuImg1" alt="Hình ảnh menu 1" class="img-fluid rounded shadow-sm" />
            </div>
            <div class="col-md-4">
              <img :src="menuImg2" alt="Hình ảnh menu 2" class="img-fluid rounded shadow-sm" />
            </div>
            <div class="col-md-4">
              <img :src="menuImg3" alt="Hình ảnh menu 3" class="img-fluid rounded shadow-sm" />
            </div>
          </div>
          <p class="mt-3 text-muted">
            Menu của chúng tôi được thiết kế dễ nhìn, giúp khách hàng nhanh chóng chọn được thức uống yêu thích. Từ cà phê đen đá đến latte, mỗi món đều có mô tả rõ ràng và hình ảnh hấp dẫn.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import heroVideo from '../assets/media/video.mp4';
import coffeeJourneyImg from '../assets/media/anh1.jpg';
import coffeeBeansImg from '../assets/media/anh2.jpg';
import brewingArtImg from '../assets/media/anh3.jpg';
import companyImg from '../assets/media/anh4.jpg';
import gallery1Img from '../assets/media/anh5.jpg';
import gallery2Img from '../assets/media/anh6.jpg';
import gallery3Img from '../assets/media/anh7.jpg';
import contactImg from '../assets/media/anh8.jpg';
import menuImg1 from '../assets/media/anh9.jpg';
import menuImg2 from '../assets/media/anh10.jpg';
import menuImg3 from '../assets/media/anh11.jpg';

onMounted(() => {
  // ensure video tag updates if needed; static import guarantees bundling
});
</script>

<style scoped>
.text-brown {
  color: #6d4c41;
}

.about-section h3 {
  color: #3e2723;
  margin-bottom: 1rem;
}

.about-section p {
  color: #5c4b43;
  line-height: 1.72;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  color: #5c4b43;
}

.contact-list li {
  margin-bottom: 0.6rem;
}

.gallery-row img,
.about-section img {
  max-height: 280px;
  object-fit: cover;
}

.about-hero video {
  max-height: 420px;
  width: 100%;
  object-fit: cover;
}
</style>
