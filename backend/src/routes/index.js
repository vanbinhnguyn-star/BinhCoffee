import express from 'express';
import authRouter from './api/auth.js';
import productsRouter from './api/products.js';
import ordersRouter from './api/orders.js';
import statsRouter from './api/stats.js';
import reviewsRouter from './api/reviews.js';

const router = express.Router();

router.use('/auth', authRouter);

// ✅ Đặt route reviews TRƯỚC route products
// để '/products/:id/reviews' được match đúng, không bị '/products' chặn mất
router.use('/products/:productId/reviews', reviewsRouter);
router.use('/products', productsRouter);

router.use('/orders', ordersRouter);
router.use('/stats', statsRouter);

export default router;