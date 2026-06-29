import express from 'express';
import { getStats } from '../../controllers/statsController.js';
import { verifyToken, isAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, getStats);

export default router;