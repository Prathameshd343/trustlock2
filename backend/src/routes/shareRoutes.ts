import express from 'express';
import { createShareLink, accessSharedFile } from '../controllers/shareController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Owner creates a share link
router.post('/', protect, createShareLink);

// Public/Guest accesses a shared file (can be unprotected or require password)
// Note: We don't use 'protect' middleware here because guests can access shares
router.post('/:token', accessSharedFile);

export default router;
