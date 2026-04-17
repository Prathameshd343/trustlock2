import { Response } from 'express';
import Share from '../models/Share';
import File from '../models/File';
import { AuthRequest } from '../middleware/authMiddleware';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const createShareLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileId, permission, expiresInDays, password, sharedWithEmail } = req.body;

    const file = await File.findById(fileId);
    if (!file || file.owner.toString() !== req.user._id.toString()) {
      res.status(404).json({ message: 'File not found or unauthorized' });
      return;
    }

    const shareLinkToken = crypto.randomBytes(20).toString('hex');
    let expiresAt = undefined;
    
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
    }

    let hashedPassword = undefined;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newShare = await Share.create({
      file: fileId,
      owner: req.user._id,
      permission,
      expiresAt,
      password: hashedPassword,
      sharedWithEmail,
      shareLinkToken,
    });

    res.status(201).json({ 
      shareLink: `/share/${shareLinkToken}`,
      token: shareLinkToken
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const accessSharedFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body; // Client sends password if prompted

    const share = await Share.findOne({ shareLinkToken: token }).populate('file');
    
    if (!share) {
      res.status(404).json({ message: 'Invalid or expired share link' });
      return;
    }

    if (share.expiresAt && new Date() > share.expiresAt) {
      res.status(403).json({ message: 'Share link has expired' });
      return;
    }

    if (share.password) {
      if (!password) {
        res.status(401).json({ message: 'Password required' });
        return;
      }
      const isMatch = await bcrypt.compare(password, share.password);
      if (!isMatch) {
        res.status(401).json({ message: 'Incorrect password' });
        return;
      }
    }

    res.json({
      file: share.file,
      permission: share.permission
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
