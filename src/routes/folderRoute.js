import { Router } from 'express';
import controller from '../controllers/folderController.js';
import { ensureAuth } from '../middleware/ensureAuth.js';
import validation from '../middleware/validation.js';

const router = Router();

router.post('/', ensureAuth, validation.validateFolder, controller.postNewFolder);
router.post('/:id/update', ensureAuth, validation.validateNewFolderName, controller.postUpdateFolder);
router.post('/:id/delete', ensureAuth, controller.postDeleteFolder);

export default router;