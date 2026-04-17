import { Request, Response, NextFunction } from 'express';
import APIKey from '../models/APIKey';
import crypto from 'crypto';

export const protectAPI = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const apiKeyHeader = req.header('X-API-Key');

  if (!apiKeyHeader) {
    res.status(401).json({ message: 'API Key missing' });
    return;
  }

  try {
    const hashedKey = crypto.createHash('sha256').update(apiKeyHeader).digest('hex');
    const apiKey = await APIKey.findOne({ keyHash: hashedKey, isActive: true }).populate('organization createdBy');

    if (!apiKey) {
      res.status(401).json({ message: 'Invalid API Key' });
      return;
    }

    // Attach user and organization to request as if they logged in
    (req as any).user = apiKey.createdBy;
    (req as any).user.organization = apiKey.organization;
    
    // Update last used
    apiKey.lastUsedAt = new Date();
    await apiKey.save();

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, API key failed' });
  }
};
