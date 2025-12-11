import { prisma } from '../lib/prisma.js';

async function postNewFolder(req, res, next) {
    try {
        if (!req.user) {
            return res.redirect('/');
        }
        console.log(req.body.name);
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
        const folderId = Number(req.params.id);
        const userId = req.user.id;
        const { newName } = req.body;

        if (!newName) {
            return res.status(400).send('New folder name is required');
        }
        const result = await prisma.folder.updateMany({
            where: {
                id: folderId,
                userId,
            },
            data: {
                name: newName,
            },
        });
        if (result.count === 0) {
            return res.status(404).send('Folder not found or not owned by you');
        }
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