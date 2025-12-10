import { Router } from 'express';
import controller from '../controllers/fileController';

const router = Router();

router.post('/', controller.postNewFile);
router.post('/:id/update', controller.postUpdateFile);
router.get('/:id/delete', controller.getDeleteFile);

export default router;