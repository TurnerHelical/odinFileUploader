import { Router } from 'express';
import controller from '../controllers/fileController.js';
import { upload } from '../config/upload.js';
import { ensureAuth } from '../middleware/ensureAuth.js';

const router = Router();

router.post('/:folderId', ensureAuth, upload.single('file'), controller.postNewFile);
router.post('/:id/update', ensureAuth, controller.renameFilePost);
router.get('/:id/delete', ensureAuth, controller.getDeleteFile);

export default router;