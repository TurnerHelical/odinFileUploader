import { upload } from '../config/upload.js';

export function uploadSingleWithFlash(fieldName) {
    const handler = upload.single(fieldName);

    return (req, res, next) => {
        handler(req, res, (err) => {
            if (!err) return next();

            let msg = err.message || 'Upload failed';
            if (err.code === "LIMIT_FILE_SIZE") msg = "File too large (max 50MB).";
            if (err.code === 'LIMIT_UNEXPECTED_FILE') msg = "Unexpected file field.";

            req.session.flash = {
                fileError: {
                    folderId: Number(req.params.folderId) || null,
                    messages: [msg],
                },

            };
            return res.redirect('/');
        });
    };
}