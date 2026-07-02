<template>
  <div class="products-page">

    <!-- Hero banner nhỏ -->
    <div class="products-hero">
      <div class="container text-center py-5">
        <h1 class="text-white mb-2">Danh Sách Sản Phẩm</h1>
        <p class="text-white-50 mb-0">Tất cả những loại cà phê chọn lọc kỹ càng dành cho bạn</p>
      </div>
    </div>

    <div class="container py-5">
      <div class="row g-4">

        <!-- Sidebar lọc -->
        <div class="col-lg-3">
          <div class="filter-panel">

            <!-- Tìm kiếm -->
            <div class="filter-section">
              <h6 class="filter-title">🔍 Tìm kiếm</h6>
              <input
                type="text"
                class="form-control"
                v-model="search"
                placeholder="Tên sản phẩm..."
              />
            </div>

            <!-- Danh mục -->
            <div class="filter-section">
              <h6 class="filter-title">☕ Danh mục</h6>
              <div class="category-list">
                <label class="category-item" :class="{ active: category === '' }">
                  <input type="radio" v-model="category" value="" hidden />
                  <span>Tất cả</span>
                  <span class="cat-count">{{ products.length }}</span>
                </label>
                <label
                  v-for="cat in categories"
                  :key="cat"
                  class="category-item"
                  :class="{ active: category === cat }"
                >
                  <input type="radio" v-model="category" :value="cat" hidden />
                  <span>{{ cat }}</span>
                  <span class="cat-count">{{ products.filter(p => p.category === cat).length }}</span>
                </label>
              </div>
            </div>

            <!-- Khoảng giá -->
            <div class="filter-section">
              <h6 class="filter-title">💰 Khoảng giá</h6>
              <div class="d-flex gap-2 align-items-center mb-2">
                <input type="number" class="form-control form-control-sm" v-model="minPrice" placeholder="Từ" />
                <span class="text-muted">—</span>
                <input type="number" class="form-control form-control-sm" v-model="maxPrice" placeholder="Đến" />
              </div>
              <div class="text-muted small">
                {{ minPrice ? formatPrice(minPrice) : '0 ₫' }} — {{ maxPrice ? formatPrice(maxPrice) : 'Tất cả' }}
              </div>
            </div>

            <!-- Đánh giá -->
            <div class="filter-section">
              <h6 class="filter-title">⭐ Đánh giá từ</h6>
              <div class="d-flex gap-2 flex-wrap">
                <button
                  v-for="r in [0, 3, 4, 4.5]"
                  :key="r"
                  class="btn btn-sm"
                  :class="minRating === r ? 'btn-brown' : 'btn-outline-secondary'"
                  @click="minRating = r"
                >
                  {{ r === 0 ? 'Tất cả' : r + '★+' }}
                </button>
              </div>
            </div>

            <!-- Nút reset -->
            <button class="btn btn-outline-secondary w-100 mt-2" @click="resetFilters">
              ↺ Xóa bộ lọc
            </button>
          </div>
        </div>

        <!-- Phần sản phẩm -->
        <div class="col-lg-9">

          <!-- Toolbar trên -->
          <div class="products-toolbar mb-4">
            <div class="text-muted small">
              Hiển thị <strong>{{ filteredProducts.length }}</strong> / {{ products.length }} sản phẩm
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="text-muted small">Sắp xếp:</span>
              <select class="form-select form-select-sm" v-model="sortBy" style="width: auto;">
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="popular">Bán chạy nhất</option>
              </select>
              <!-- Toggle grid/list -->
              <button class="btn btn-sm btn-outline-secondary" @click="gridCols = gridCols === 3 ? 2 : 3">
                {{ gridCols === 3 ? '⊞' : '▦' }}
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-secondary"></div>
            <p class="text-muted mt-2 small">Đang tải sản phẩm...</p>
          </div>

          <!-- Không có sản phẩm -->
          <div v-else-if="filteredProducts.length === 0" class="text-center py-5 text-muted">
            <div style="font-size: 3rem;">☕</div>
            <p>Không tìm thấy sản phẩm phù hợp.</p>
            <button class="btn btn-brown" @click="resetFilters">Xóa bộ lọc</button>
          </div>

          <!-- Grid sản phẩm -->
          <div v-else :class="`row g-4 row-cols-1 row-cols-sm-2 row-cols-md-${gridCols}`">
            <div v-for="product in filteredProducts" :key="product._id || product.id" class="col">
              <ProductCard :product="product" />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import ProductCard from '../components/ProductCard.vue';

import cafeRangXay from '../assets/media/anh2.jpg';
import espressoBlend from '../assets/media/anh3.jpg';
import caPheSuaDa from '../assets/media/anh4.jpg';
import arabicaMoc from '../assets/media/anh5.jpg';
import robustaNangLuong from '../assets/media/anh6.jpg';
import caPheCotDua from '../assets/media/anh7.jpg';
import caPheDen from '../assets/media/anh8.jpg';
import phaLanhChanh from '../assets/media/anh9.jpg';

