import express from 'express';
import authRouter from './api/auth.js';
import productsRouter from './api/products.js';
import ordersRouter from './api/orders.js';
import statsRouter from './api/stats.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);
router.use('/stats', statsRouter);

export default router;