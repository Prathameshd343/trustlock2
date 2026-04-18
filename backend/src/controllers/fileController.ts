import { Response } from 'express';
import File from '../models/File';
import { AuthRequest } from '../middleware/authMiddleware';
import fs from 'fs';

export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('--- Upload Started ---');
    if (!req.file) {
      console.log('Upload Failed: No file in request');
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const { originalname, mimetype, size, path } = req.file;
    const { iv } = req.body;

    console.log('Upload File Details:', { originalname, mimetype, size, path });
    console.log('Upload Body Details:', req.body);
    console.log('Upload User Details:', { id: req.user?._id, org: req.user?.organization });

    if (!iv) {
      console.log('Upload Failed: Missing IV');
      res.status(400).json({ message: 'Encryption IV is required' });
      return;
    }

    let isPendingApproval = false;
    
    if (req.user && req.user.organization) {
      try {
        const Workflow = (await import('../models/Workflow')).default;
        const workflows = await Workflow.find({ 
          organization: req.user.organization, 
          triggerEvent: 'FILE_UPLOADED',
          isActive: true
        });
        
        for (const wf of workflows) {
          if (wf.action === 'REQUIRE_APPROVAL') {
            isPendingApproval = true;
          }
        }
      } catch (wfError) {
        console.error('Workflow error (ignored):', wfError);
      }
    }

    console.log('Creating Database Record...');
    const file = await File.create({
      originalName: originalname,
      mimeType: mimetype,
      size: size,
      path: path,
      iv: iv,
      owner: req.user._id,
      organization: req.user.organization,
      team: req.user.team,
      status: isPendingApproval ? 'pending_approval' : 'active'
    });

    console.log('Upload Success:', file._id);
    res.status(201).json(file);
  } catch (error: any) {
    console.error('Upload Controller Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getFiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    const files = await File.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    // In a real app, check sharing permissions here
    if (file.owner.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized to download this file' });
      return;
    }

    res.download(file.path, file.originalName);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
