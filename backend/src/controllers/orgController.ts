import { Response } from 'express';
import Organization from '../models/Organization';
import User from '../models/User';
import Team from '../models/Team';
import { AuthRequest } from '../middleware/authMiddleware';

export const createOrganization = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    
    // Check if user already belongs to an org
    if (req.user.organization) {
      res.status(400).json({ message: 'You already belong to an organization' });
      return;
    }

    const org = await Organization.create({ name });
    
    // Make creator the owner
    req.user.organization = org._id;
    req.user.orgRole = 'owner';
    await req.user.save();

    res.status(201).json(org);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    
    if (!req.user.organization) {
      res.status(400).json({ message: 'You must belong to an organization to create a team' });
      return;
    }

    if (req.user.orgRole !== 'owner' && req.user.orgRole !== 'admin') {
      res.status(403).json({ message: 'Only owners or admins can create teams' });
      return;
    }

    const team = await Team.create({
      name,
      organization: req.user.organization
    });

    res.status(201).json(team);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
