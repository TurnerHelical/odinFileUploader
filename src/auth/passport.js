import passport from 'passport';
import { prisma } from '../lib/prisma';
import { localStrategy } from './localStrategy';

passport.use(localStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch {
        done(err);
    }
});

export default passport;