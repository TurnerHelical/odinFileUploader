import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Where uploaded files should go
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user?.id;
    const folderId = Number(req.body.folderId); // You must pass this in your upload form

    if (!userId || !folderId) {
      return cb(new Error('Missing user or folder information.'));
    }

    // Build path: uploads/users/<userId>/<folderName>
    const uploadPath = path.join(
      process.cwd(),
      'uploads',
      'users',
      String(userId),
      String(folderId),
    );

    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    // Save the file using original name (or change if you want)
    cb(null, file.originalname);
  }
});

export const upload = multer({ storage });