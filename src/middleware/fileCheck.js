import fs from 'fs/promises';

export async function rejectPEExecutables(req, res, next) {
    try {
        if (!req.file) return next();

        const fh = await fs.open(req.file.path, 'r');
        const buf = Buffer.alloc(2);
        await fh.read(buf, 0, 2, 0);
        await fh.close();

        // "MZ" header => Windows executable / DLL
        if (buf[0] === 0x4D && buf[1] === 0x5A) {
            // delete the uploaded file immediately
            await fs.unlink(req.file.path).catch(() => { });
            return res.status(400).send('Executable files are not allowed.');
        }

        next();
    } catch (err) {
        next(err);
    }
}
