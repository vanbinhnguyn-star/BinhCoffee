<template>
  <div class="container my-5">
    <h1 class="text-center mb-5 display-5">Liên Hệ Chúng Tôi</h1>
    <div class="row g-5">
      <div class="col-lg-5">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title text-brown mb-3">Thông Tin Liên Hệ</h5>
            <p class="mb-2">
              <strong>Địa chỉ:</strong><br>
              123 Đường Nguyễn Huệ, Quận 1, TP HCM
            </p>
            <p class="mb-2">
              <strong>Điện thoại:</strong><br>
              1900 1234
            </p>
            <p class="mb-2">
              <strong>Email:</strong><br>
              info@binhcoffee.com
            </p>
            <p class="mb-0">
              <strong>Giờ làm việc:</strong><br>
              Thứ 2 - Chủ Nhật: 7AM - 10PM
            </p>
          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <form class="card shadow-sm border-0 p-4">
          <div class="mb-3">
            <label for="name" class="form-label">Tên của bạn</label>
            <input type="text" class="form-control" id="name" placeholder="Nhập tên..." />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" placeholder="Nhập email..." />
          </div>
          <div class="mb-3">
            <label for="message" class="form-label">Tin nhắn</label>
            <textarea class="form-control" id="message" rows="5" placeholder="Nhập tin nhắn của bạn..."></textarea>
          </div>
          <button type="submit" class="btn btn-brown">Gửi Tin Nhắn</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-brown {
  color: #6d4c41;
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