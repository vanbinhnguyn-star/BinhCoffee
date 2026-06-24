<template>
  <div class="container my-5">
    <h1 class="text-center mb-2 display-5">Danh Sách Sản Phẩm</h1>
    <p class="text-center text-brown mb-4">Tất cả những loại cà phê chọn lọc kỹ càng dành cho bạn</p>

    <!-- Bộ lọc -->
    <div class="d-flex justify-content-center gap-3 mb-5">
      <select v-model="category" class="form-select" style="width: 200px;">
        <option value="">Tất cả danh mục</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select v-model="sortBy" class="form-select" style="width: 200px;">
        <option value="newest">Mới nhất</option>
        <option value="price-asc">Giá thấp → cao</option>
        <option value="price-desc">Giá cao → thấp</option>
        <option value="rating">Đánh giá cao nhất</option>
      </select>
    </div>

    <div class="row g-4">
      <div class="col-md-6 col-lg-3" v-for="product in filteredProducts" :key="product.id">
        <ProductCard :product="product" />
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
  {
    id: 1,
    name: 'Cà Phê Rang Xay Đặc Biệt',
    category: 'Pha phin',
    price: 120000,
    rating: 4.8,
    reviews: 128,
    image: cafeRangXay,
    isNew: true,
    isBestSeller: true,
    description: 'Hương thơm đậm đà, thích hợp pha phin truyền thống.'
  },
  {
    id: 2,
    name: 'Blend Espresso Sáng Tạo',
    category: 'Espresso',
    price: 95000,
    rating: 4.6,
    reviews: 86,
    image: espressoBlend,
    isNew: false,
    isBestSeller: true,
    description: 'Pha espresso với vị chua nhẹ và hậu ngọt êm.'
  },
  {
    id: 3,
    name: 'Cà Phê Sữa Đá Thơm Ngon',
    category: 'Pha lạnh',
    price: 89000,
    rating: 4.7,
    reviews: 102,
    image: caPheSuaDa,
    isNew: false,
    isBestSeller: false,
    description: 'Sữa béo mịn kết hợp cùng cà phê rang kỹ, uống ngay là mê.'
  },
  {
    id: 4,
    name: 'Cà Phê Arabica Mộc',
    category: 'Pha máy',
    price: 135000,
    rating: 4.9,
    reviews: 149,
    image: arabicaMoc,
    isNew: true,
    isBestSeller: false,
    description: 'Hương thơm trái cây nhẹ nhàng, vị mịn màng cho pha máy hiện đại.'
  },
  {
    id: 5,
    name: 'Robusta Dự Phòng Năng Lượng',
    category: 'Pha phin',
    price: 78000,
    rating: 4.5,
    reviews: 95,
    image: robustaNangLuong,
    isNew: false,
    isBestSeller: true,
    description: 'Đậm đà, hậu vị mạnh mẽ, thích hợp khi bạn cần tỉnh táo cả ngày.'
  },
  {
    id: 6,
    name: 'Hạt Cà Phê Cốt Dừa',
    category: 'Hương vị',
    price: 142000,
    rating: 4.7,
    reviews: 73,
    image: caPheCotDua,
    isNew: false,
    isBestSeller: false,
    description: 'Hương dừa béo nhẹ kết hợp cùng thơm ngon của cà phê rang.'
  },
  {
    id: 7,
    name: 'Cà Phê Đen Không Đường',
    category: 'Pha phin',
    price: 82000,
    rating: 4.4,
    reviews: 64,
    image: caPheDen,
    isNew: false,
    isBestSeller: false,
    description: 'Vị đắng chát dễ chịu, phù hợp người thích uống nguyên chất.'
  },
  {
    id: 8,
    name: 'Cà Phê Pha Lạnh Vị Chanh',
    category: 'Pha lạnh',
    price: 98000,
    rating: 4.8,
    reviews: 112,
    image: phaLanhChanh,
    isNew: true,
    isBestSeller: false,
    description: 'Pha lạnh sảng khoái, thêm chút chanh tạo vị tươi mát.'
  },
];

const products = ref([]);
const category = ref('');
const sortBy = ref('newest');

const categories = computed(() => {
  const cats = products.value.map(p => p.category);
  return [...new Set(cats)];
});

const filteredProducts = computed(() => {
  let list = products.value;
  if (category.value) {
    list = list.filter(p => p.category === category.value);
  }
  // sort
  switch (sortBy.value) {
    case 'newest':
      list = [...list].sort((a, b) => (a.isNew ? -1 : 1));
      break;
    case 'price-asc':
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
  }
  return list;
});

onMounted(async () => {
  try {
    const res = await axios.get('/api/products');
    products.value = res.data.length ? res.data : defaultProducts;
  } catch (error) {
    console.warn('Không lấy được dữ liệu API, dùng danh sách mặc định.');
    products.value = defaultProducts;
  }
});
</script>

<style scoped>
.text-brown {
  color: #6d4c41;
}
</style>