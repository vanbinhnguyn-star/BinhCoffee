import Wishlist from '../models/Wishlist.js';

// Lấy danh sách yêu thích của user (kèm thông tin sản phẩm)
export const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.userId })
      .populate('product')
      .sort('-createdAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách ID sản phẩm đã thích (dùng để hiện trạng thái tim trên card)
export const getWishlistIds = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.userId }).select('product');
    res.json(items.map(i => i.product));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle: bấm tim lần đầu = thêm, bấm lần 2 = bỏ thích
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const existing = await Wishlist.findOne({ user: userId, product: productId });

    if (existing) {
      await existing.deleteOne();
      return res.json({ liked: false, message: 'Đã bỏ khỏi danh sách yêu thích' });
    } else {
      await Wishlist.create({ user: userId, product: productId });
      return res.json({ liked: true, message: 'Đã thêm vào danh sách yêu thích' });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ liked: true, message: 'Đã có trong danh sách yêu thích' });
    }
    res.status(500).json({ message: error.message });
  }
};