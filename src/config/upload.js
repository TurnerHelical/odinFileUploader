import multer from 'multer';
import path from 'path';
import fs from 'fs';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user?.id;
    const folderId = Number(req.params.folderId);

    if (!userId || !folderId) {
      return cb(new Error('Missing user or folder information.'));
    }

    const uploadPath = path.join(
      process.cwd(),
      'uploads',
      'users',
      String(userId),
      String(folderId),
    );


    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

export const upload = multer({ storage });