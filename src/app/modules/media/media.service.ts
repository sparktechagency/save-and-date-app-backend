import { Package } from '../package/package.model';
import { IMedia } from './media.interface';
import { Media } from './media.model';

const createMediaInDB = async (payload: IMedia): Promise<IMedia> => {
    const isExistPackage = await Package.findById(payload.package).lean();
    if (!isExistPackage) {
        throw new Error('Package not found');
    }
    payload.package = isExistPackage._id;
    payload.vendor = payload.vendor;

    const media = await Media.create(payload);
    if (!media) {
        throw new Error('Failed to create media');
    }
    return media;
};

export const MediaService = { createMediaInDB };
