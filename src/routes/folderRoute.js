import { Router } from 'express';
import controller from '../controllers/folderController';

const router = Router();

router.post('/', controller.postNewFolder);
router.post('/:id/update', controller.postUpdateFolder);
router.get('/:id/delete', controller.getDeleteFolder);

export default router;