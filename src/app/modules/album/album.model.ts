import { model, Schema } from 'mongoose';
import { AlbumModel, IAlbum } from './album.interface';

const albumSchema = new Schema<IAlbum, AlbumModel>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    }
  },
  {timestamps: true}
);

export const Album = model<IAlbum, AlbumModel>('Album', albumSchema);