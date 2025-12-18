import multer from 'multer';
import { upload } from '../config/upload.js';

export function uploadSingleWithFlash(fieldName) {
    const handler = upload.single(fieldName);

    return (req, res, next) => {
        handler(req, res, (err) => {
            if (!err) return next();

            let msg = err.message || 'Upload failed';

            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    msg = 'File too large (max 50MB).';
                }
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    msg = 'Unexpected file field.';
                }
            }

            const folderId = Number(req.params.folderId) || null;

            req.session.flash = {
                // ✅ per-folder file error
                fileError: {
                    folderId,
                    messages: [msg],
                },

                // ✅ reopen the Add File modal for this folder
                modal: {
                    id: 'tpl-add-file',
                    formId: 'form-add-file',
                    folderId,
                },
            };

            return res.redirect('/');
        });
    };
}