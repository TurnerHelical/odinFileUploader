import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import passport from '../auth/passport';

async function postLogin(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            res.render('homepage', {
                title: 'Odin Cloud Storage',
                stylesheet: '/styles/homepage.css',
                errors: [{ msg: info?.message || 'Invalid credentials' }],
                data: { email: req.body.email || '' },
            });
        }
        req.logIn(user, (err2) => {
            if (err2) {
                return next(err2);
            }
            return res.redirect('/')
        });
    })(req, res, next);
}