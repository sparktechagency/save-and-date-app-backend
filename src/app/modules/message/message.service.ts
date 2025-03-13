import mongoose from 'mongoose';
import QueryBuilder from '../../../helpers/QueryBuilder';
import { IMessage } from './message.interface';
import { Message } from './message.model';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
import { checkMongooseIDValidation } from '../../../shared/checkMongooseIDValidation';

const sendMessageToDB = async (payload: any): Promise<IMessage> => {

  // save to DB
  const response = await Message.create(payload);

  //@ts-ignore
  const io = global.io;
  if (io && payload.chatId) {
    // send message to specific chatId Room
    io.emit(`getMessage::${payload?.chatId}`, response);
  }

  return response;
};

const getMessageFromDB = async (id: string, query: Record<string, any>): Promise<{ messages: IMessage[], pagination: any }> => {

  checkMongooseIDValidation(id)

  const result = new QueryBuilder(Message.find({ chatId: id }), query).paginate();
  const messages = await result.queryModel.sort({ createdAt: -1 });
  const pagination = await result.getPaginationInfo();

  return { messages, pagination };
};

export const MessageService = { sendMessageToDB, getMessageFromDB };