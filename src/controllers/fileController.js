import { prisma } from '../lib/prisma.js';
import path from 'path';
import fs from 'fs/promises';

async function postNewFile(req, res, next) {
    try {
        const userId = req.user.id;
        const folderId = Number(req.body.folderId);

        const folder = await prisma.folder.findFirst({
            where: {
                id: folderId,
                userId
            }
        });

        if (!folder) {
            return res.status(400).send("Folder not found.");
        }

        await prisma.file.create({
            data: {
                name: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                storagePath: req.file.path,
                url: null,
                folderId: folder.id,
                userId
            }
        });

        res.redirect(`/`);
    } catch (err) {
        next(err);
    }
}

async function renameFilePost(req, res, next) {
    try {
        if (!req.user) return res.redirect('/');

        const fileId = Number(req.params.id);
        const userId = req.user.id;
        const { newName } = req.body;

        if (!newName) {
            return res.status(400).send('New name is required');
        }

        // 1) Get the file record and ensure it belongs to this user
        const file = await prisma.file.findFirst({
            where: {
                id: fileId,
                userId,
            },
        });

        if (!file) {
            return res.status(404).send('File not found');
        }

        const oldPath = file.storagePath;

        const ext = path.extname(file.name);
        const base = path.basename(newName, path.extname(newName));
        const finalName = base + ext;

        const dir = path.dirname(oldPath);
        const newPath = path.join(dir, finalName);

        // 2) Rename on disk
        await fs.rename(oldPath, newPath);

        // 3) Update DB
        const result = await prisma.file.updateMany({
            where: {
                id: fileId,
                userId,
            },
            data: {
                name: finalName,
                storagePath: newPath,
            },
        });

        if (result.count === 0) {
            // In a perfect world, we’d roll back the fs.rename here, but usually this won't happen.
            return res.status(404).send('File not found or not owned by you');
        }

        return res.redirect('/');
    } catch (err) {
        return next(err);
    }
}
async function getDeleteFile(req, res, next) {
    try {
        if (!req.user) return res.redirect('/');

        const fileId = Number(req.params.id);
        const userId = req.user.id;

        const file = await prisma.file.findFirst({
            where: {
                id: fileId,
                userId,
            },
        });

        if (!file) {
            return res.status(404).send('File not found');
        }

        // Try to remove the file from disk if we have a path
        if (file.storagePath) {
            try {
                await fs.unlink(file.storagePath);
            } catch (fsErr) {
                // Log and continue – maybe file already gone
                console.error('Error deleting file from disk:', fsErr.message);
            }
        }

        await prisma.file.deleteMany({
            where: {
                id: fileId,
                userId,
            },
        });

        return res.redirect('/');
    } catch (err) {
        return next(err);
    }
}

export default { postNewFile, renameFilePost, getDeleteFile };