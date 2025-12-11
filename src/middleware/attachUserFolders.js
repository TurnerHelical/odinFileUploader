export async function attachUserFolders(req, res, next) {
    if (!req.user) return next();

    const folders = await prisma.folder.findMany({
        where: { userId: req.user.id },
        orderBy: { name: 'asc' },
    });

    req.user.folders = folders;
    next();
}

