import express from 'express';
import multer from 'multer';
import { uploadFile, getFiles, downloadFile } from '../controllers/fileController';
import { protect } from '../middleware/authMiddleware';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/', protect, getFiles);
router.get('/download/:id', protect, downloadFile);

export default router;
