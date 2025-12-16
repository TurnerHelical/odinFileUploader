import { Router } from 'express';
import controller from '../controllers/fileController.js';
import { upload } from '../config/upload.js';
import { ensureAuth } from '../middleware/ensureAuth.js';

const router = Router();

router.post('/:folderId', ensureAuth, upload.single('file'), controller.postNewFile);
router.post('/:id/update', ensureAuth, controller.renameFilePost);
router.post('/:id/delete', ensureAuth, controller.postDeleteFile);

export default router;