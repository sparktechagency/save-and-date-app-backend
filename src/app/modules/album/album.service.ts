import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IAlbum } from './album.interface';
import { Album } from './album.model';

const createAlbum = async (payload: IAlbum): Promise<IAlbum> => {
    const album = await Album.create(payload);
    if (!album) {
        throw new ApiError( StatusCodes.BAD_REQUEST, 'Failed to create album');
    }
    return album;
};

export const AlbumService = { createAlbum };
