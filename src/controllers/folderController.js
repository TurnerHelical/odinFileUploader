import { prisma } from '../lib/prisma.js';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_BASE_DIR = process.env.UPLOAD_ROOT || '/home/hunter/odinStorageUploads';


async function postNewFolder(req, res, next) {
    try {
        if (!req.user) {
            return res.redirect('/');
        };
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

async function postDeleteFolder(req, res, next) {
    try {
        if (!req.user) return res.redirect('/');

        const folderId = Number(req.params.id);
        const userId = req.user.id;

        // 1) Make sure folder exists + belongs to the user
        const folder = await prisma.folder.findFirst({
            where: { id: folderId, userId },
            select: { id: true },
        });

        if (!folder) {
            return res.status(404).send('Folder not found or not owned by you');
        }

        // 2) Delete folder directory on disk (recursive)
        // Your disk structure is .../users/<userId>/<folderId>/...
        const folderDiskPath = path.join(UPLOAD_BASE_DIR, 'users', String(userId), String(folderId));

        try {
            await fs.rm(folderDiskPath, { recursive: true, force: true });
        } catch (fsErr) {
            // If you want to *block* DB deletion when disk deletion fails, return next(fsErr) instead.
            console.error('Error deleting folder from disk:', fsErr.message);
        }

        // 3) Delete DB rows
        await prisma.$transaction([
            prisma.file.deleteMany({ where: { folderId, userId } }),
            prisma.folder.deleteMany({ where: { id: folderId, userId } }),
        ]);

        return res.redirect('/');
    } catch (err) {
        return next(err);
    }
}


export default { postDeleteFolder, postNewFolder, postUpdateFolder };