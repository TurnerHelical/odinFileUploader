import { prisma } from '../lib/prisma.js';
import path from 'path';
import { validationResult } from 'express-validator';
import fs from 'fs/promises';

async function postNewFile(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.flash = {
                errors: errors.array(),
                modal: {
                    id: 'tpl-add-file',
                    formId: 'form-add-file',
                    folderId: Number(req.params.folderId),
                },
            };
            return res.redirect('/');
        };

        const userId = req.user.id;
        const folderId = Number(req.params.folderId);

        const folder = await prisma.folder.findFirst({
            where: {
                id: folderId,
                userId,
            }
        });

        if (!folder) {
            return res.status(400).send("Folder not found.");
        }

        await prisma.file.create({
            data: {
                displayName: req.file.originalname,
                storedAs: req.file.filename,
                mimeType: req.file.mimetype,
                size: req.file.size,
                storagePath: req.file.path,
                url: null,
                folderId: folder.id,
                userId
            }
        });

        return res.redirect(`/`);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).send('A file with that name already exists in this folder.');
        }
        next(err);
    }
}

async function renameFilePost(req, res, next) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.session.flash = {
                errors: errors.array(),
                modal: {
                    id: "tpl-rename-file",
                    formId: "form-rename-file",
                    fileId: Number(req.params.id),
                    values: {
                        newName: req.body.newName || "",
                    },
                },
            };
            return res.redirect('/');
        };

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

        // 3) Update DB
        const result = await prisma.file.updateMany({
            where: {
                id: fileId,
                userId,
            },
            data: {
                displayName: newName,
            },
        });

        if (result.count === 0) {
            return res.status(404).send('File not found or not owned by you');
        }

        return res.redirect('/');
    } catch (err) {
        return next(err);
    }
}
async function postDeleteFile(req, res, next) {
    try {
        if (!req.user) return res.redirect('/');

        const fileId = Number(req.params.id); // still from the URL
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

        // Remove file from disk
        if (file.storagePath) {
            try {
                await fs.unlink(file.storagePath);
            } catch (fsErr) {
                // File might already be gone — log and continue
                console.error('Error deleting file from disk:', fsErr.message);
            }
        }

        // Remove DB record
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

export default { postNewFile, renameFilePost, postDeleteFile };