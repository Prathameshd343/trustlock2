import { Response } from 'express';
import Workflow from '../models/Workflow';
import { AuthRequest } from '../middleware/authMiddleware';

export const createWorkflow = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, triggerEvent, action } = req.body;
    
    if (!req.user.organization) {
      res.status(400).json({ message: 'You must belong to an organization' });
      return;
    }

    if (req.user.orgRole !== 'owner' && req.user.orgRole !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const workflow = await Workflow.create({
      name,
      triggerEvent,
      action,
      organization: req.user.organization
    });

    res.status(201).json(workflow);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkflows = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user.organization) {
      res.status(400).json({ message: 'You must belong to an organization' });
      return;
    }

    const workflows = await Workflow.find({ organization: req.user.organization });
    res.json(workflows);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
