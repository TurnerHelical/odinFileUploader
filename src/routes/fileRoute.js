import { Router } from 'express';
import controller from '../controllers/fileController.js';
import { upload } from '../config/upload.js';
import { ensureAuth } from '../middleware/ensureAuth.js';
import { rejectPEExecutables } from "../middleware/fileCheck.js";
import { validateFileUniqueInFolder, validateNewFileDisplayName } from "../middleware/validation.js";

const router = Router();

router.post('/:folderId', ensureAuth, upload.single('file'), rejectPEExecutables, validateFileUniqueInFolder, controller.postNewFile);
router.post('/:id/update', ensureAuth, validateNewFileDisplayName, controller.renameFilePost);
router.post('/:id/delete', ensureAuth, controller.postDeleteFile);

export default router;