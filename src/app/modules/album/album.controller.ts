import { Request, Response, NextFunction } from 'express';
import { AlbumService } from './album.service';
import sendResponse from '../../../shared/sendResponse';

const createAlbum = async (req: Request, res: Response, next: NextFunction) => {
    const result = await AlbumService.createAlbum(req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Album created successfully',
        data: result
    })
}

export const AlbumController = { createAlbum };