const defaultProducts = [
  { id: 1, name: 'Cà Phê Rang Xay Đặc Biệt', category: 'Pha phin', price: 120000, rating: 4.8, reviews: 128, image: cafeRangXay, isNew: true, isBestSeller: true, description: 'Hương thơm đậm đà, thích hợp pha phin truyền thống.' },
  { id: 2, name: 'Blend Espresso Sáng Tạo', category: 'Espresso', price: 95000, rating: 4.6, reviews: 86, image: espressoBlend, isNew: false, isBestSeller: true, description: 'Pha espresso với vị chua nhẹ và hậu ngọt êm.' },
  { id: 3, name: 'Cà Phê Sữa Đá Thơm Ngon', category: 'Pha lạnh', price: 89000, rating: 4.7, reviews: 102, image: caPheSuaDa, isNew: false, isBestSeller: false, description: 'Sữa béo mịn kết hợp cùng cà phê rang kỹ.' },
  { id: 4, name: 'Cà Phê Arabica Mộc', category: 'Pha máy', price: 135000, rating: 4.9, reviews: 149, image: arabicaMoc, isNew: true, isBestSeller: false, description: 'Hương thơm trái cây nhẹ nhàng, vị mịn màng.' },
  { id: 5, name: 'Robusta Dự Phòng Năng Lượng', category: 'Pha phin', price: 78000, rating: 4.5, reviews: 95, image: robustaNangLuong, isNew: false, isBestSeller: true, description: 'Đậm đà, hậu vị mạnh mẽ.' },
  { id: 6, name: 'Hạt Cà Phê Cốt Dừa', category: 'Hương vị', price: 142000, rating: 4.7, reviews: 73, image: caPheCotDua, isNew: false, isBestSeller: false, description: 'Hương dừa béo nhẹ kết hợp thơm ngon cà phê rang.' },
  { id: 7, name: 'Cà Phê Đen Không Đường', category: 'Pha phin', price: 82000, rating: 4.4, reviews: 64, image: caPheDen, isNew: false, isBestSeller: false, description: 'Vị đắng chát dễ chịu, nguyên chất.' },
  { id: 8, name: 'Cà Phê Pha Lạnh Vị Chanh', category: 'Pha lạnh', price: 98000, rating: 4.8, reviews: 112, image: phaLanhChanh, isNew: true, isBestSeller: false, description: 'Pha lạnh sảng khoái, thêm chút chanh tươi mát.' },
];

const products = ref([]);
const loading = ref(false);
const search = ref('');
const category = ref('');
const sortBy = ref('newest');
const minPrice = ref('');
const maxPrice = ref('');
const minRating = ref(0);
const gridCols = ref(3);

const formatPrice = (p) => Number(p).toLocaleString('vi-VN');

const categories = computed(() => [...new Set(products.value.map(p => p.category))]);

const filteredProducts = computed(() => {
  let list = products.value;

  if (search.value.trim()) {
    list = list.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()));
  }
  if (category.value) {
    list = list.filter(p => p.category === category.value);
  }
  if (minPrice.value) {
    list = list.filter(p => p.price >= Number(minPrice.value));
  }
  if (maxPrice.value) {
    list = list.filter(p => p.price <= Number(maxPrice.value));
  }
  if (minRating.value > 0) {
    list = list.filter(p => p.rating >= minRating.value);
  }

  switch (sortBy.value) {
    case 'newest':      return [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case 'price-asc':   return [...list].sort((a, b) => a.price - b.price);
    case 'price-desc':  return [...list].sort((a, b) => b.price - a.price);
    case 'rating':      return [...list].sort((a, b) => b.rating - a.rating);
    case 'popular':     return [...list].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    default:            return list;
  }
});

const resetFilters = () => {
  search.value = '';
  category.value = '';
  sortBy.value = 'newest';
  minPrice.value = '';
  maxPrice.value = '';
  minRating.value = 0;
};

onMounted(async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/products');
    products.value = res.data.length ? res.data : defaultProducts;
  } catch {
    products.value = defaultProducts;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.products-hero {
  background: linear-gradient(135deg, #3e2723 0%, #6d4c41 100%);
  min-height: 160px;
  display: flex;
  align-items: center;
}

/* ===== Filter panel ===== */
.filter-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(62,39,35,0.08);
  position: sticky;
  top: 80px;
}
.filter-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0ebe6;
}
.filter-section:last-child { border-bottom: none; margin-bottom: 0; }
.filter-title {
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6d4c41;
  margin-bottom: 12px;
}

.category-list { display: flex; flex-direction: column; gap: 6px; }
.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.88rem;
  color: #555;
  transition: background 0.15s;
}
.category-item:hover { background: #f9f4f0; color: #6d4c41; }
.category-item.active { background: #f0e9e5; color: #6d4c41; font-weight: 600; }
.cat-count {
  background: #f0ebe6;
  color: #888;
  border-radius: 10px;
  padding: 1px 8px;
  font-size: 0.75rem;
}
.category-item.active .cat-count { background: #d7a86e; color: #3e2723; }

/* ===== Toolbar ===== */
.products-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(62,39,35,0.06);
}

.btn-brown {
  background-color: #6d4c41;
  border-color: #6d4c41;
  color: white;
}
.btn-brown:hover { background-color: #8d6242; color: white; }
</style>