import { Router } from 'express';
import { ensureAuth } from '../middleware/ensureAuth.js';
import controller from '../controllers/userController.js';
import validation from '../middleware/validation.js';

const router = Router();

router.post('/login', validation.validateLogin, controller.postLogin);
router.post('/signup', validation.validateSignup, controller.postSignup);
router.get('/signout', ensureAuth, controller.getSignout);

export default router;