<template>
  <div class="contact container">
    <h1>Liên Hệ Chúng Tôi</h1>
    <div class="contact-grid">
      <div class="info">
        <p><strong>Địa chỉ:</strong> 123 Đường Nguyễn Huệ, Quận 1, TP HCM</p>
        <p><strong>Điện thoại:</strong> 1900 1234</p>
        <p><strong>Email:</strong> info@binhcoffee.com</p>
        <p><strong>Giờ làm việc:</strong> Thứ 2 - Chủ Nhật: 7AM - 10PM</p>
      </div>
      <form class="form">
        <input type="text" placeholder="Tên của bạn" />
        <input type="email" placeholder="Email" />
        <textarea placeholder="Tin nhắn của bạn..."></textarea>
        <button class="btn" type="submit">Gửi Tin Nhắn</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.contact { padding: 40px 0; }
.contact h1 { text-align: center; margin-bottom: 30px; }
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; max-width: 900px; margin: auto; }
.info p { margin: 10px 0; }
.form { display: flex; flex-direction: column; gap: 15px; }
.form input, .form textarea { padding: 10px; border-radius: 5px; border: 1px solid #ccc; }
.form textarea { height: 120px; }
</style>