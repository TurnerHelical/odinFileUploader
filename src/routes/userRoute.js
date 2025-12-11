import { Router } from 'express';
import { ensureAuth } from '../middleware/ensureAuth.js';
import controller from '../controllers/userController.js';

const router = Router();

router.post('/login', controller.postLogin);
router.post('/signup', controller.postSignup);
router.get('/signout', ensureAuth, controller.getSignout);

export default router;