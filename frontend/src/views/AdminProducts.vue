<template>
  <div class="container my-5">
    <h2>Quản lý sản phẩm</h2>
    <button class="btn btn-brown btn-lg mb-4 px-4 shadow-sm fw-semibold" @click="showAddForm = !showAddForm">
      <i class="fas fa-plus"></i> Thêm sản phẩm
    </button>

    <!-- Add/Edit Form -->
    <div v-if="showAddForm || editingProduct" class="card p-4 mb-4">
      <h4>{{ editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới' }}</h4>
      <form @submit.prevent="saveProduct">
        <div class="row g-3">
          <div class="col-md-6">
            <input type="text" class="form-control" v-model="productForm.name" placeholder="Tên sản phẩm" required />
          </div>
          <div class="col-md-6">
            <input type="text" class="form-control" v-model="productForm.category" placeholder="Danh mục" required />
          </div>
          <div class="col-md-6">
            <input type="number" class="form-control" v-model="productForm.price" placeholder="Giá" required />
          </div>
          <div class="col-md-6">
            <input type="number" class="form-control" v-model="productForm.stock" placeholder="Số lượng tồn" required />
          </div>
          <div class="col-12">
            <textarea class="form-control" v-model="productForm.description" placeholder="Mô tả" rows="3"></textarea>
          </div>

          <!-- ✅ Chọn ảnh từ máy -->
          <div class="col-12">
            <label class="form-label">Hình ảnh sản phẩm</label>
            <input
              type="file"
              class="form-control"
              accept="image/*"
              @change="onFileChange"
            />
            <!-- Preview ảnh -->
            <div v-if="imagePreview" class="mt-2">
              <img :src="imagePreview" alt="Preview" style="height: 120px; object-fit: cover; border-radius: 8px;" />
            </div>
            <!-- Ảnh cũ khi đang sửa -->
            <div v-else-if="editingProduct?.image" class="mt-2">
              <img :src="editingProduct.image" alt="Ảnh hiện tại" style="height: 120px; object-fit: cover; border-radius: 8px;" />
              <p class="text-muted small mt-1">Ảnh hiện tại — chọn file mới để thay thế</p>
            </div>
          </div>

          <div class="col-md-3">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" v-model="productForm.isNew" />
              <label class="form-check-label">Sản phẩm mới</label>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" v-model="productForm.isBestSeller" />
              <label class="form-check-label">Bán chạy</label>
            </div>
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-coffee" :disabled="saving">
              {{ saving ? 'Đang lưu...' : (editingProduct ? 'Cập nhật' : 'Thêm mới') }}
            </button>
            <button type="button" class="btn btn-secondary ms-2" @click="cancelForm">Hủy</button>
          </div>
        </div>
      </form>
    </div>

    <!-- Products List -->
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Hình</th>
            <th>Tên</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="products.length === 0">
            <td colspan="6" class="text-center text-muted">Chưa có sản phẩm nào.</td>
          </tr>
          <tr v-for="product in products" :key="product._id">
            <td><img :src="product.image" style="width:50px; height:50px; object-fit:cover; border-radius:4px;" /></td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ formatPrice(product.price) }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" @click="editProduct(product)">Sửa</button>
              <button class="btn btn-sm btn-danger" @click="deleteProduct(product._id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const auth = useAuthStore();
const products = ref([]);
const showAddForm = ref(false);
const editingProduct = ref(null);
const imageFile = ref(null);     // file thực tế
const imagePreview = ref('');    // URL preview
const saving = ref(false);

const productForm = ref({
  name: '', category: '', price: 0,
  description: '', stock: 10,
  isNew: false, isBestSeller: false
});

const formatPrice = (price) => price.toLocaleString('vi-VN') + ' ₫';

// Khi chọn file → tạo preview
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
};

const loadProducts = async () => {
  try {
    const res = await axios.get('/api/products');
    products.value = res.data;
  } catch (error) {
    alert('Không thể tải danh sách sản phẩm.');
  }
};

const saveProduct = async () => {
  saving.value = true;
  try {
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };

    // Dùng FormData để gửi cả file lẫn data
    const formData = new FormData();
    formData.append('name', productForm.value.name);
    formData.append('category', productForm.value.category);
    formData.append('price', productForm.value.price);
    formData.append('stock', productForm.value.stock);
    formData.append('description', productForm.value.description);
    formData.append('isNew', productForm.value.isNew);
    formData.append('isBestSeller', productForm.value.isBestSeller);
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    if (editingProduct.value) {
      await axios.put(`/api/products/${editingProduct.value._id}`, formData, config);
      alert('Cập nhật thành công!');
    } else {
      await axios.post('/api/products', formData, config);
      alert('Thêm sản phẩm thành công!');
    }

    await loadProducts();
    cancelForm();
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi khi lưu sản phẩm!');
  } finally {
    saving.value = false;
  }
};

const editProduct = (product) => {
  editingProduct.value = product;
  productForm.value = {
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
    description: product.description,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller
  };
  imageFile.value = null;
  imagePreview.value = '';
  showAddForm.value = true;
};

const deleteProduct = async (id) => {
  if (!confirm('Bạn chắc chắn muốn xóa?')) return;
  try {
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    await axios.delete(`/api/products/${id}`, config);
    await loadProducts();
    alert('Xóa thành công!');
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi khi xóa!');
  }
};

const cancelForm = () => {
  showAddForm.value = false;
  editingProduct.value = null;
  imageFile.value = null;
  imagePreview.value = '';
  productForm.value = {
    name: '', category: '', price: 0,
    description: '', stock: 10,
    isNew: false, isBestSeller: false
  };
};

onMounted(loadProducts);
</script>