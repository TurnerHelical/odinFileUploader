import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const BASE_UPLOAD_DIR = process.env.UPLOAD_BASE_DIR || path.join(process.cwd(), 'uploads');

const MAX_SIZE = 50 * 1024 * 1024;

const BLOCKED_EXT = new Set([
  '.exe', '.dll', '.msi', '.bat', '.cmd', '.com', '.scr', '.ps1', '.vbs', '.js', '.jse', '.jar', '.apk', '.sh', '.bash', '.zsh', '.reg'
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user?.id;
    const folderId = Number(req.params.folderId);

    if (!userId || !Number.isInteger(folderId) || folderId <= 0) {
      return cb(new Error('Missing/Invalid user or folder information.'));
    }

    const uploadPath = path.join(
      BASE_UPLOAD_DIR,
      'users',
      String(userId),
      String(folderId),
    );


    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ext.replace(/[^.\w]/g, '');
    const id = crypto.randomUUID();
    cb(null, `${id}${safeExt}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_SIZE,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (BLOCKED_EXT.has(ext)) {
      return cb(new Error('That file type is not allowed.'));
    }

    if (file.mimetype === 'application/x-msdownload') {
      return cb(new Error('That file type is not allowed'));
    }

    cb(null, true);
  },
});