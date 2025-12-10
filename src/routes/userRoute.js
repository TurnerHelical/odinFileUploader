import { Router } from 'express';

import controller from '../userController';

const router = Router();

router.post('/login', controller.postLogin);
router.post('/signup', controller.postSignup);
router.post('/signout', controller.postSignout);

export default router;