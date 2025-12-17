export async function attachUserFolders(req, res, next) {
    try {
        if (!req.user) return next();

        // 1) Get folders only
        const folders = await prisma.folder.findMany({
            where: { userId: req.user.id },
            orderBy: { name: "asc" },
        });

        if (folders.length === 0) {
            req.user.folders = [];
            return next();
        }

        // 2) Get files only if we have folder IDs
        const folderIds = folders.map(f => f.id);

        const files = await prisma.file.findMany({
            where: { folderId: { in: folderIds } },
            orderBy: { createdAt: "desc" },
        });

        // 3) Attach files to folders
        const byFolderId = new Map();
        for (const f of folders) byFolderId.set(f.id, { ...f, files: [] });
        for (const file of files) byFolderId.get(file.folderId)?.files.push(file);

        req.user.folders = Array.from(byFolderId.values());
        next();
    } catch (err) {
        next(err);
    }
}

