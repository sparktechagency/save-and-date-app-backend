import { Model, Types } from 'mongoose';
import { MESSAGE } from '../../../enums/message';

export type IMessage = {
  _id?: Types.ObjectId;
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  text?: string;
  image?: string;
  type: MESSAGE
};

export type MessageModel = Model<IMessage, Record<string, unknown>>;
