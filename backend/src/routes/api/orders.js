import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from '../../controllers/orderController.js';
import { verifyToken, isAdmin } from '../../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/:id', verifyToken, getOrderById);

// Admin routes
router.get('/', verifyToken, isAdmin, getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, updateOrderStatus);
router.delete('/:id', verifyToken, isAdmin, deleteOrder);

export default router;