import express from 'express';
import { createWorkflow, getWorkflows } from '../controllers/workflowController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createWorkflow);
router.get('/', protect, getWorkflows);

export default router;
