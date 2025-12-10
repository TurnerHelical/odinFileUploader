import express from 'express';
import path from 'path';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

import { prisma } from './lib/prisma';
import { config } from './config/env';
import passport from './auth/passport';

import indexRouter from './routes/indexRouter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
        })
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    next();
});

app.use('/', indexRouter);
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong');
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});