import { Router } from 'express';
import controller from '../controllers/fileController.js';
import { upload } from '../config/upload.js';
import { ensureAuth } from '../middleware/ensureAuth.js';
import { rejectPEExecutables } from "../middleware/fileCheck.js";
import validation from "../middleware/validation.js";

const router = Router();

router.post('/:folderId', ensureAuth, upload.single('file'), rejectPEExecutables, validation.validateFileUniqueInFolder, controller.postNewFile);
router.post('/:id/update', ensureAuth, validation.validateNewFileDisplayName, controller.renameFilePost);
router.post('/:id/delete', ensureAuth, controller.postDeleteFile);

export default router;