import { Router } from 'express';
import { attachUserFolders } from '../middleware/attachUserFolders.js';
const router = Router();

router.get('/', attachUserFolders, (req, res) => {
    res.render('homepage', {
        title: 'Odin Cloud Storage',
        stylesheet: '/styles/homepage.css',
        errors: null,
        data: null,
    })
});

export default router;