import { Response } from 'express';
import APIKey from '../models/APIKey';
import { AuthRequest } from '../middleware/authMiddleware';
import crypto from 'crypto';

export const generateAPIKey = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    
    if (!req.user.organization) {
      res.status(400).json({ message: 'You must belong to an organization to generate an API key' });
      return;
    }

    // Generate a secure random API key
    const rawKey = crypto.randomBytes(32).toString('hex');
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await APIKey.create({
      name,
      keyHash: hashedKey,
      organization: req.user.organization,
      createdBy: req.user._id
    });

    res.status(201).json({
      _id: apiKey._id,
      name: apiKey.name,
      key: rawKey, // Only return the raw key once!
      createdAt: apiKey.createdAt
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAPIKeys = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user.organization) {
      res.status(400).json({ message: 'You must belong to an organization' });
      return;
    }

    const keys = await APIKey.find({ organization: req.user.organization }).select('-keyHash');
    res.json(keys);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
