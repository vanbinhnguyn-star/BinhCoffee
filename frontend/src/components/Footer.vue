<template>
  <footer class="footer mt-5 py-5">
    <div class="container">
      <div class="row g-4 mb-4">
        <div class="col-md-6 col-lg-3">
          <h5 class="mb-3">Bình Coffee</h5>
          <p class="text-muted">Chúng tôi cam kết mang đến những tách cà phê tuyệt vời nhất cho khách hàng của mình.</p>
          <div class="social-links">
            <a href="#" aria-label="Facebook" class="text-decoration-none">f</a>
            <a href="#" aria-label="Instagram" class="text-decoration-none">i</a>
            <a href="#" aria-label="Twitter" class="text-decoration-none">t</a>
            <a href="#" aria-label="YouTube" class="text-decoration-none">y</a>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <h5 class="mb-3">Danh Mục</h5>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="#" class="text-decoration-none">Cà Phê Hạt</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none">Cà Phê Rang</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none">Cà Phê Pha Sẵn</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none">Phụ Kiện</a></li>
          </ul>
        </div>

        <div class="col-md-6 col-lg-3">
          <h5 class="mb-3">Chính Sách</h5>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="#" class="text-decoration-none">Về Chúng Tôi</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none">Điều Khoản Sử Dụng</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none">Chính Sách Bảo Mật</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none">Điều Khoản Giao Hàng</a></li>
          </ul>
        </div>

        <div class="col-md-6 col-lg-3">
          <h5 class="mb-3">Hỗ Trợ</h5>
          <ul class="list-unstyled">
            <li class="mb-2"><a href="#" class="text-decoration-none">FAQ</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none">Liên Hệ</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none">Trả Hàng</a></li>
            <li class="mb-2"><a href="#" class="text-decoration-none">Bảo Hành</a></li>
          </ul>
        </div>
      </div>

      <hr class="my-4" style="border-top: 1px solid rgba(255, 255, 255, 0.08);">

      <div class="text-center">
        <p class="text-muted mb-0">&copy; 2025 Bình Coffee. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #2c1a12;
  color: #f0e5d8;
}

.footer h5 {
  color: #d7a86e;
  font-weight: 600;
}

.footer a {
  color: #f0e5d8;
  transition: color 0.2s ease;
}

.footer a:hover {
  color: #ffe8b3;
}

.social-links a {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #f0e5d8;
  font-weight: 700;
  margin-right: 8px;
  transition: background-color 0.2s ease;
}

.social-links a:hover {
  background-color: #d7a86e;
  color: #2c1a12;
}
</style>