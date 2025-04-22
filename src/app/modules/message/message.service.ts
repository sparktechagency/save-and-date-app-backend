import mongoose from 'mongoose';
import QueryBuilder from '../../../helpers/QueryBuilder';
import { IMessage } from './message.interface';
import { Message } from './message.model';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
import { checkMongooseIDValidation } from '../../../shared/checkMongooseIDValidation';
import { Chat } from '../chat/chat.model';
import { JwtPayload } from 'jsonwebtoken';

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

const getMessageFromDB = async (id: string, user: JwtPayload, query: Record<string, any>): Promise<{ messages: IMessage[], pagination: any, participant:any  }> => {
  checkMongooseIDValidation(id)

  const result = new QueryBuilder(Message.find({ chatId: id }), query).paginate();
  const messages = await result.queryModel.sort({ createdAt: -1 });
  const pagination = await result.getPaginationInfo();

  const participant = await Chat.findById(id).populate({
    path: 'participants',
    select: '-_id firstName lastName profile',
    match: {
      _id: { $ne: new mongoose.Types.ObjectId(user.id) }
    }
  })

  return { messages, pagination, participant: participant?.participants[0] };
};

export const MessageService = { sendMessageToDB, getMessageFromDB };