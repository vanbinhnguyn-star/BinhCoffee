import express from 'express';
import { getReviews, addReview, deleteReview } from '../../controllers/reviewController.js';
import { verifyToken, isAdmin } from '../../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.get('/', getReviews);
router.post('/', verifyToken, addReview);
router.delete('/:reviewId', verifyToken, deleteReview);

export default router;