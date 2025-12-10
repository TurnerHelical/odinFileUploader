import passport from 'passport';
import { prisma } from '../lib/prisma.js';
import { localStrategy } from './localStrategy.js';

passport.use(localStrategy);

passport.serializUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;