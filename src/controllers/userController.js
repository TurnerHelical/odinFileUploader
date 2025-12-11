import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcrypt';
import passport from '../auth/passport.js';

async function postLogin(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('homepage', {
                errors: [{ msg: info?.message || 'Invalid credentials' }],
                data: { email: req.body.loginEmail || '' },
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

        const passwordHash = await bcrypt.hash(req.body.signupPassword, 10);

        const user = await prisma.user.create({
            data: {
                email: req.body.signupEmail,
                passwordHash,
                name: req.body.signupName,
            },
        });
        req.login(user, (err) => {
            if (err) {
                return next(err)
            }
            return res.redirect('/');
        })
    } catch (err) {
        if (err.code === 'P2002') {
            return res.render('signUp', {
                errors: [{ msg: "Email or username already in use" }],
                data: req.body
            });
        }
        return next(err);
    }
}

async function getSignout(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/');
    })
}

export default { postLogin, postSignup, getSignout };

