import express from 'express';
import { generateAPIKey, getAPIKeys } from '../controllers/apiKeyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, generateAPIKey);
router.get('/', protect, getAPIKeys);

export default router;
