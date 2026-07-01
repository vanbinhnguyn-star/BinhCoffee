import express from 'express';
import authRouter from './api/auth.js';
import productsRouter from './api/products.js';
import ordersRouter from './api/orders.js';
import statsRouter from './api/stats.js';
import reviewsRouter from './api/reviews.js';
import wishlistRouter from './api/wishlist.js';

const router = express.Router();

router.use('/auth', authRouter);

// Route cụ thể hơn phải đặt trước route chung
router.use('/products/:productId/reviews', reviewsRouter);
router.use('/products', productsRouter);

router.use('/orders', ordersRouter);
router.use('/stats', statsRouter);
router.use('/wishlist', wishlistRouter);

export default router;