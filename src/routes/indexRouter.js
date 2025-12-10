import { Router } from 'express';


import homeRoute from './homeRoute';
import userRoute from './userRoute';
import fileRoute from './fileRoute';
import folderRoute from './folderRoute';

const router = Router();

router.use('/', homeRoute);
router.use('/user', userRoute);
router.use('/file', fileRoute);
router.use('/folder', folderRoute);

export default router;