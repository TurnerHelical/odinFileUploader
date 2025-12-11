import { Router } from 'express';
import controller from '../controllers/folderController.js';
import { ensureAuth } from '../middleware/ensureAuth.js';

const router = Router();

router.post('/', ensureAuth, controller.postNewFolder);
router.post('/:id/update', ensureAuth, controller.postUpdateFolder);
router.get('/:id/delete', ensureAuth, controller.getDeleteFolder);

export default router;