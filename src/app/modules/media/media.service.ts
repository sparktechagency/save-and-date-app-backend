import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { Album } from '../album/album.model';
import { IMedia } from './media.interface';
import { Media } from './media.model';

const createMediaInDB = async (payload: IMedia): Promise<IMedia> => {
    const isExistAlbum = await Album.findById(payload.album).lean();
    if (!isExistAlbum) {
        throw new ApiError( StatusCodes.BAD_REQUEST,'Album not found');
    }
    payload.album = isExistAlbum._id;
    payload.package = isExistAlbum.package;
    payload.vendor = payload.vendor;

    const media = await Media.create(payload);
    if (!media) {
        throw new ApiError( StatusCodes.BAD_REQUEST,'Failed to create media');
    }
    return media;
};

export const MediaService = { createMediaInDB };
