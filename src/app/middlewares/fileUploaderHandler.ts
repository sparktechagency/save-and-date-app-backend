import { Request } from 'express';
import fs from 'fs/promises';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../../errors/ApiErrors';

const baseUploadDir = path.join(process.cwd(), 'uploads');

// Ensure upload directories exist
const createDir = async (dirPath: string) => {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
        console.error(`Error creating directory: ${dirPath}`, error);
    }
};

// Define storage strategy
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const uploadDirs: Record<string, string> = {
                image: path.join(baseUploadDir, 'image'),
                media: path.join(baseUploadDir, 'media'),
                doc: path.join(baseUploadDir, 'doc'),
            };

            const uploadDir = uploadDirs[file.fieldname];
            if (!uploadDir) {
                return cb(new ApiError(StatusCodes.BAD_REQUEST, 'File type not supported'), '');
            }

            await createDir(uploadDir);
            cb(null, uploadDir);
        } catch (error) {
            cb(error as any, '');
        }
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = `${file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-')}-${Date.now()}${fileExt}`;
        cb(null, fileName);
    },
});

// Define file filtering
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const mimeTypes: Record<string, string[]> = {
        image: ['image/jpeg', 'image/png', 'image/jpg'],
        media: ['video/mp4', 'audio/mpeg'],
        doc: ['application/pdf'],
    };

    if (!mimeTypes[file.fieldname] || !mimeTypes[file.fieldname].includes(file.mimetype)) {
        return cb(new ApiError(StatusCodes.BAD_REQUEST, `Invalid file type for ${file.fieldname}`));
    }
    cb(null, true);
};

const fileUploadHandler = () =>
    multer({ storage, fileFilter }).fields([
        { name: 'image', maxCount: 3 },
        { name: 'media', maxCount: 3 },
        { name: 'doc', maxCount: 3 },
    ]);

export default fileUploadHandler;