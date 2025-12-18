import { prisma } from '../lib/prisma.js';
import path from 'path';
import fs from 'fs/promises';
import { validationResult } from 'express-validator';

const UPLOAD_BASE_DIR = process.env.UPLOAD_ROOT || '/home/hunter/odinStorageUploads';


async function postNewFolder(req, res, next) {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.session.flash = {
                errors: errors.array(),
                modal: {
                    id: 'tpl-add-folder',
                    formId: 'form-add-folder',
                    values: { name: req.body.name || '' },
                }

            };
            return res.redirect('/')
        }

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
            req.session.flash = {
                errors: [{ msg: 'You already have a folder with that name' }],
                modal: {
                    id: 'tpl-add-folder',
                    formId: 'form-add-folder',
                    values: { name: req.body.name || '' },
                },
            }
            return res.redirect('/');

        }
        return next(err);
    }
};

async function postUpdateFolder(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.session.flash = {
                errors: errors.array(),
                modal: {
                    id: "tpl-rename-folder",
                    formId: "form-rename-folder",
                    folderId: Number(req.params.id),
                    values: {
                        newName: req.body.newName || "",
                    },

                },
            }
            return res.redirect('/');
        };


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
            req.session.flash = {
                errors: [{ msg: 'You already have a folder with that name' }],
                dmodal: {
                    id: 'tpl-rename-folder',
                    formId: 'form-rename-folder',
                    folderId: Number(req.params.id),
                    values: {
                        newName: req.body.newName || '',
                    },
                }
            }
            return res.redirect('/');
        }
        return next(err);
    }
};

async function postDeleteFolder(req, res, next) {
    try {
        if (!req.user) return res.redirect('/');

        const folderId = Number(req.params.id);
        const userId = req.user.id;


        const folder = await prisma.folder.findFirst({
            where: { id: folderId, userId },
            select: { id: true },
        });

        if (!folder) {
            return res.status(404).send('Folder not found or not owned by you');
        }


        const folderDiskPath = path.join(UPLOAD_BASE_DIR, 'users', String(userId), String(folderId));

        try {
            await fs.rm(folderDiskPath, { recursive: true, force: true });
        } catch (fsErr) {

            console.error('Error deleting folder from disk:', fsErr.message);
        }


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