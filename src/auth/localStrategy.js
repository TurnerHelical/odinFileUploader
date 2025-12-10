import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

export const localStrategy = new LocalStrategy(
    { usernameField: email },
    async (email, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return done(null, false, { message: 'Invalid credentials' })
            }
            const match = await bcrypt.compare(password, user.passwordHash);
            if (!match) {
                return done(null, false, { message: 'Invalid credentials' })
            }
        } catch (err) {
            return done(err);
        }
    }
)