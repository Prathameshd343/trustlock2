import express from 'express';
import { createOrganization, createTeam } from '../controllers/orgController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createOrganization);
router.post('/teams', protect, createTeam);

export default router;
