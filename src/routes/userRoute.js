import { Router } from 'express';

import controller from '../controllers/userController.js';

const router = Router();

router.post('/login', controller.postLogin);
router.post('/signup', controller.postSignup);
router.get('/signout', controller.getSignout);

export default router;