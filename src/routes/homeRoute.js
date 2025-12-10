import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('homepage', {
        title: 'Odin Cloud Storage',
        stylesheet: '/styles/homepage.css',
        errors: null,
    })
});

export default router;