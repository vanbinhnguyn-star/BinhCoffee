import express from 'express';
import { getWishlist, getWishlistIds, toggleWishlist } from '../../controllers/wishlistController.js';
import { verifyToken } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getWishlist);
router.get('/ids', verifyToken, getWishlistIds);
router.post('/:productId/toggle', verifyToken, toggleWishlist);

export default router;