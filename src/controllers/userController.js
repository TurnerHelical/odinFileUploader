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

async function postSignup(req, res, next) {
    try {
        const password = req.body.password;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                passwordHash,
                name: req.body.name,
            },
        });
        req.login(user, (err) => {
            if (err) {
                return next(err)
            }
            return res.redirect('/');
        })
    } catch (err) {
        if (err.code === '23505') {
            return res.render('signUp', {
                title: "Sign Up Page",
                stylesheet: "/styles/signUp.css",
                errors: [{ msg: "Email or username already in use" }],
                data: req.body
            });
        }
        next(err);
    }
}

async function getSignout(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    })
}

export { postLogin, postSignup, getSignout };

