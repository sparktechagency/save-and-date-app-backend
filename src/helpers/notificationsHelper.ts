import { ClientSession } from "mongoose";
import { INotification } from "../app/modules/notification/notification.interface";
import { Notification } from "../app/modules/notification/notification.model";
import { User } from "../app/modules/user/user.model";
import { sendPushNotification } from "./firebaseHelper";


export const sendNotifications = async (payload: INotification, session?: ClientSession): Promise<INotification> => {

    const result = (await Notification.create([payload], { session }))[0];

    //@ts-ignore
    const socketIo = global.io;

    const receiver = await User.findById(payload.receiver).lean().exec();

    if (socketIo && payload.receiver) {
        socketIo.emit(`notification::${payload.receiver}`, result);
    }

    const message = {
        notification: {
            title: 'New Notification Received',
            body: `Booking=${payload.referenceId}`
        },
        token: receiver?.fcmToken
    } as any;

    console.log(message);

    
    if (receiver?.fcmToken) {
        sendPushNotification(message);
    }


    return result;
}