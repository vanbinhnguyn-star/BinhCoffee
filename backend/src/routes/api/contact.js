import express from 'express';
import { sendContact, getContacts, markRead, deleteContact } from '../../controllers/contactController.js';
import { verifyToken, isAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.post('/', sendContact);                          // User gửi (không cần đăng nhập)
router.get('/', verifyToken, isAdmin, getContacts);     // Admin xem
router.put('/:id/read', verifyToken, isAdmin, markRead); // Admin đánh dấu đọc
router.delete('/:id', verifyToken, isAdmin, deleteContact); // Admin xóa

export default router;