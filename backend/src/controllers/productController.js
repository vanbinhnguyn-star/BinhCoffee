import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FormData gửi tất cả dạng string → cần parse đúng kiểu
const parseProductData = (body, file) => {
  const data = {
    name:         body.name?.trim(),
    category:     body.category?.trim(),
    description:  body.description?.trim(),
    price:        Number(body.price),
    stock:        Number(body.stock),
    isNew:        body.isNew === 'true',
    isBestSeller: body.isBestSeller === 'true'
  };
  if (file) {
    data.image = `/uploads/products/${file.filename}`;
  }
  return data;
};

export const createProduct = async (req, res) => {
  try {
    const data = parseProductData(req.body, req.file);
    const product = new Product(data);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = parseProductData(req.body, req.file);

    // Nếu không chọn file mới thì không ghi đè image
    if (!req.file) delete data.image;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};