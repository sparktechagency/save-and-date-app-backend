import mongoose from 'mongoose';
import QueryBuilder from '../../../helpers/QueryBuilder';
import { IMessage } from './message.interface';
import { Message } from './message.model';
import { checkMongooseIDValidation } from '../../../shared/checkMongooseIDValidation';
import { Chat } from '../chat/chat.model';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import { sendPushNotification } from '../../../helpers/firebaseHelper';

const sendMessageToDB = async (payload: any): Promise<IMessage> => {

  // save to DB
  const response = await Message.create(payload);

  //@ts-ignore
  const io = global.io;
  if (io && payload.chatId) {
    // send message to specific chatId Room
    io.emit(`getMessage::${payload?.chatId}`, response);
  }


  const receiver: any = await Chat.findOne({ participants: { $in: [payload.sender] } })
    .populate({
      path: 'participants',
      select: '_id name profile fcmToken',
      match: { _id: { $ne: payload.sender } }
    })

  const message = {
    notification: {
      title: 'New Message Received',
      body: `Message=${payload.chatId}`
    },
    token: receiver?.participants[0]?.fcmToken
  }


  if (receiver?.participants[0]?.fcmToken) {
    sendPushNotification(message);
  }

  return response;
};

const getMessageFromDB = async (id: string, user: JwtPayload, query: Record<string, any>): Promise<{ messages: IMessage[], pagination: any, participant: any }> => {
  checkMongooseIDValidation(id, "Chat")

  const result = new QueryBuilder(
    Message.find({ chatId: id }).sort({ createdAt: 1 }),
    query
  ).paginate();
  const messages = await result.queryModel;
  const pagination = await result.getPaginationInfo();

  const participant = await Chat.findById(id).populate({
    path: 'participants',
    select: '-_id name profile',
    match: {
      _id: { $ne: new mongoose.Types.ObjectId(user.id) }
    }
  })

  return { messages, pagination, participant: participant?.participants[0] };
};

export const MessageService = { sendMessageToDB, getMessageFromDB };