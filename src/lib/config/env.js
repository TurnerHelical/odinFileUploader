import dotenv from 'dotenv';
dotenv.config();


export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret',
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
};