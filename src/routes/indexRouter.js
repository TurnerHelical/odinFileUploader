import { Router } from 'express';


import homeRoute from './homeRoute.js';
import userRoute from './userRoute.js';
import fileRoute from './fileRoute.js';
import folderRoute from './folderRoute.js';

const router = Router();

router.use('/', homeRoute);
router.use('/user', userRoute);
router.use('/file', fileRoute);
router.use('/folder', folderRoute);

export default router;