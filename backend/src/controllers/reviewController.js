import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Lấy tất cả review của 1 sản phẩm
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm review
export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    // Kiểm tra user đã mua sản phẩm này chưa
    const hasBought = await Order.findOne({
      user: userId,
      'items.product': productId,
      status: 'delivered'
    });
    if (!hasBought) {
      return res.status(403).json({ message: 'Bạn cần mua và nhận sản phẩm này trước khi đánh giá' });
    }

    // Kiểm tra đã review chưa
    const existing = await Review.findOne({ product: productId, user: userId });
    if (existing) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
    }

    // Tạo review
    const review = new Review({ product: productId, user: userId, rating, comment });
    await review.save();

    // Cập nhật rating trung bình và số lượng review trên Product
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviews: allReviews.length
    });

    await review.populate('user', 'name');
    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Xóa review (chính chủ hoặc admin)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });

    if (review.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xóa đánh giá này' });
    }

    await review.deleteOne();

    // Cập nhật lại rating sau khi xóa
    const allReviews = await Review.find({ product: review.product });
    const avgRating = allReviews.length
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
    await Product.findByIdAndUpdate(review.product, {
      rating: Math.round(avgRating * 10) / 10,
      reviews: allReviews.length
    });

    res.json({ message: 'Xóa đánh giá thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};