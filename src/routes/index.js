import { Router } from 'express';

import homeRoutes from './homeRoutes.js';
import authRoutes from './authRoutes.js';
import fileRoutes from './fileRoutes.js';
import folderRoutes from './folderRoutes.js';

const router = Router();

router.use('/', homeRoutes);
router.use('/auth', authRoutes);
router.use('/file', fileRoutes);
router.use('/folder', folderRoutes);

export default router;