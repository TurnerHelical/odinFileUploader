export async function attachUserFolders(req, res, next) {
    try {
        if (!req.user) return next();

        const folders = await prisma.folder.findMany({
            where: { userId: req.user.id },
            include: { files: true },
            orderBy: { name: 'asc' },
        });

        req.user.folders = folders;
        next();
    } catch (err) {
        return next(err);
    }

};

