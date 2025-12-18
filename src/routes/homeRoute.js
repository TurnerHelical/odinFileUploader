import { Router } from 'express';
import { attachUserFolders } from '../middleware/attachUserFolders.js';
const router = Router();



router.get('/', attachUserFolders, (req, res) => {
    res.render('homepage', {
        title: 'Odin Cloud Storage',
        stylesheet: '/styles/homepage.css',
        errors: res.locals.flash?.errors || [],
        fileError: res.locals.flash?.fileError || null,
        modalState: res.locals.flash?.modal || null,
        data: res.locals.flash?.data || {},
    })
});

export default router;