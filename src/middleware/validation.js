import { body } from 'express-validator';
import { prisma } from '../lib/prisma.js';

const validateSignup = [
    body('signupName').trim()
        .optional({ checkFalsy: true })
        .matches(/^[a-zA-Z'-]+$/).withMessage('Must contain only letters, hyphens, or apostrophes').bail()
        .isLength({ max: 30 }).withMessage('Must be less than 30 characters'),
    body('signupEmail').trim()
        .notEmpty().withMessage('Email is required').bail()
        .isEmail().withMessage('Must be valid email').bail()
        .isLength({ max: 254 }).withMessage('Email must be less than 255 characters').bail()
        .custom(async (value) => {
            const checkUnique = await prisma.findUnique(value);
            if (checkUnique) {
                throw new Error("Email is already registered");
            }
            return true
        }),
    body('signupPassword').trim()
        .notEmpty().withMessage('Password is required').bail()
        .isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
        }).withMessage('Password must contain at least 6 characters, 1 lowercase, 1 uppercase, and 1 special character'),
    body('signupConfirmPassword').trim()
        .notEmpty().withMessage('Please confirm password').bail()
        .custom((value, { req }) => {
            if (value !== req.body.signupPassword) {
                throw new Error("Passwords don't match");
            }
            return true
        }),
];

const validateLogin = [
    body('loginEmail').trim()
        .notEmpty().withMessage('Please enter the email associated with your account').bail()
        .isLength({ max: 255 }).withMessage('Email must be less than 255 characters long'),
    body('loginPassword').trim()
        .notEmpty().withMessage('Please enter your password')
];

const validateFolder = [
    body('folderName').trim()
        .notEmpty().withMessage('Folder must have a name').bail()
        .isLength({ max: 60 }).withMessage('Folder name must be 60 chars or less').bail()
        .custom(async (value, { req }) => {
            const existing = await prisma.folder.findFirst({
                where: {
                    userId: req.user.id,
                    name: value,
                },
                select: { id: true },
            });
            if (existing) {
                throw new Error('You already have a folder with this name');
            }
            return true;
        }),
];

const validateFileUniqueInFolder = [
    body().custom(async (_, { req }) => {
        if (!req.user) throw new Error('Not authenticated');
        if (!req.file) throw new Error('Please attach a file');

        const folderId = Number.parseInt(req.params.folderId, 10);
        if (!Number.isInteger(folderId) || folderId <= 0) {
            throw new Error('Invalid folder');
        }

        const existing = await prisma.file.findFirst({
            where: {
                displayName: req.file.originalname,
                folderId,
                userId: req.user.id,
            },
            select: { id: true },
        });

        if (existing) {
            throw new Error('A file with this name already exists in this folder');
        }

        return true;
    }),
];

const validateNewFileDisplayName = [
    body('newName').trim()
        .notEmpty().withMessage('New name is required')
        .isLength({ max: 60 }).withMessage('Name must be 60 chars or less.')
        .custom(async (value, { req }) => {
            const folderId = Number.parseInt(req.params.folderId, 10);
            if (!Number.isInteger(folderId) || folderId <= 0) {
                throw new Error('Invalid folder');
            }

            const existing = await prisma.file.findFirst({
                where: {
                    displayName: req.body.newName,
                    folderId,
                    userId: req.user.id
                },
                select: { id: true },
            });
            if (existing) {
                throw new Error("A file with this name already exists");
            }
            return true;
        }),
];

export default { validateLogin, validateSignup, validateFolder, validateFileUniqueInFolder, validateNewFileDisplayName }