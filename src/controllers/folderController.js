import { prisma } from '../lib/prisma.js';

async function postNewFolder(req, res, next) {
    try {
        if (!req.user) {
            return res.redirect('/');
        }
        await prisma.folder.create({
            data: {
                name: req.body.name,
                userId: req.user.id,
            }
        });
        return res.redirect('/');
    } catch (err) {
        if (err.code === 'P2002') {
            return res.render('homepage', {
                errors: [{ msg: 'You already have a folder with that name' }],
                data: { folderName: req.body.name },
            })
        }
        return next(err);
    }
};

async function postUpdateFolder(req, res, next) {
    try {
        if (!req.user) {
            return res.redirect('/');
        }
        await prisma.folder.updateMany({
            where: {
                id: Number(req.params.id),
                userId: req.user.id,
            },
            data: {
                name: req.body.name,
            },
        });
        return res.redirect('/');
    } catch (err) {
        if (err.code === 'P2002') {
            return res.render('homepage', {
                errors: [{ msg: 'You already have a folder with that name' }],
                data: { folderName: req.body.name },
            })
        }
        return next(err);
    }
};

async function getDeleteFolder(req, res, next) {
    try {
        if (!req.user) {
            return res.redirect('/')
        }
        await prisma.$transaction([
            prisma.file.deleteMany({
                where: {
                    folderId: Number(req.params.id),
                    userId: req.user.id,
                },
            }),
            prisma.folder.deleteMany({
                where: {
                    id: Number(req.params.id),
                    userId: req.user.id,
                }
            })
        ]);
        return res.redirect('/')
    } catch (err) {
        return next(err);
    }
};

export default { getDeleteFolder, postNewFolder, postUpdateFolder };