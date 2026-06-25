<template>
  <div class="container my-5">
    <h2>Quản lý sản phẩm</h2>
    <button class="btn btn-coffee mb-3" @click="showAddForm = !showAddForm">
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
          <div class="col-md-6">
            <input type="text" class="form-control" v-model="productForm.image" placeholder="URL hình ảnh" />
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
            <button type="submit" class="btn btn-coffee">
              {{ editingProduct ? 'Cập nhật' : 'Thêm mới' }}
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
          <tr v-for="product in products" :key="product._id">
            <td><img :src="product.image" style="width:50px; height:50px; object-fit:cover;" /></td>
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

const productForm = ref({
  name: '',
  category: '',
  price: 0,
  description: '',
  image: '',
  stock: 10,
  isNew: false,
  isBestSeller: false
});

const formatPrice = (price) => price.toLocaleString('vi-VN') + ' ₫';

const loadProducts = async () => {
  const res = await axios.get('/api/products');
  products.value = res.data;
};

const saveProduct = async () => {
  try {
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    let res;
    if (editingProduct.value) {
      res = await axios.put(`/api/products/${editingProduct.value._id}`, productForm.value, config);
    } else {
      res = await axios.post('/api/products', productForm.value, config);
    }
    await loadProducts();
    cancelForm();
    alert(editingProduct.value ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!');
  } catch (error) {
    alert(error.response?.data?.message || 'Lỗi!');
  }
};

const editProduct = (product) => {
  editingProduct.value = product;
  productForm.value = { ...product };
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
    alert(error.response?.data?.message || 'Lỗi!');
  }
};

const cancelForm = () => {
  showAddForm.value = false;
  editingProduct.value = null;
  productForm.value = {
    name: '',
    category: '',
    price: 0,
    description: '',
    image: '',
    stock: 10,
    isNew: false,
    isBestSeller: false
  };
};

onMounted(loadProducts);
</script>